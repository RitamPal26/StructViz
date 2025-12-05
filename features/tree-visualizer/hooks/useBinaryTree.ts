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

  // Refs for async access to latest state
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const wait = async () => await sleep(speedRef.current);

  // Layout Algorithm
  const calculateLayout = useCallback((node: TreeNode | null, x: number, y: number, level: number, parentX?: number): { nodes: VisualNode[], edges: VisualEdge[] } => {
    if (!node) return { nodes: [], edges: [] };

    // Update node position
    // We update the underlying node object's position as well to persist it for animations
    node.x = x;
    node.y = y;

    const vNode: VisualNode = {
      id: node.id,
      value: node.value,
      x,
      y,
      state: 'default'
    };

    const edges: VisualEdge[] = [];
    if (parentX !== undefined) {
      // Edge from parent (calculate parent Y based on level)
      // This is a simplification; passed coords are usually better
    }

    // Calculate offset for children: shrink width as we go deeper
    // Level 0 offset: 250 (Width/4), Level 1: 125, etc.
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

  // Sync visual state when root changes or highlight states change
  useEffect(() => {
    if (!root) {
      setVisualNodes([]);
      setVisualEdges([]);
      return;
    }

    const { nodes, edges } = calculateLayout(root, FRAME_WIDTH / 2, 50, 0);

    // Apply states
    const styledNodes = nodes.map(n => ({
      ...n,
      state: (n.id === foundNodeId ? 'found' : 
              n.id === activeNodeId ? 'highlighted' : 
              n.id === modifyingNodeId ? 'modifying' : 'default') as VisualNode['state']
    }));

    setVisualNodes(styledNodes);
    setVisualEdges(edges);
  }, [root, activeNodeId, foundNodeId, modifyingNodeId, calculateLayout]);

  const insert = async (value: number) => {
    if (operation !== 'idle') return;
    setOperation('inserting');
    setMessage(`Inserting ${value}...`);
    setActiveNodeId(null);
    setFoundNodeId(null);

    const newNode: TreeNode = {
      id: Math.random().toString(36).substr(2, 9),
      value,
      left: null,
      right: null,
      x: 0, 
      y: 0
    };

    if (!root) {
      setMessage(`Tree is empty. Setting ${value} as root.`);
      await wait();
      setRoot(newNode);
      setFoundNodeId(newNode.id);
      setMessage(`Inserted ${value}.`);
      setOperation('idle');
      return;
    }

    let current = root;
    let pathHistory: TreeNode[] = [];
    
    // Simulate Traversal
    while (true) {
      setActiveNodeId(current.id);
      pathHistory.push(current);
      
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

    // Trigger update
    setRoot({ ...root }); // shallow copy to trigger re-render
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

  // Helper to remove node recursively (pure logic part)
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
      // Node found
      // Case 1: No children
      if (!node.left && !node.right) {
        return { node: null, deleted: true };
      }
      // Case 2: One child
      if (!node.left) return { node: node.right, deleted: true };
      if (!node.right) return { node: node.left, deleted: true };

      // Case 3: Two children
      // Find min in right subtree
      let temp = node.right;
      while (temp.left) temp = temp.left;
      
      node.value = temp.value; // Replace value
      // Delete the successor
      const { node: newRight } = deleteNode(node.right, temp.value);
      node.right = newRight;
      return { node, deleted: true };
    }
  };

  // Interactive delete wrapper
  const remove = async (value: number) => {
    if (operation !== 'idle' || !root) return;
    setOperation('deleting');
    setMessage(`Searching for ${value} to delete...`);
    
    // First, animate search to find the node
    let current: TreeNode | null = root;
    let parent: TreeNode | null = null;
    let foundNode: TreeNode | null = null;

    // Visual search
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
        parent = current;
        current = current.left;
      } else {
        parent = current;
        current = current.right;
      }
    }

    if (!foundNode) {
      setMessage(`Node ${value} not found.`);
      setActiveNodeId(null);
      setOperation('idle');
      return;
    }

    // Perform deletion logic
    // Note: We use the recursive helper for the actual structure update to simplify the complex 2-children case logic
    // Ideally we would animate the successor swap step-by-step too, but for now we animate the search and then the result.
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

  return {
    visualNodes,
    visualEdges,
    insert,
    search,
    delete: remove,
    clear,
    operation,
    message,
    speed,
    setSpeed
  };
};
