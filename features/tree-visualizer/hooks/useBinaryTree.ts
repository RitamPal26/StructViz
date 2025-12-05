import { useState, useCallback, useRef, useEffect } from 'react';
import { TreeNode, VisualNode, VisualEdge, TreeOperation } from '../types';

const FRAME_WIDTH = 1000;
const NODE_RADIUS = 25;
const VERTICAL_SPACING = 80;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useBinaryTree = () => {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [visualNodes, setVisualNodes] = useState<VisualNode[]>([]);
  const [visualEdges, setVisualEdges] = useState<VisualEdge[]>([]);
  const [operation, setOperation] = useState<TreeOperation>('idle');
  const [message, setMessage] = useState<string>('Ready to visualize');
  const [speed, setSpeed] = useState<number>(500);
  
  // Highlighting state
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [foundNodeId, setFoundNodeId] = useState<string | null>(null);
  const [modifyingNodeId, setModifyingNodeId] = useState<string | null>(null);
  const [externalHighlightVal, setExternalHighlightVal] = useState<number | null>(null);

  // Refs for async access to latest state
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const wait = async () => await sleep(speedRef.current);

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
      // External highlight override
      else if (externalHighlightVal !== null && n.value === externalHighlightVal) state = 'highlighted';

      return { ...n, state };
    });

    setVisualNodes(styledNodes);
    setVisualEdges(edges);
  }, [root, activeNodeId, foundNodeId, modifyingNodeId, externalHighlightVal, calculateLayout]);

  const insert = async (value: number, animate = true) => {
    if (operation !== 'idle' && animate) return;
    if (animate) setOperation('inserting');
    
    const newNode: TreeNode = {
      id: Math.random().toString(36).substr(2, 9),
      value,
      left: null,
      right: null,
      x: 0, 
      y: 0
    };

    if (!root) {
      if (animate) {
        setMessage(`Tree is empty. Setting ${value} as root.`);
        await wait();
      }
      setRoot(newNode);
      if (animate) {
        setFoundNodeId(newNode.id);
        setMessage(`Inserted ${value}.`);
        setOperation('idle');
      }
      return;
    }

    // Interactive traversal logic (same as before but can be skipped)
    let current = root;
    
    // Simple recursive insert for bulk operations without animation
    const recursiveInsert = (node: TreeNode, val: number) => {
      if (val < node.value) {
        if (!node.left) node.left = { id: Math.random().toString(36).substr(2, 9), value: val, left: null, right: null, x: 0, y: 0 };
        else recursiveInsert(node.left, val);
      } else if (val > node.value) {
        if (!node.right) node.right = { id: Math.random().toString(36).substr(2, 9), value: val, left: null, right: null, x: 0, y: 0 };
        else recursiveInsert(node.right, val);
      }
    };

    if (!animate) {
      // Create deep copy to trigger React update
      // A proper deep copy function would be better, but for this strict structure:
      // We will just re-insert everything into a new root.
      // Actually, since we are mutating 'root' in the recursiveInsert above (if root exists), we need to trigger update.
      // A better way for bulk build is to reset and build.
      recursiveInsert(root, value);
      setRoot({ ...root }); 
      return;
    }

    // ... (Keep existing animated insert logic for manual single interactions)
    // For brevity, reusing the simplified recursive logic for this update context if animate is false
    // But the original file had full animation code. I should preserve it.
    
    // Full Animation Logic:
    setMessage(`Inserting ${value}...`);
    setActiveNodeId(null);
    setFoundNodeId(null);
    
    while (true) {
      setActiveNodeId(current.id);
      
      if (value === current.value) {
        setMessage(`${value} already exists.`);
        setFoundNodeId(current.id);
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
    setRoot({ ...root });
    setMessage(`Inserted ${value}.`);
    setFoundNodeId(newNode.id);
    setActiveNodeId(null);
    await wait();
    setFoundNodeId(null);
    setOperation('idle');
  };

  const search = async (value: number) => {
    if (operation !== 'idle' || !root) return;
    setOperation('searching');
    setMessage(`Searching for ${value}...`);
    setActiveNodeId(null);
    setFoundNodeId(null);

    let current: TreeNode | null = root;
    let found = false;

    while (current) {
      setActiveNodeId(current.id);
      await wait();

      if (value === current.value) {
        setMessage(`Found ${value}!`);
        setFoundNodeId(current.id);
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
    }
    
    await wait();
    setOperation('idle');
  };

  const deleteNode = (node: TreeNode | null, value: number): { node: TreeNode | null, deleted: boolean } => {
    if (!node) return { node: null, deleted: false };

    if (value < node.value) {
      const { node: newLeft, deleted } = deleteNode(node.left, value);
      node.left = newLeft;
      return { node, deleted };
    } else if (value > node.value) {
      const { node: newRight, deleted } = deleteNode(node.right, value);
      node.right = newRight;
      return { node, deleted };
    } else {
      if (!node.left && !node.right) {
        return { node: null, deleted: true };
      }
      if (!node.left) return { node: node.right, deleted: true };
      if (!node.right) return { node: node.left, deleted: true };

      let temp = node.right;
      while (temp.left) temp = temp.left;
      
      node.value = temp.value; 
      const { node: newRight } = deleteNode(node.right, temp.value);
      node.right = newRight;
      return { node, deleted: true };
    }
  };

  const remove = async (value: number) => {
    if (operation !== 'idle' || !root) return;
    setOperation('deleting');
    setMessage(`Searching for ${value} to delete...`);
    
    let current: TreeNode | null = root;
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
      setOperation('idle');
      return;
    }

    const { node: newRoot } = deleteNode({ ...root }, value);
    
    setRoot(newRoot);
    setModifyingNodeId(null);
    setActiveNodeId(null);
    setMessage(`Deleted ${value}.`);
    setOperation('idle');
  };

  const clear = () => {
    setRoot(null);
    setMessage('Tree cleared.');
  };

  const buildTree = async (values: number[]) => {
    clear();
    // Use a small delay to ensure state clears before rebuilding
    setTimeout(() => {
      // Reconstruct manually to avoid animation delays
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
    }, 100);
  };

  const highlightValue = (val: number) => {
    setExternalHighlightVal(val);
    // Auto-clear highlight after 3 seconds
    setTimeout(() => setExternalHighlightVal(null), 3000);
  };

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
