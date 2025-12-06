import { useState, useRef, useEffect, useCallback } from 'react';
import { SegmentNode, SegmentEdge, QueryType, Operation } from '../types';
import { sleep } from '../../../shared/utils/time';
import { useSound } from '../../../shared/context/SoundContext';

const NODE_SPACING_X = 60;
const NODE_SPACING_Y = 80;
const CANVAS_WIDTH = 1000;

export const useSegmentTree = () => {
  const [array, setArray] = useState<number[]>([]);
  const [nodes, setNodes] = useState<SegmentNode[]>([]);
  const [queryType, setQueryType] = useState<QueryType>('sum');
  const [operation, setOperation] = useState<Operation>('idle');
  const [message, setMessage] = useState<string>('Ready');
  const [speed, setSpeed] = useState<number>(1);
  const [lastQueryResult, setLastQueryResult] = useState<number | null>(null);

  const isMounted = useRef(true);
  const { play } = useSound();

  // Internal representation
  // We use an object map for nodes to easily update them by index
  // Index 1 is root. Left 2*i, Right 2*i+1.
  const treeMap = useRef<Map<number, SegmentNode>>(new Map());

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const wait = async (baseMs: number = 500) => {
    await sleep(baseMs / speed);
    if (!isMounted.current) throw new Error('Unmounted');
  };

  const safeSetMessage = (msg: string) => { if(isMounted.current) setMessage(msg); };

  const aggregate = (a: number, b: number) => {
    switch (queryType) {
      case 'min': return Math.min(a, b);
      case 'max': return Math.max(a, b);
      case 'sum': default: return a + b;
    }
  };

  const initialValue = () => {
    switch (queryType) {
      case 'min': return Infinity;
      case 'max': return -Infinity;
      case 'sum': default: return 0;
    }
  };

  // --- LAYOUT ---
  // Recursively calculate positions
  const buildLayout = (index: number, l: number, r: number, level: number, x: number): void => {
    // Width of this subtree at leaf level roughly corresponds to (r - l + 1) * spacing
    // But standard binary tree layout usually allocates fixed width per level
    // Segment trees are complete trees (mostly).
    // Let's use simple logic: X is middle of range.
    // X = (l + r) / 2 scaled to canvas width? No, that clusters nodes.
    // Better: Standard binary tree layout.
    // root at 500.
    // width decreases by 2^(level+1).
    
    // Actually, since leaves correspond to array indices, we can position leaves fixed, and parents are midpoints.
    
    // This function just populates structure, positions calculated later
  };

  // Helper to sync ref map to state
  const refreshNodes = () => {
    setNodes(Array.from(treeMap.current.values()));
  };

  const resetNodeStates = () => {
    treeMap.current.forEach(node => {
      node.state = 'default';
    });
    refreshNodes();
  };

  // --- BUILD ---
  const generateArray = (size: number) => {
    const newArr = Array.from({ length: size }, () => Math.floor(Math.random() * 20) + 1);
    setArray(newArr);
    buildTree(newArr);
  };

  const buildTree = async (inputArray: number[], animate = true) => {
    setOperation('building');
    treeMap.current.clear();
    setLastQueryResult(null);
    
    const n = inputArray.length;
    
    // Layout calculation helper:
    // Leaves are at y = max_depth * SPACING.
    // x = (index * SPACING) + OFFSET.
    // Parent x = (left.x + right.x) / 2.
    
    const buildRecursive = async (nodeIdx: number, start: number, end: number, level: number) => {
      // Placeholder node
      const node: SegmentNode = {
        index: nodeIdx,
        value: 0,
        range: [start, end],
        lazy: 0,
        x: 0,
        y: level * NODE_SPACING_Y + 50,
        state: 'default'
      };
      
      treeMap.current.set(nodeIdx, node);
      refreshNodes(); // Show skeleton growing

      if (start === end) {
        // Leaf
        node.value = inputArray[start];
        // Calculate X position based on array index
        // Center the whole array on canvas
        const totalWidth = n * NODE_SPACING_X;
        const startX = (CANVAS_WIDTH - totalWidth) / 2 + NODE_SPACING_X/2;
        node.x = startX + start * NODE_SPACING_X;
        treeMap.current.set(nodeIdx, node);
        
        if (animate) {
          node.state = 'visited';
          refreshNodes();
          await wait(50);
          node.state = 'default';
        }
        return node.value;
      }

      const mid = Math.floor((start + end) / 2);
      
      const leftVal = await buildRecursive(2 * nodeIdx, start, mid, level + 1);
      const rightVal = await buildRecursive(2 * nodeIdx + 1, mid + 1, end, level + 1);
      
      node.value = aggregate(leftVal, rightVal);
      
      // Update position based on children
      const leftNode = treeMap.current.get(2 * nodeIdx)!;
      const rightNode = treeMap.current.get(2 * nodeIdx + 1)!;
      node.x = (leftNode.x + rightNode.x) / 2;
      
      treeMap.current.set(nodeIdx, node);
      if (animate) {
        node.state = 'active'; // Highlight merge
        refreshNodes();
        play('click');
        await wait(100);
        node.state = 'default';
      }
      return node.value;
    };

    await buildRecursive(1, 0, n - 1, 0);
    refreshNodes();
    safeSetMessage('Tree Built');
    setOperation('idle');
  };

  // --- QUERY ---
  const query = async (l: number, r: number) => {
    if (operation !== 'idle') return;
    setOperation('querying');
    resetNodeStates();
    safeSetMessage(`Querying range [${l}, ${r}]...`);
    await wait();

    const queryRecursive = async (nodeIdx: number, start: number, end: number): Promise<number> => {
      const node = treeMap.current.get(nodeIdx);
      if (!node) return initialValue();

      node.state = 'visited';
      refreshNodes();
      await wait(300);

      // Lazy push logic would go here if lazy was active, adding simplistic visual push
      if (node.lazy !== 0) {
        // Visual indicator of pushing lazy
        safeSetMessage(`Pushing pending update (${node.lazy}) down...`);
        node.state = 'lazy';
        refreshNodes();
        await wait();
        pushLazy(nodeIdx, start, end);
        node.state = 'visited'; // restore
      }

      // Case 1: Outside
      if (r < start || end < l) {
        node.state = 'rejected';
        refreshNodes();
        return initialValue();
      }

      // Case 2: Inside
      if (l <= start && end <= r) {
        node.state = 'accepted';
        refreshNodes();
        play('success');
        safeSetMessage(`Range [${start}, ${end}] is fully inside. Taking value: ${node.value}`);
        await wait();
        return node.value;
      }

      // Case 3: Partial
      node.state = 'active'; // Processing children
      refreshNodes();
      const mid = Math.floor((start + end) / 2);
      const p1 = await queryRecursive(2 * nodeIdx, start, mid);
      const p2 = await queryRecursive(2 * nodeIdx + 1, mid + 1, end);
      
      // Flash parent on return
      node.state = 'visited';
      refreshNodes();
      
      return aggregate(p1, p2);
    };

    const result = await queryRecursive(1, 0, array.length - 1);
    setLastQueryResult(result);
    safeSetMessage(`Query Result: ${result}`);
    play('pop');
    setOperation('idle');
  };

  // --- LAZY UPDATE ---
  // Simple lazy prop: range add
  const updateRange = async (l: number, r: number, val: number) => {
    if (operation !== 'idle') return;
    setOperation('updating');
    resetNodeStates();
    safeSetMessage(`Adding ${val} to range [${l}, ${r}]...`);
    await wait();

    const updateRecursive = async (nodeIdx: number, start: number, end: number) => {
      const node = treeMap.current.get(nodeIdx);
      if (!node) return;

      // Push pending lazy first
      if (node.lazy !== 0) {
        pushLazy(nodeIdx, start, end);
      }

      node.state = 'visited';
      refreshNodes();
      await wait(200);

      // Out of range
      if (start > end || start > r || end < l) {
        node.state = 'default';
        return;
      }

      // Fully in range
      if (start >= l && end <= r) {
        node.value += val * (queryType === 'sum' ? (end - start + 1) : 1); // Sum needs multiply, Min/Max just +val
        node.lazy += val;
        node.state = 'accepted';
        refreshNodes();
        play('insert');
        safeSetMessage(`Node [${start}, ${end}] updated (Lazy: ${node.lazy})`);
        await wait();
        return;
      }

      // Partial
      const mid = Math.floor((start + end) / 2);
      await updateRecursive(2 * nodeIdx, start, mid);
      await updateRecursive(2 * nodeIdx + 1, mid + 1, end);

      const left = treeMap.current.get(2 * nodeIdx);
      const right = treeMap.current.get(2 * nodeIdx + 1);
      
      if (left && right) {
        node.value = aggregate(left.value, right.value);
        node.state = 'active'; // Recalculated
        refreshNodes();
        await wait(200);
        node.state = 'default';
      }
    };

    await updateRecursive(1, 0, array.length - 1);
    
    // Update underlying array for display consistency (simulated, in reality query handles this)
    // For visualization, we might want to manually update the array state to match
    // Naive update of array state for display purposes
    setArray(prev => prev.map((v, i) => (i >= l && i <= r) ? v + val : v));
    
    safeSetMessage('Range Update Complete');
    setOperation('idle');
  };

  const pushLazy = (nodeIdx: number, start: number, end: number) => {
    const node = treeMap.current.get(nodeIdx);
    if (!node || node.lazy === 0) return;

    if (start !== end) {
      const mid = Math.floor((start + end) / 2);
      const left = treeMap.current.get(2 * nodeIdx);
      const right = treeMap.current.get(2 * nodeIdx + 1);

      if (left) {
        left.lazy += node.lazy;
        left.value += node.lazy * (queryType === 'sum' ? (mid - start + 1) : 1);
      }
      if (right) {
        right.lazy += node.lazy;
        right.value += node.lazy * (queryType === 'sum' ? (end - (mid + 1) + 1) : 1);
      }
    }
    node.lazy = 0;
    treeMap.current.set(nodeIdx, node);
  };

  return {
    nodes,
    array,
    queryType,
    setQueryType: (t: QueryType) => { setQueryType(t); generateArray(array.length || 8); }, // Rebuild on type change
    operation,
    message,
    speed,
    setSpeed,
    generateArray,
    query,
    updateRange,
    lastQueryResult
  };
};