import { useState, useCallback, useRef, useEffect } from 'react';
import { TrieNode, VisualTrieNode, VisualTrieEdge, TrieOperation } from '../types';
import { sleep } from '../../../shared/utils/time';
import { useSound } from '../../../shared/context/SoundContext';

const ROOT_ID = 'root';
const NODE_RADIUS = 20;
const LEVEL_HEIGHT = 80;
const MIN_NODE_SPACING = 50;

export const useTrie = () => {
  const [root, setRoot] = useState<TrieNode>({
    id: ROOT_ID,
    char: '',
    children: {},
    isEndOfWord: false,
    x: 0,
    y: 0
  });

  const [visualNodes, setVisualNodes] = useState<VisualTrieNode[]>([]);
  const [visualEdges, setVisualEdges] = useState<VisualTrieEdge[]>([]);
  const [operation, setOperation] = useState<TrieOperation>('idle');
  const [message, setMessage] = useState<string>('Ready');
  const [speed, setSpeed] = useState<number>(500);
  
  // Highlighting
  const [activeNodeIds, setActiveNodeIds] = useState<Set<string>>(new Set());
  const [foundNodeIds, setFoundNodeIds] = useState<Set<string>>(new Set());

  const { play } = useSound();
  const speedRef = useRef(speed);
  speedRef.current = speed;
  const isMounted = useRef(true);
  const rootRef = useRef(root);
  rootRef.current = root;

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const wait = async (): Promise<void> => {
    await sleep(speedRef.current);
    if (!isMounted.current) throw new Error('Unmounted');
  };

  // --- Layout Algorithm ---
  // Calculates tree width to prevent overlaps
  const calculateLayout = useCallback((node: TrieNode, level: number = 0): { width: number, nodes: VisualTrieNode[], edges: VisualTrieEdge[] } => {
    const childrenKeys = Object.keys(node.children).sort();
    
    // Base case: Leaf node
    if (childrenKeys.length === 0) {
      const vNode: VisualTrieNode = {
        id: node.id,
        char: node.char,
        x: 0, // Will be adjusted by parent
        y: level * LEVEL_HEIGHT + 40,
        isEndOfWord: node.isEndOfWord,
        state: 'default'
      };
      return { width: MIN_NODE_SPACING, nodes: [vNode], edges: [] };
    }

    let totalWidth = 0;
    const childLayouts: { width: number, nodes: VisualTrieNode[], edges: VisualTrieEdge[], key: string }[] = [];

    // Process children
    for (const key of childrenKeys) {
      const layout = calculateLayout(node.children[key], level + 1);
      childLayouts.push({ ...layout, key });
      totalWidth += layout.width;
    }

    // Adjust positions
    let currentX = -(totalWidth / 2);
    let allNodes: VisualTrieNode[] = [];
    let allEdges: VisualTrieEdge[] = [];

    const vNode: VisualTrieNode = {
      id: node.id,
      char: node.char,
      x: 0, // Will be set by parent, relative 0 here means center of subtree
      y: level * LEVEL_HEIGHT + 40,
      isEndOfWord: node.isEndOfWord,
      state: 'default'
    };
    allNodes.push(vNode);

    for (const child of childLayouts) {
      const childCenterX = currentX + (child.width / 2);
      
      // Shift child subtree nodes
      child.nodes.forEach(n => {
        n.x += childCenterX;
      });
      allNodes = [...allNodes, ...child.nodes];

      // Shift edges
      child.edges.forEach(e => {
        e.x1 += childCenterX;
        e.x2 += childCenterX;
      });
      allEdges = [...allEdges, ...child.edges];

      // Create edge from current node to child
      const childRoot = child.nodes.find(n => n.y === (level + 1) * LEVEL_HEIGHT + 40); // Find the immediate child
      if (childRoot) {
        allEdges.push({
          id: `${node.id}-${childRoot.id}`,
          x1: 0,
          y1: vNode.y,
          x2: childRoot.x,
          y2: childRoot.y,
          char: child.key,
          state: 'default'
        });
      }

      currentX += child.width;
    }

    return { width: totalWidth, nodes: allNodes, edges: allEdges };
  }, []);

  // Sync Layout
  useEffect(() => {
    if (!root) return;
    const { nodes, edges } = calculateLayout(root);
    
    // Shift entire tree to center of canvas (assuming 800px width canvas conceptually, centered at 0)
    // Actually our TrieCanvas is responsive, let's just keep 0 as center.
    // Map states
    const finalNodes = nodes.map(n => ({
      ...n,
      state: (foundNodeIds.has(n.id) ? 'found' : activeNodeIds.has(n.id) ? 'active' : 'default') as VisualTrieNode['state']
    }));

    // Highlight edges if both nodes are active/found
    const finalEdges = edges.map(e => {
       const sourceActive = activeNodeIds.has(e.id.split('-')[0]) || foundNodeIds.has(e.id.split('-')[0]);
       const targetActive = activeNodeIds.has(e.id.split('-')[1]) || foundNodeIds.has(e.id.split('-')[1]);
       return {
         ...e,
         state: ((sourceActive && targetActive) ? 'active' : 'default') as VisualTrieEdge['state']
       };
    });

    setVisualNodes(finalNodes);
    setVisualEdges(finalEdges);
  }, [root, activeNodeIds, foundNodeIds, calculateLayout]);

  const insert = useCallback(async (word: string, animate = true) => {
    if (operation !== 'idle' && animate) return;
    if (!word) return;
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!cleanWord) return;

    try {
      if (animate) {
        setOperation('inserting');
        setMessage(`Inserting "${cleanWord}"...`);
        setActiveNodeIds(new Set([ROOT_ID]));
        await wait();
      }

      // Deep copy root to mutate
      const newRoot = JSON.parse(JSON.stringify(rootRef.current));
      let current = newRoot;

      for (let i = 0; i < cleanWord.length; i++) {
        const char = cleanWord[i];
        
        if (!current.children[char]) {
          if (animate) setMessage(`Creating node for '${char}'...`);
          current.children[char] = {
            id: Math.random().toString(36).substr(2, 9),
            char,
            children: {},
            isEndOfWord: false,
            x: 0, y: 0
          };
          if (animate) {
            // Update state to show new node
            setRoot({...newRoot}); 
            play('insert');
            await wait();
          }
        } else {
           if (animate) setMessage(`'${char}' exists. Traversing...`);
        }
        
        current = current.children[char];
        if (animate) {
          setActiveNodeIds(prev => new Set(prev).add(current.id));
          await wait();
        }
      }

      current.isEndOfWord = true;
      if (animate) {
        setMessage(`Marked end of word "${cleanWord}".`);
        play('success');
        setRoot(newRoot);
        await wait();
        setActiveNodeIds(new Set());
        setOperation('idle');
      } else {
        setRoot(newRoot);
      }
    } catch (e) {
      // unmounted
    }
  }, [operation, wait, play]);

  const search = useCallback(async (word: string) => {
    if (operation !== 'idle') return;
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!cleanWord) return;

    try {
      setOperation('searching');
      setMessage(`Searching for "${cleanWord}"...`);
      setActiveNodeIds(new Set([ROOT_ID]));
      setFoundNodeIds(new Set());
      await wait();

      let current = rootRef.current;
      let pathIds = new Set([ROOT_ID]);

      for (let i = 0; i < cleanWord.length; i++) {
        const char = cleanWord[i];
        if (current.children[char]) {
          current = current.children[char];
          pathIds.add(current.id);
          setActiveNodeIds(new Set(pathIds));
          setMessage(`Found '${char}'. Continuing...`);
          play('click');
          await wait();
        } else {
          setMessage(`'${char}' not found. Word does not exist.`);
          play('error');
          await wait();
          setOperation('idle');
          setActiveNodeIds(new Set());
          return;
        }
      }

      if (current.isEndOfWord) {
        setMessage(`Found word "${cleanWord}"!`);
        setFoundNodeIds(new Set([current.id]));
        play('success');
      } else {
        setMessage(`Prefix "${cleanWord}" exists, but it's not a complete word.`);
        play('error');
      }
      await wait();
      setActiveNodeIds(new Set());
      setOperation('idle');
    } catch (e) {}
  }, [operation, wait, play]);

  const startsWith = useCallback(async (prefix: string) => {
    if (operation !== 'idle') return;
    const cleanPrefix = prefix.toLowerCase().replace(/[^a-z]/g, '');
    
    try {
      setOperation('autocomplete');
      setMessage(`Finding words starting with "${cleanPrefix}"...`);
      setActiveNodeIds(new Set([ROOT_ID]));
      setFoundNodeIds(new Set());
      
      let current = rootRef.current;
      let pathIds = new Set([ROOT_ID]);

      // 1. Traverse to end of prefix
      for (let i = 0; i < cleanPrefix.length; i++) {
        const char = cleanPrefix[i];
        if (current.children[char]) {
          current = current.children[char];
          pathIds.add(current.id);
        } else {
          setMessage("Prefix not found.");
          setOperation('idle');
          setActiveNodeIds(new Set());
          return;
        }
      }
      
      setActiveNodeIds(pathIds);
      await wait();

      // 2. DFS to find all words
      const matches: string[] = [];
      const collectIds = new Set<string>();
      
      const dfs = (node: TrieNode, pathStr: string) => {
        collectIds.add(node.id);
        if (node.isEndOfWord) {
          matches.push(pathStr);
        }
        Object.keys(node.children).forEach(key => {
          dfs(node.children[key], pathStr + key);
        });
      };

      dfs(current, cleanPrefix);
      
      setFoundNodeIds(collectIds);
      setMessage(`Found ${matches.length} matches: ${matches.slice(0, 3).join(', ')}${matches.length > 3 ? '...' : ''}`);
      play('success');
      
      await sleep(2000); // Hold results longer
      setOperation('idle');
      setActiveNodeIds(new Set());
      setFoundNodeIds(new Set());

    } catch (e) {}
  }, [operation, wait, play]);

  const reset = useCallback(() => {
    setRoot({
      id: ROOT_ID,
      char: '',
      children: {},
      isEndOfWord: false,
      x: 0, y: 0
    });
    setOperation('idle');
    setMessage('Trie cleared.');
    setActiveNodeIds(new Set());
    setFoundNodeIds(new Set());
  }, []);

  const buildTree = useCallback(async (words: string[]) => {
    reset();
    // Use a non-animated update for speed, then set state
    setTimeout(() => {
       const newRoot: TrieNode = { id: ROOT_ID, char: '', children: {}, isEndOfWord: false, x: 0, y: 0 };
       
       words.forEach(word => {
         const clean = word.toLowerCase().replace(/[^a-z]/g, '');
         if(!clean) return;
         let curr = newRoot;
         for(const char of clean) {
           if(!curr.children[char]) {
             curr.children[char] = { id: Math.random().toString(36).substr(2,9), char, children: {}, isEndOfWord: false, x: 0, y: 0 };
           }
           curr = curr.children[char];
         }
         curr.isEndOfWord = true;
       });
       
       setRoot(newRoot);
       setMessage(`Built tree with ${words.length} words.`);
       play('success');
    }, 100);
  }, [reset, play]);

  return {
    visualNodes,
    visualEdges,
    operation,
    message,
    insert,
    search,
    startsWith,
    reset,
    buildTree,
    speed,
    setSpeed
  };
};