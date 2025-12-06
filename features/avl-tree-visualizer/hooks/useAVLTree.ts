import { useState, useCallback, useRef, useEffect } from 'react';
import { AVLNode, VisualAVLNode, VisualEdge, AVLOperation, ComparisonStats } from '../types';
import { sleep } from '../../../shared/utils/time';
import { useSound } from '../../../shared/context/SoundContext';

const FRAME_WIDTH = 1000;
const VERTICAL_SPACING = 70;

export const useAVLTree = () => {
  const [root, setRoot] = useState<AVLNode | null>(null);
  const [bstRoot, setBstRoot] = useState<AVLNode | null>(null); // For comparison mode
  
  const [visualNodes, setVisualNodes] = useState<VisualAVLNode[]>([]);
  const [visualEdges, setVisualEdges] = useState<VisualEdge[]>([]);
  const [bstNodes, setBstNodes] = useState<VisualAVLNode[]>([]);
  const [bstEdges, setBstEdges] = useState<VisualEdge[]>([]);

  const [operation, setOperation] = useState<AVLOperation>('idle');
  const [message, setMessage] = useState('AVL Tree Ready');
  const [comparisonStats, setComparisonStats] = useState<ComparisonStats>({ avlHeight: 0, bstHeight: 0, avlRotations: 0 });
  
  // Highlight states
  const [activeNodeIds, setActiveNodeIds] = useState<Set<string>>(new Set());
  const [imbalancedNodeId, setImbalancedNodeId] = useState<string | null>(null);

  const rootRef = useRef(root);
  rootRef.current = root;
  const bstRootRef = useRef(bstRoot);
  bstRootRef.current = bstRoot;
  
  const isMounted = useRef(true);
  const { play } = useSound();

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const wait = async (ms: number = 500) => {
    await sleep(ms);
    if (!isMounted.current) throw new Error('Unmounted');
  };

  // --- HELPERS ---

  const getHeight = (node: AVLNode | null): number => node ? node.height : 0;
  
  const getBalance = (node: AVLNode | null): number => {
    return node ? getHeight(node.left) - getHeight(node.right) : 0;
  };

  const updateHeight = (node: AVLNode) => {
    node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
  };

  // --- LAYOUT ---

  const calculateLayout = useCallback((node: AVLNode | null, x: number, y: number, level: number, parentX?: number): { nodes: VisualAVLNode[], edges: VisualEdge[] } => {
    if (!node) return { nodes: [], edges: [] };

    // Update coordinates
    node.x = x;
    node.y = y;

    const bf = getBalance(node);
    let state: VisualAVLNode['state'] = 'default';
    if (activeNodeIds.has(node.id)) state = 'checking';
    if (imbalancedNodeId === node.id) state = 'imbalanced';

    const vNode: VisualAVLNode = {
      ...node,
      balanceFactor: bf,
      state
    };

    // Calculate offset based on depth to prevent overlap
    // Reduce spread as we go deeper
    const offset = Math.max(FRAME_WIDTH / (Math.pow(2, level + 2)), 40); 
    
    const leftResult = calculateLayout(node.left, x - offset, y + VERTICAL_SPACING, level + 1, x);
    const rightResult = calculateLayout(node.right, x + offset, y + VERTICAL_SPACING, level + 1, x);

    const currentEdges: VisualEdge[] = [];
    if (node.left) {
      currentEdges.push({ id: `${node.id}-${node.left.id}`, x1: x, y1: y, x2: node.left.x, y2: node.left.y, state: 'default' });
    }
    if (node.right) {
      currentEdges.push({ id: `${node.id}-${node.right.id}`, x1: x, y1: y, x2: node.right.x, y2: node.right.y, state: 'default' });
    }

    return {
      nodes: [vNode, ...leftResult.nodes, ...rightResult.nodes],
      edges: [...currentEdges, ...leftResult.edges, ...rightResult.edges]
    };
  }, [activeNodeIds, imbalancedNodeId]);

  // Sync Layout Effect
  useEffect(() => {
    const avlLayout = calculateLayout(root, FRAME_WIDTH / 2, 50, 0);
    setVisualNodes(avlLayout.nodes);
    setVisualEdges(avlLayout.edges);

    // Also layout comparison tree if exists
    const bstLayout = calculateLayout(bstRoot, FRAME_WIDTH / 2, 50, 0);
    setBstNodes(bstLayout.nodes);
    setBstEdges(bstLayout.edges);

    setComparisonStats(prev => ({
      ...prev,
      avlHeight: getHeight(root),
      bstHeight: getHeight(bstRoot)
    }));
  }, [root, bstRoot, activeNodeIds, imbalancedNodeId, calculateLayout]);


  // --- ROTATIONS ---

  const rightRotate = async (y: AVLNode, animate: boolean): Promise<AVLNode> => {
    const x = y.left!;
    const T2 = x.right;

    if (animate) {
      setMessage(`Performing Right Rotation on ${y.value}...`);
      setActiveNodeIds(new Set([y.id, x.id]));
      await wait(600);
    }

    // Perform rotation
    x.right = y;
    y.left = T2;

    // Update heights
    updateHeight(y);
    updateHeight(x);

    if (animate) {
      // Force re-render to show new structure instantly or let React handle layout transition
      // We update the ref structure, then set state to trigger layout calc
      // Since this function is called inside insert/delete which sets root at the end, 
      // we might need intermediate state updates for step-by-step visual if deep in recursion.
      // For now, we rely on the caller to update root.
      play('pop');
      setComparisonStats(s => ({...s, avlRotations: s.avlRotations + 1}));
    }

    return x;
  };

  const leftRotate = async (x: AVLNode, animate: boolean): Promise<AVLNode> => {
    const y = x.right!;
    const T2 = y.left;

    if (animate) {
      setMessage(`Performing Left Rotation on ${x.value}...`);
      setActiveNodeIds(new Set([x.id, y.id]));
      await wait(600);
    }

    y.left = x;
    x.right = T2;

    updateHeight(x);
    updateHeight(y);

    if (animate) {
      play('pop');
      setComparisonStats(s => ({...s, avlRotations: s.avlRotations + 1}));
    }

    return y;
  };

  // --- OPERATIONS ---

  const insertNode = async (node: AVLNode | null, value: number, animate: boolean, isBST: boolean = false): Promise<AVLNode> => {
    // 1. Standard BST Insert
    if (!node) {
      const newNode: AVLNode = {
        id: Math.random().toString(36).substr(2, 9),
        value,
        height: 1,
        left: null,
        right: null,
        x: 0, y: 0
      };
      if (animate && !isBST) {
        setMessage(`Inserted ${value}`);
        play('insert');
      }
      return newNode;
    }

    if (value < node.value) {
      if (animate && !isBST) { setActiveNodeIds(new Set([node.id])); await wait(200); }
      node.left = await insertNode(node.left, value, animate, isBST);
    } else if (value > node.value) {
      if (animate && !isBST) { setActiveNodeIds(new Set([node.id])); await wait(200); }
      node.right = await insertNode(node.right, value, animate, isBST);
    } else {
      return node; // Duplicate
    }

    // 2. Update Height
    updateHeight(node);

    // Comparison BST stops here
    if (isBST) return node;

    // 3. Get Balance
    const balance = getBalance(node);

    // 4. Balancing
    // Left Left Case
    if (balance > 1 && value < (node.left?.value || 0)) {
      if (animate) {
        setImbalancedNodeId(node.id);
        setMessage(`Imbalance at ${node.value} (Balance: ${balance}). Needs Right Rotation.`);
        play('error');
        await wait(800);
      }
      const newNode = await rightRotate(node, animate);
      setImbalancedNodeId(null);
      return newNode;
    }

    // Right Right Case
    if (balance < -1 && value > (node.right?.value || 0)) {
      if (animate) {
        setImbalancedNodeId(node.id);
        setMessage(`Imbalance at ${node.value} (Balance: ${balance}). Needs Left Rotation.`);
        play('error');
        await wait(800);
      }
      const newNode = await leftRotate(node, animate);
      setImbalancedNodeId(null);
      return newNode;
    }

    // Left Right Case
    if (balance > 1 && value > (node.left?.value || 0)) {
      if (animate) {
        setImbalancedNodeId(node.id);
        setMessage(`Imbalance at ${node.value} (Left-Right Case). Rotating Left child first.`);
        play('error');
        await wait(800);
      }
      node.left = await leftRotate(node.left!, animate);
      // Force update visualization intermediate step
      if (animate) {
         setRoot({...rootRef.current!}); 
         await wait(600);
      }
      const newNode = await rightRotate(node, animate);
      setImbalancedNodeId(null);
      return newNode;
    }

    // Right Left Case
    if (balance < -1 && value < (node.right?.value || 0)) {
      if (animate) {
        setImbalancedNodeId(node.id);
        setMessage(`Imbalance at ${node.value} (Right-Left Case). Rotating Right child first.`);
        play('error');
        await wait(800);
      }
      node.right = await rightRotate(node.right!, animate);
      if (animate) {
         setRoot({...rootRef.current!}); 
         await wait(600);
      }
      const newNode = await leftRotate(node, animate);
      setImbalancedNodeId(null);
      return newNode;
    }

    return node;
  };

  const insert = useCallback(async (value: number) => {
    if (operation !== 'idle') return;
    try {
      setOperation('inserting');
      setActiveNodeIds(new Set());
      setImbalancedNodeId(null);

      // Parallel BST insert (no animation logic)
      if (bstRootRef.current || !rootRef.current) { // Only if initialized or both empty
         const newBstRoot = await insertNode(bstRootRef.current ? JSON.parse(JSON.stringify(bstRootRef.current)) : null, value, false, true);
         setBstRoot(newBstRoot);
      }

      const newRoot = await insertNode(rootRef.current ? JSON.parse(JSON.stringify(rootRef.current)) : null, value, true);
      setRoot(newRoot);
      
      setActiveNodeIds(new Set());
      setMessage('Balanced.');
      setOperation('idle');
    } catch (e) {
      console.log(e);
    }
  }, [operation]);

  const reset = useCallback(() => {
    setRoot(null);
    setBstRoot(null);
    setComparisonStats({ avlHeight: 0, bstHeight: 0, avlRotations: 0 });
    setMessage('Tree Cleared');
  }, []);

  // Standard Insert without animation for setup
  const bulkInsert = useCallback(async (values: number[]) => {
    reset();
    await wait(100);
    
    let currentRoot: AVLNode | null = null;
    let currentBstRoot: AVLNode | null = null;

    for (const val of values) {
      currentRoot = await insertNode(currentRoot, val, false, false);
      currentBstRoot = await insertNode(currentBstRoot, val, false, true);
    }
    
    setRoot(currentRoot);
    setBstRoot(currentBstRoot);
    setMessage(`Built tree with ${values.length} nodes.`);
  }, [reset]);

  return {
    root,
    bstRoot,
    visualNodes,
    visualEdges,
    bstNodes,
    bstEdges,
    insert,
    reset,
    bulkInsert,
    operation,
    message,
    comparisonStats
  };
};