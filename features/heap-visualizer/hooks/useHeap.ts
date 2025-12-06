import { useState, useRef, useEffect, useCallback } from 'react';
import { HeapNode, HeapType, HeapOperation, VisualHeapNode } from '../types';

const SLEEP_TIME = 800;

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
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const sleep = async (ms: number) => {
    await new Promise(resolve => setTimeout(resolve, ms));
    if (!isMounted.current) throw new Error('Unmounted');
  };

  const safeSetMessage = (msg: string) => { if(isMounted.current) setMessage(msg); };
  const safeSetOperation = (op: HeapOperation) => { if(isMounted.current) setOperation(op); };

  // --- Layout Helper ---
  const getLayout = useCallback((nodes: HeapNode[]): VisualHeapNode[] => {
    return nodes.map((node, index) => {
      const level = Math.floor(Math.log2(index + 1));
      const positionInLevel = (index + 1) - Math.pow(2, level);
      const levelWidth = Math.pow(2, level);
      const width = 1000;
      const y = 60 + level * 80;
      const maxNodesAtLevel = Math.pow(2, level);
      const span = 1000 / maxNodesAtLevel;
      const x = (positionInLevel * span) + (span / 2);
      const state: VisualHeapNode['state'] = 'default';
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
    if(isMounted.current) setHeap(newHeap);
    await sleep(SLEEP_TIME);
  };

  const insert = async (value: number) => {
    if (operation !== 'idle') return;
    try {
      safeSetOperation('inserting');
      safeSetMessage(`Inserting ${value}...`);

      const newNode: HeapNode = { id: Math.random().toString(36).substr(2, 9), value };
      const newHeap = [...heapRef.current, newNode];
      if(isMounted.current) setHeap(newHeap);
      
      let index = newHeap.length - 1;
      safeSetMessage(`Added ${value} at end (index ${index})`);
      await sleep(SLEEP_TIME);

      // Bubble Up
      while (index > 0) {
        if(!isMounted.current) break;
        const parentIndex = Math.floor((index - 1) / 2);
        if(isMounted.current) setComparingIndices([index, parentIndex]);
        
        const val = newHeap[index].value;
        const parentVal = newHeap[parentIndex].value;
        
        safeSetMessage(`Comparing ${val} with parent ${parentVal}...`);
        await sleep(SLEEP_TIME);

        if (compare(val, parentVal, heapType)) {
          safeSetMessage(`${val} is ${heapType === 'min' ? 'smaller' : 'larger'}. Swapping.`);
          await swap(index, parentIndex);
          index = parentIndex;
        } else {
          safeSetMessage("Heap property satisfied.");
          break;
        }
      }

      if(isMounted.current) setComparingIndices([]);
      safeSetOperation('idle');
      safeSetMessage(`Inserted ${value}.`);
    } catch(e) {}
  };

  const heapifyDown = async (index: number, length: number) => {
    let curr = index;
    
    while (true) {
      if(!isMounted.current) break;
      let swapIndex = curr;
      const left = 2 * curr + 1;
      const right = 2 * curr + 2;

      // Find candidate to swap
      if (left < length) {
        if(isMounted.current) setComparingIndices([swapIndex, left]);
        if (compare(heapRef.current[left].value, heapRef.current[swapIndex].value, heapType)) {
          swapIndex = left;
        }
      }

      if (right < length) {
        if(isMounted.current) setComparingIndices([swapIndex, right]);
        if (compare(heapRef.current[right].value, heapRef.current[swapIndex].value, heapType)) {
          swapIndex = right;
        }
      }

      if (swapIndex !== curr) {
        safeSetMessage(`Bubbling down: swapping ${heapRef.current[curr].value} with ${heapRef.current[swapIndex].value}`);
        await swap(curr, swapIndex);
        curr = swapIndex;
      } else {
        break;
      }
    }
  };

  const extractRoot = async () => {
    if (operation !== 'idle' || heapRef.current.length === 0) return;
    try {
      safeSetOperation('extracting');
      
      const rootVal = heapRef.current[0].value;
      safeSetMessage(`Extracting Root: ${rootVal}`);
      
      // Swap root with last
      const lastIndex = heapRef.current.length - 1;
      if (lastIndex > 0) {
        await swap(0, lastIndex);
      }

      // Remove last (original root)
      const extracted = heapRef.current[heapRef.current.length - 1];
      if(isMounted.current) {
        setHeap(prev => prev.slice(0, -1));
        setSortedArray(prev => [...prev, extracted.value]);
      }
      safeSetMessage(`Moved ${extracted.value} to sorted list.`);
      await sleep(SLEEP_TIME);

      // Bubble Down Root
      if (heapRef.current.length > 0) {
        await heapifyDown(0, heapRef.current.length);
      }

      if(isMounted.current) setComparingIndices([]);
      safeSetOperation('idle');
      safeSetMessage('Extraction complete.');
    } catch(e) {}
  };

  const toggleType = async () => {
    const newType = heapType === 'min' ? 'max' : 'min';
    setHeapType(newType);
    
    if (heapRef.current.length > 0) {
      // Rapid reset
      reset(); 
      setMessage(`Switched to ${newType === 'min' ? 'Min' : 'Max'} Heap. (Cleared)`);
      setOperation('idle');
    }
  };

  const sort = async () => {
    if (operation !== 'idle') return;
    try {
      safeSetOperation('sorting');
      safeSetMessage("Heap Sort: Extracting all elements...");

      while (heapRef.current.length > 0) {
        if(!isMounted.current) break;
        // Re-implement extract logic here to avoid state closure issues with `extractRoot` calling
        const rootVal = heapRef.current[0].value;
        const lastIndex = heapRef.current.length - 1;
        
        if (lastIndex > 0) {
          await swap(0, lastIndex);
        }
        
        const extracted = heapRef.current[heapRef.current.length - 1];
        if(isMounted.current) {
          setHeap(prev => prev.slice(0, -1));
          setSortedArray(prev => [...prev, extracted.value]);
        }
        
        if (heapRef.current.length > 0) {
           await heapifyDown(0, heapRef.current.length);
        }
        await sleep(300); // Faster for sort
      }
      
      if(isMounted.current) setComparingIndices([]);
      safeSetOperation('idle');
      safeSetMessage("Heap Sort Complete.");
    } catch(e) {}
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
