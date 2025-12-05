import { useState, useRef, useCallback } from 'react';
import { QueueItem, QueueMode, QueueOperation } from '../types';

const MAX_SIZE = 8;
const SLEEP_TIME = 800;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useQueue = () => {
  const [items, setItems] = useState<QueueItem[]>([]);
  // Circular Queue State
  const [circularBuffer, setCircularBuffer] = useState<(QueueItem | null)[]>(new Array(MAX_SIZE).fill(null));
  const [head, setHead] = useState<number>(-1);
  const [tail, setTail] = useState<number>(-1);
  
  const [mode, setMode] = useState<QueueMode>('simple');
  const [operation, setOperation] = useState<QueueOperation>('idle');
  const [message, setMessage] = useState('Ready to Queue');
  const [peekIndex, setPeekIndex] = useState<number | null>(null);

  // Refs for async scenario access
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const bufferRef = useRef(circularBuffer);
  bufferRef.current = circularBuffer;
  const headRef = useRef(head);
  headRef.current = head;
  const tailRef = useRef(tail);
  tailRef.current = tail;

  const changeMode = (newMode: QueueMode) => {
    setMode(newMode);
    clear();
    setMessage(`Switched to ${newMode === 'simple' ? 'Simple Queue (FIFO)' : newMode === 'circular' ? 'Circular Queue' : 'Priority Queue'}`);
  };

  const enqueue = async (value: string, priority = 3, type: QueueItem['type'] = 'default') => {
    setOperation('enqueueing');
    setMessage(`Enqueueing "${value}"...`);

    const newItem: QueueItem = {
      id: Math.random().toString(36).substr(2, 9),
      value,
      priority,
      type
    };

    if (mode === 'circular') {
      // Circular Logic
      if ((headRef.current === 0 && tailRef.current === MAX_SIZE - 1) || (tailRef.current === (headRef.current - 1) % (MAX_SIZE - 1))) {
        setMessage("Queue Overflow! Buffer is full.");
        setOperation('idle');
        return false;
      }

      if (headRef.current === -1) {
        setHead(0);
        setTail(0);
        const newBuf = [...bufferRef.current];
        newBuf[0] = newItem;
        setCircularBuffer(newBuf);
      } else if (tailRef.current === MAX_SIZE - 1 && headRef.current !== 0) {
        setTail(0);
        const newBuf = [...bufferRef.current];
        newBuf[0] = newItem;
        setCircularBuffer(newBuf);
      } else {
        const nextTail = (tailRef.current + 1) % MAX_SIZE; // Standard math
        // Actually for visual simplicity in this demo, let's use the explicit indices logic above or standard mod
        // Let's stick to standard circular logic:
        // Check full: (tail + 1) % size == head
        if ((tailRef.current + 1) % MAX_SIZE === headRef.current) {
          setMessage("Queue Overflow!");
          setOperation('idle');
          return false;
        }
        
        const newTail = (tailRef.current + 1) % MAX_SIZE;
        setTail(newTail);
        const newBuf = [...bufferRef.current];
        newBuf[newTail] = newItem;
        setCircularBuffer(newBuf);
      }
    } else {
      // Simple & Priority Logic
      if (itemsRef.current.length >= MAX_SIZE) {
        setMessage("Queue Overflow! Max capacity reached.");
        setOperation('idle');
        return false;
      }

      if (mode === 'priority') {
        const newItems = [...itemsRef.current, newItem].sort((a, b) => a.priority - b.priority);
        setItems(newItems);
      } else {
        setItems(prev => [...prev, newItem]);
      }
    }

    await sleep(SLEEP_TIME);
    setMessage(`Enqueued "${value}".`);
    setOperation('idle');
    return true;
  };

  const dequeue = async () => {
    setOperation('dequeueing');
    
    if (mode === 'circular') {
      if (headRef.current === -1) {
        setMessage("Queue Underflow! Queue is empty.");
        setOperation('idle');
        return null;
      }

      const item = bufferRef.current[headRef.current];
      setMessage(`Dequeueing "${item?.value}"...`);
      await sleep(SLEEP_TIME / 2);

      const newBuf = [...bufferRef.current];
      newBuf[headRef.current] = null;
      setCircularBuffer(newBuf);

      if (headRef.current === tailRef.current) {
        setHead(-1);
        setTail(-1);
      } else if (headRef.current === MAX_SIZE - 1) {
        setHead(0);
      } else {
        setHead(headRef.current + 1);
      }
      
      await sleep(SLEEP_TIME / 2);
      setOperation('idle');
      return item;

    } else {
      if (itemsRef.current.length === 0) {
        setMessage("Queue Underflow! Queue is empty.");
        setOperation('idle');
        return null;
      }

      const item = itemsRef.current[0];
      setMessage(`Dequeueing "${item.value}"...`);
      await sleep(SLEEP_TIME);
      
      setItems(prev => prev.slice(1));
      setMessage(`Dequeued "${item.value}".`);
      setOperation('idle');
      return item;
    }
  };

  const peek = async () => {
    setOperation('peeking');
    
    if (mode === 'circular') {
       if (headRef.current === -1) {
         setMessage("Queue is empty.");
       } else {
         const item = bufferRef.current[headRef.current];
         setMessage(`Front is "${item?.value}" at index ${headRef.current}`);
         setPeekIndex(headRef.current);
       }
    } else {
      if (itemsRef.current.length === 0) {
        setMessage("Queue is empty.");
      } else {
        setMessage(`Front is "${itemsRef.current[0].value}"`);
        setPeekIndex(0); // For simple queue this is usually 0 visually
      }
    }
    
    await sleep(1500);
    setPeekIndex(null);
    setOperation('idle');
  };

  const clear = () => {
    setItems([]);
    setCircularBuffer(new Array(MAX_SIZE).fill(null));
    setHead(-1);
    setTail(-1);
    setMessage('Queue cleared.');
    setOperation('idle');
  };

  // --- SCENARIOS ---

  const runPrintScenario = async () => {
    changeMode('simple');
    await sleep(300);
    const docs = ['Report.pdf', 'Image.png', 'Thesis.docx', 'Ticket.pdf', 'Graph.svg'];
    
    for (const doc of docs) {
      const ok = await enqueue(doc, 3, 'job');
      if (!ok) break;
      await sleep(200);
    }
    
    await sleep(1000);
    while (itemsRef.current.length > 0) {
      setMessage("Printer Processing...");
      await dequeue();
      await sleep(500);
    }
    setMessage("All print jobs finished.");
  };

  const runRestaurantScenario = async () => {
    changeMode('priority');
    await sleep(300);
    setMessage("Opening Restaurant Queue...");
    
    // Enqueue VIPs and Regulars
    await enqueue("Walk-in Group", 3, 'person'); // Priority 3
    await enqueue("VIP Couple", 1, 'person'); // Priority 1 (High)
    await enqueue("Reservation 7pm", 2, 'person'); // Priority 2
    await enqueue("Solo Diner", 3, 'person'); // Priority 3

    await sleep(1000);
    setMessage("Seating customers based on Priority...");
    
    while (itemsRef.current.length > 0) {
      await dequeue();
      await sleep(500);
    }
    setMessage("All customers seated.");
  };

  const runBFSPreview = async () => {
    changeMode('simple');
    await sleep(300);
    setMessage("BFS: Start at Node A");
    await enqueue("Node A", 3, 'process');
    await sleep(800);
    
    const curr = await dequeue();
    setMessage(`Visited ${curr?.value}. Enqueueing neighbors B & C`);
    await sleep(800);
    
    await enqueue("Node B", 3, 'process');
    await enqueue("Node C", 3, 'process');
    await sleep(800);
    
    const b = await dequeue();
    setMessage(`Visited ${b?.value}. Enqueueing neighbor D`);
    await enqueue("Node D", 3, 'process');
    
    await sleep(800);
    await dequeue(); // C
    await dequeue(); // D
    setMessage("Graph Traversal Complete.");
  };

  return {
    items,
    circularBuffer,
    head,
    tail,
    mode,
    changeMode,
    operation,
    message,
    peekIndex,
    enqueue,
    dequeue,
    peek,
    clear,
    scenarios: {
      print: runPrintScenario,
      restaurant: runRestaurantScenario,
      bfs: runBFSPreview
    }
  };
};
