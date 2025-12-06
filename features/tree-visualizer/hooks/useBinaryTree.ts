import { useState, useCallback, useRef, useEffect } from 'react';
import { TreeNode, VisualNode, VisualEdge, TreeOperation } from '../types';
import { sleep } from '../../../shared/utils/time';
import { useSound } from '../../../shared/context/SoundContext';

const FRAME_WIDTH = 1000;
const VERTICAL_SPACING = 80;

export const useBinaryTree = () => {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [visualNodes, setVisualNodes] = useState<VisualNode[]>([]);
  const [visualEdges, setVisualEdges] = useState<VisualEdge[]>([]);
  const [operation, setOperation] = useState<TreeOperation>('idle');
  const [message, setMessage] = useState<string>('Ready to visualize');
  const [speed, setSpeed] = useState<number>(500);
  
  const { play } = useSound();

  // Highlighting state
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [foundNodeId, setFoundNodeId] = useState<string | null>(null);
  const [modifyingNodeId, setModifyingNodeId] = useState<string | null>(null);
  const [externalHighlightVal, setExternalHighlightVal] = useState<number | null>(null);

  // Refs for async access to latest state and mounting status
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

  // Layout Algorithm
  const calculateLayout = useCallback((node: TreeNode | null, x: number, y: number, level: number, parentX?: number): { nodes: VisualNode[], edges: VisualEdge[] } => {
    if (!node) return { nodes: [], edges: [] };

    node.x = x;
    node.y = y;

    const vNode: VisualNode = {
      id: node.id,
      value: node.value,
      x,
      y,
      state: 'default'
    };

    const offset = FRAME_WIDTH / (Math.pow(2, level + 2));
    
    const leftResult = calculateLayout(node.left, x - offset, y + VERTICAL_SPACING, level + 1, x);
    const rightResult = calculateLayout(node.right, x + offset, y + VERTICAL_SPACING, level + 1, x);

    const currentEdges: VisualEdge[] = [];
    if (node.left) {
      currentEdges.push({ id: `${node.id}-${node.left.id}`, x1: x, y1: y, x2: node.left.x, y2: node.left.y });
    }
    if (node.right) {
      currentEdges.push({ id: `${node.id}-${node.right.id}`, x1: x, y1: y, x2: node.right.x, y2: node.right.y });
    }

    return {
      nodes: [vNode, ...leftResult.nodes, ...rightResult.nodes],
      edges: [...currentEdges, ...leftResult.edges, ...rightResult.edges]
    };
  }, []);

  // Sync visual state
  useEffect(() => {
    if (!root) {
      setVisualNodes([]);
      setVisualEdges([]);
      return;
    }

    const { nodes, edges } = calculateLayout(root, FRAME_WIDTH / 2, 50, 0);

    const styledNodes = nodes.map(n => {
      let state: VisualNode['state'] = 'default';
      if (n.id === foundNodeId) state = 'found';
      else if (n.id === activeNodeId) state = 'highlighted';
      else if (n.id === modifyingNodeId) state = 'modifying';
      else if (externalHighlightVal !== null && n.value === externalHighlightVal) state = 'highlighted';

      return { ...n, state };
    });

    setVisualNodes(styledNodes);
    setVisualEdges(edges);
  }, [root, activeNodeId, foundNodeId, modifyingNodeId, externalHighlightVal, calculateLayout]);

  const insert = useCallback(async (value: number, animate = true) => {
    if (operation !== 'idle' && animate) return;
    try {
      if (animate) setOperation('inserting');
      
      const newNode: TreeNode = {
        id: Math.random().toString(36).substr(2, 9),
        value,
        left: null,
        right: null,
        x: 0, 
        y: 0
      };

      if (!rootRef.current) {
        if (animate) {
          setMessage(`Tree is empty. Setting ${value} as root.`);
          await wait();
        }
        setRoot(newNode);
        if (animate) {
          setFoundNodeId(newNode.id);
          setMessage(`Inserted ${value}.`);
          play('insert');
          setOperation('idle');
        }
        return;
      }

      // Animated traversal
      if (animate) {
        let current = rootRef.current;
        setMessage(`Inserting ${value}...`);
        setActiveNodeId(null);
        setFoundNodeId(null);
        
        while (true) {
          setActiveNodeId(current.id);
          
          if (value === current.value) {
            setMessage(`${value} already exists.`);
            setFoundNodeId(current.id);
            play('error');
            await wait();
            setOperation('idle');
            return;
          }

          if (value < current.value) {
            setMessage(`${value} < ${current.value}. Going Left.`);
            await wait();
            if (!current.left) {
              current.left = newNode;
              break;
            }
            current = current.left;
          } else {
            setMessage(`${value} > ${current.value}. Going Right.`);
            await wait();
            if (!current.right) {
              current.right = newNode;
              break;
            }
            current = current.right;
          }
        }
        setRoot({ ...rootRef.current }); // Trigger update
        setMessage(`Inserted ${value}.`);
        setFoundNodeId(newNode.id);
        setActiveNodeId(null);
        play('insert');
        await wait();
        setFoundNodeId(null);
        setOperation('idle');
      } else {
        // Bulk insert logic (no animation)
        const recursiveInsert = (node: TreeNode, val: number) => {
          if (val === node.value) return; 
          if (val < node.value) {
            if (!node.left) node.left = { id: Math.random().toString(36).substr(2, 9), value: val, left: null, right: null, x: 0, y: 0 };
            else recursiveInsert(node.left, val);
          } else if (val > node.value) {
            if (!node.right) node.right = { id: Math.random().toString(36).substr(2, 9), value: val, left: null, right: null, x: 0, y: 0 };
            else recursiveInsert(node.right, val);
          }
        };
        const newRoot = JSON.parse(JSON.stringify(rootRef.current));
        recursiveInsert(newRoot, value);
        setRoot(newRoot);
      }
    } catch (e) {
      // Unmounted during animation
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operation]); 

  const search = useCallback(async (value: number) => {
    if (operation !== 'idle' || !rootRef.current) return;
    try {
      setOperation('searching');
      setMessage(`Searching for ${value}...`);
      setActiveNodeId(null);
      setFoundNodeId(null);

      let current: TreeNode | null = rootRef.current;
      let found = false;

      while (current) {
        setActiveNodeId(current.id);
        await wait();

        if (value === current.value) {
          setMessage(`Found ${value}!`);
          setFoundNodeId(current.id);
          play('success');
          found = true;
          break;
        } else if (value < current.value) {
          setMessage(`${value} < ${current.value}. Going Left.`);
          current = current.left;
        } else {
          setMessage(`${value} > ${current.value}. Going Right.`);
          current = current.right;
        }
      }

      if (!found) {
        setMessage(`${value} not found in the tree.`);
        setActiveNodeId(null);
        play('error');
      }
      
      await wait();
      setOperation('idle');
    } catch (e) {
      // Unmounted
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operation]);

  const deleteNode = useCallback((node: TreeNode | null, value: number): { node: TreeNode | null, deleted: boolean } => {
    if (!node) return { node: null, deleted: false };

    const currentNode = { ...node };

    if (value < currentNode.value) {
      const { node: newLeft, deleted } = deleteNode(currentNode.left, value);
      currentNode.left = newLeft;
      return { node: currentNode, deleted };
    } else if (value > currentNode.value) {
      const { node: newRight, deleted } = deleteNode(currentNode.right, value);
      currentNode.right = newRight;
      return { node: currentNode, deleted };
    } else {
      // Node found
      if (!currentNode.left && !currentNode.right) {
        return { node: null, deleted: true };
      }
      if (!currentNode.left) return { node: currentNode.right, deleted: true };
      if (!currentNode.right) return { node: currentNode.left, deleted: true };

      // Two children: find min in right subtree
      let temp = currentNode.right;
      while (temp.left) temp = temp.left;
      
      currentNode.value = temp.value; 
      const { node: newRight } = deleteNode(currentNode.right, temp.value);
      currentNode.right = newRight;
      return { node: currentNode, deleted: true };
    }
  }, []);

  const remove = useCallback(async (value: number) => {
    if (operation !== 'idle' || !rootRef.current) return;
    try {
      setOperation('deleting');
      setMessage(`Searching for ${value} to delete...`);
      
      let current: TreeNode | null = rootRef.current;
      let foundNode: TreeNode | null = null;

      while (current) {
        setActiveNodeId(current.id);
        await wait();

        if (value === current.value) {
          foundNode = current;
          setModifyingNodeId(current.id);
          setMessage(`Found ${value}. Deleting...`);
          await wait();
          break;
        } else if (value < current.value) {
          current = current.left;
        } else {
          current = current.right;
        }
      }

      if (!foundNode) {
        setMessage(`Node ${value} not found.`);
        setActiveNodeId(null);
        play('error');
        setOperation('idle');
        return;
      }

      const { node: newRoot } = deleteNode(rootRef.current, value);
      
      setRoot(newRoot);
      setModifyingNodeId(null);
      setActiveNodeId(null);
      setMessage(`Deleted ${value}.`);
      play('delete');
      setOperation('idle');
    } catch (e) {
      // Unmounted
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operation, deleteNode]);

  const clear = useCallback(() => {
    setRoot(null);
    setMessage('Tree cleared.');
    play('delete');
  }, [play]);

  const buildTree = useCallback(async (values: number[]) => {
    clear();
    setTimeout(() => {
      if (!isMounted.current) return;
      if (values.length === 0) return;
      
      const newRoot: TreeNode = {
        id: Math.random().toString(36).substr(2, 9),
        value: values[0],
        left: null,
        right: null,
        x: 0, y: 0
      };

      const insertHelper = (node: TreeNode, val: number) => {
         if (val < node.value) {
           if (!node.left) node.left = { id: Math.random().toString(36).substr(2, 9), value: val, left: null, right: null, x: 0, y: 0 };
           else insertHelper(node.left, val);
         } else if (val > node.value) {
           if (!node.right) node.right = { id: Math.random().toString(36).substr(2, 9), value: val, left: null, right: null, x: 0, y: 0 };
           else insertHelper(node.right, val);
         }
      };

      for (let i = 1; i < values.length; i++) {
        insertHelper(newRoot, values[i]);
      }
      
      setRoot(newRoot);
      setMessage(`Built tree from ${values.length} values.`);
      play('success');
    }, 100);
  }, [clear, play]);

  const highlightValue = useCallback((val: number) => {
    setExternalHighlightVal(val);
    play('click');
    setTimeout(() => {
      if (isMounted.current) setExternalHighlightVal(null);
    }, 3000);
  }, [play]);

  return {
    visualNodes,
    visualEdges,
    insert,
    search,
    delete: remove,
    clear,
    buildTree,
    highlightValue,
    operation,
    message,
    speed,
    setSpeed
  };
};
