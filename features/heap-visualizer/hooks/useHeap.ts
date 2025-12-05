import { useState, useRef, useEffect, useCallback } from 'react';
import { HeapNode, HeapType, HeapOperation, VisualHeapNode } from '../types';

const SLEEP_TIME = 800;
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useHeap = () => {
  const [heap, setHeap] = useState<HeapNode[]>([]);
  const [heapType, setHeapType] = useState<HeapType>('min');
  const [operation, setOperation] = useState<HeapOperation>('idle');
  const [message, setMessage] = useState('Ready');
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [sortedArray, setSortedArray] = useState<number[]>([]);

  // Refs for async operations
  const heapRef = useRef(heap);
  heapRef.current = heap;

  // --- Layout Helper ---
  const getLayout = useCallback((nodes: HeapNode[]): VisualHeapNode[] => {
    return nodes.map((node, index) => {
      const level = Math.floor(Math.log2(index + 1));
      const positionInLevel = (index + 1) - Math.pow(2, level);
      const levelWidth = Math.pow(2, level);
      
      // Calculate X based on frame width (e.g., 1000px)
      // Root is at 500. 
      // Level 1: 250, 750
      // Basic logic: subdivide space
      const width = 1000;
      const section = width / (levelWidth + 1); // naive
      // Better complete binary tree spacing:
      // Root: 500
      // Children: parent.x +/- offset / 2
      
      // Let's use a standard grid-like approach for complete trees
      // or just hardcode levels for simplicity up to depth 5 (31 nodes)
      
      const y = 60 + level * 80;
      
      // Dynamic spacing calculation
      // Depth 0 (1 node): 1000/2
      // Depth 1 (2 nodes): 1000/4 * 1, 1000/4 * 3
      // Depth 2 (4 nodes): 1000/8 * 1, 3, 5, 7
      
      const maxNodesAtLevel = Math.pow(2, level);
      const span = 1000 / maxNodesAtLevel;
      const x = (positionInLevel * span) + (span / 2);

      let state: VisualHeapNode['state'] = 'default';
      
      return { ...node, index, x, y, state };
    });
  }, []);

  const reset = () => {
    setHeap([]);
    setSortedArray([]);
    setComparingIndices([]);
    setOperation('idle');
    setMessage('Heap Cleared.');
  };

  const compare = (a: number, b: number, type: HeapType) => {
    return type === 'min' ? a < b : a > b;
  };

  const swap = async (i: number, j: number) => {
    const newHeap = [...heapRef.current];
    const temp = newHeap[i];
    newHeap[i] = newHeap[j];
    newHeap[j] = temp;
    setHeap(newHeap);
    await sleep(SLEEP_TIME);
  };

  const insert = async (value: number) => {
    if (operation !== 'idle') return;
    setOperation('inserting');
    setMessage(`Inserting ${value}...`);

    const newNode: HeapNode = { id: Math.random().toString(36).substr(2, 9), value };
    const newHeap = [...heapRef.current, newNode];
    setHeap(newHeap);
    
    let index = newHeap.length - 1;
    setMessage(`Added ${value} at end (index ${index})`);
    await sleep(SLEEP_TIME);

    // Bubble Up
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      setComparingIndices([index, parentIndex]);
      
      const val = newHeap[index].value;
      const parentVal = newHeap[parentIndex].value;
      
      setMessage(`Comparing ${val} with parent ${parentVal}...`);
      await sleep(SLEEP_TIME);

      if (compare(val, parentVal, heapType)) {
        setMessage(`${val} is ${heapType === 'min' ? 'smaller' : 'larger'}. Swapping.`);
        await swap(index, parentIndex);
        index = parentIndex;
      } else {
        setMessage("Heap property satisfied.");
        break;
      }
    }

    setComparingIndices([]);
    setOperation('idle');
    setMessage(`Inserted ${value}.`);
  };

  const heapifyDown = async (index: number, length: number) => {
    let curr = index;
    
    while (true) {
      let swapIndex = curr;
      const left = 2 * curr + 1;
      const right = 2 * curr + 2;

      // Find candidate to swap (smallest for min-heap, largest for max-heap)
      if (left < length) {
        setComparingIndices([swapIndex, left]);
        // await sleep(SLEEP_TIME / 2); // Too slow if we do every comparison in sort
        if (compare(heapRef.current[left].value, heapRef.current[swapIndex].value, heapType)) {
          swapIndex = left;
        }
      }

      if (right < length) {
        setComparingIndices([swapIndex, right]);
        if (compare(heapRef.current[right].value, heapRef.current[swapIndex].value, heapType)) {
          swapIndex = right;
        }
      }

      if (swapIndex !== curr) {
        setMessage(`Bubbling down: swapping ${heapRef.current[curr].value} with ${heapRef.current[swapIndex].value}`);
        await swap(curr, swapIndex);
        curr = swapIndex;
      } else {
        break;
      }
    }
  };

  const extractRoot = async () => {
    if (operation !== 'idle' || heapRef.current.length === 0) return;
    setOperation('extracting');
    
    const rootVal = heapRef.current[0].value;
    setMessage(`Extracting Root: ${rootVal}`);
    
    // Swap root with last
    const lastIndex = heapRef.current.length - 1;
    if (lastIndex > 0) {
      await swap(0, lastIndex);
    }

    // Remove last (original root)
    const extracted = heapRef.current[heapRef.current.length - 1];
    setHeap(prev => prev.slice(0, -1));
    setSortedArray(prev => [...prev, extracted.value]);
    setMessage(`Moved ${extracted.value} to sorted list.`);
    await sleep(SLEEP_TIME);

    // Bubble Down Root
    if (heapRef.current.length > 0) {
      await heapifyDown(0, heapRef.current.length);
    }

    setComparingIndices([]);
    setOperation('idle');
    setMessage('Extraction complete.');
  };

  const toggleType = async () => {
    const newType = heapType === 'min' ? 'max' : 'min';
    setHeapType(newType);
    
    if (heapRef.current.length > 0) {
      setOperation('building');
      setMessage(`Rebuilding as ${newType === 'min' ? 'Min' : 'Max'} Heap...`);
      // Rebuild heap property
      // Start from last non-leaf node down to root
      for (let i = Math.floor(heapRef.current.length / 2) - 1; i >= 0; i--) {
        // Need to run heapifyDown with the NEW type logic
        // But heapifyDown uses state 'heapType'.
        // State updates aren't immediate in the loop context if we rely on the closure.
        // We need a helper that accepts type explicitly or wait. 
        // Simpler: Just clear and re-insert for visual clarity or implement buildHeap properly.
        // Let's implement a clean buildHeap logic.
      }
      
      // Actually, since heapType state update is async, we can't easily run the algo immediately in this closure.
      // Easiest is to clear sorted array and re-sort visually or just brute-force reset.
      // Let's just reset sorted array and trigger a 'rebuild' effect or just re-insert all items.
      
      const values = heapRef.current.map(n => n.value);
      setHeap([]);
      setSortedArray([]);
      
      // Rapid re-insert
      // This is a bit fake but visually understandable
      await sleep(500);
      const newHeap: HeapNode[] = [];
      setHeap(newHeap); // clear visual

      // We need to actually implement "Build Heap" (O(n)) vs "Insert All" (O(n log n)).
      // Let's do Insert All for animation consistency for now, it's easier to follow.
      // But we must use the NEW type.
      // To hack around the closure `heapType`, we can pass it to a helper.
      
      // Actually, let's just use the `heapType` in the effect or force user to click "Build".
      // Let's just return and let the user see "Switched to Max Heap" and maybe the heap is invalid visually until they fix it?
      // Better: Clear it.
      reset(); 
      setMessage(`Switched to ${newType === 'min' ? 'Min' : 'Max'} Heap. (Cleared)`);
      setOperation('idle');
    }
  };

  const sort = async () => {
    if (operation !== 'idle') return;
    setOperation('sorting');
    setMessage("Heap Sort: Extracting all elements...");

    while (heapRef.current.length > 0) {
      // Re-implement extract logic here to avoid state closure issues with `extractRoot` calling
      const rootVal = heapRef.current[0].value;
      const lastIndex = heapRef.current.length - 1;
      
      if (lastIndex > 0) {
        await swap(0, lastIndex);
      }
      
      const extracted = heapRef.current[heapRef.current.length - 1];
      setHeap(prev => prev.slice(0, -1));
      setSortedArray(prev => [...prev, extracted.value]);
      
      if (heapRef.current.length > 0) {
         // Need to heapify down 0
         await heapifyDown(0, heapRef.current.length);
      }
      await sleep(300); // Faster for sort
    }
    
    setComparingIndices([]);
    setOperation('idle');
    setMessage("Heap Sort Complete.");
  };

  return {
    heap,
    visualNodes: getLayout(heap),
    heapType,
    operation,
    message,
    comparingIndices,
    sortedArray,
    insert,
    extractRoot,
    toggleType,
    sort,
    reset
  };
};
