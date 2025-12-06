import { useState, useRef, useEffect } from 'react';
import { QueueItem, QueueMode, QueueOperation } from '../types';

const MAX_SIZE = 8;
const SLEEP_TIME = 800;

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
  const safeSetOperation = (op: QueueOperation) => { if(isMounted.current) setOperation(op); };

  const changeMode = (newMode: QueueMode) => {
    setMode(newMode);
    clear();
    setMessage(`Switched to ${newMode === 'simple' ? 'Simple Queue (FIFO)' : newMode === 'circular' ? 'Circular Queue' : 'Priority Queue'}`);
  };

  const enqueue = async (value: string, priority = 3, type: QueueItem['type'] = 'default') => {
    try {
      safeSetOperation('enqueueing');
      safeSetMessage(`Enqueueing "${value}"...`);

      const newItem: QueueItem = {
        id: Math.random().toString(36).substr(2, 9),
        value,
        priority,
        type
      };

      if (mode === 'circular') {
        // Circular Logic
        // Full condition: (tail + 1) % SIZE == head
        const nextTail = (tailRef.current + 1) % MAX_SIZE;
        
        // Edge case: Initial insert
        if (headRef.current === -1) {
           if(isMounted.current) {
             setHead(0);
             setTail(0);
             const newBuf = [...bufferRef.current];
             newBuf[0] = newItem;
             setCircularBuffer(newBuf);
           }
        } else if (nextTail === headRef.current) {
          safeSetMessage("Queue Overflow! Buffer is full.");
          safeSetOperation('idle');
          return false;
        } else {
          if(isMounted.current) {
            setTail(nextTail);
            const newBuf = [...bufferRef.current];
            newBuf[nextTail] = newItem;
            setCircularBuffer(newBuf);
          }
        }
      } else {
        // Simple & Priority Logic
        if (itemsRef.current.length >= MAX_SIZE) {
          safeSetMessage("Queue Overflow! Max capacity reached.");
          safeSetOperation('idle');
          return false;
        }

        if(isMounted.current) {
          if (mode === 'priority') {
            const newItems = [...itemsRef.current, newItem].sort((a, b) => a.priority - b.priority);
            setItems(newItems);
          } else {
            setItems(prev => [...prev, newItem]);
          }
        }
      }

      await sleep(SLEEP_TIME);
      safeSetMessage(`Enqueued "${value}".`);
      safeSetOperation('idle');
      return true;
    } catch (e) {
      return false;
    }
  };

  const dequeue = async () => {
    try {
      safeSetOperation('dequeueing');
      
      if (mode === 'circular') {
        if (headRef.current === -1) {
          safeSetMessage("Queue Underflow! Queue is empty.");
          safeSetOperation('idle');
          return null;
        }

        const item = bufferRef.current[headRef.current];
        safeSetMessage(`Dequeueing "${item?.value}"...`);
        await sleep(SLEEP_TIME / 2);

        if(isMounted.current) {
          const newBuf = [...bufferRef.current];
          newBuf[headRef.current] = null;
          setCircularBuffer(newBuf);

          if (headRef.current === tailRef.current) {
            // Queue becomes empty
            setHead(-1);
            setTail(-1);
          } else {
            setHead((headRef.current + 1) % MAX_SIZE);
          }
        }
        
        await sleep(SLEEP_TIME / 2);
        safeSetOperation('idle');
        return item;

      } else {
        if (itemsRef.current.length === 0) {
          safeSetMessage("Queue Underflow! Queue is empty.");
          safeSetOperation('idle');
          return null;
        }

        const item = itemsRef.current[0];
        safeSetMessage(`Dequeueing "${item.value}"...`);
        await sleep(SLEEP_TIME);
        
        if(isMounted.current) setItems(prev => prev.slice(1));
        safeSetMessage(`Dequeued "${item.value}".`);
        safeSetOperation('idle');
        return item;
      }
    } catch (e) {
      return null;
    }
  };

  const peek = async () => {
    try {
      safeSetOperation('peeking');
      
      if (mode === 'circular') {
         if (headRef.current === -1) {
           safeSetMessage("Queue is empty.");
         } else {
           const item = bufferRef.current[headRef.current];
           safeSetMessage(`Front is "${item?.value}" at index ${headRef.current}`);
           if(isMounted.current) setPeekIndex(headRef.current);
         }
      } else {
        if (itemsRef.current.length === 0) {
          safeSetMessage("Queue is empty.");
        } else {
          safeSetMessage(`Front is "${itemsRef.current[0].value}"`);
          if(isMounted.current) setPeekIndex(0); // For simple queue this is usually 0 visually
        }
      }
      
      await sleep(1500);
      if(isMounted.current) setPeekIndex(null);
      safeSetOperation('idle');
    } catch (e) {
      // Unmounted
    }
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
    try {
      await sleep(300);
      const docs = ['Report.pdf', 'Image.png', 'Thesis.docx', 'Ticket.pdf', 'Graph.svg'];
      
      for (const doc of docs) {
        const ok = await enqueue(doc, 3, 'job');
        if (!ok) break;
        await sleep(200);
      }
      
      await sleep(1000);
      while (itemsRef.current.length > 0) {
        if(!isMounted.current) break;
        safeSetMessage("Printer Processing...");
        await dequeue();
        await sleep(500);
      }
      safeSetMessage("All print jobs finished.");
    } catch (e) {}
  };

  const runRestaurantScenario = async () => {
    changeMode('priority');
    try {
      await sleep(300);
      safeSetMessage("Opening Restaurant Queue...");
      
      // Enqueue VIPs and Regulars
      await enqueue("Walk-in Group", 3, 'person'); // Priority 3
      await enqueue("VIP Couple", 1, 'person'); // Priority 1 (High)
      await enqueue("Reservation 7pm", 2, 'person'); // Priority 2
      await enqueue("Solo Diner", 3, 'person'); // Priority 3

      await sleep(1000);
      safeSetMessage("Seating customers based on Priority...");
      
      while (itemsRef.current.length > 0) {
        if(!isMounted.current) break;
        await dequeue();
        await sleep(500);
      }
      safeSetMessage("All customers seated.");
    } catch (e) {}
  };

  const runBFSPreview = async () => {
    changeMode('simple');
    try {
      await sleep(300);
      safeSetMessage("BFS: Start at Node A");
      await enqueue("Node A", 3, 'process');
      await sleep(800);
      
      const curr = await dequeue();
      safeSetMessage(`Visited ${curr?.value}. Enqueueing neighbors B & C`);
      await sleep(800);
      
      await enqueue("Node B", 3, 'process');
      await enqueue("Node C", 3, 'process');
      await sleep(800);
      
      const b = await dequeue();
      safeSetMessage(`Visited ${b?.value}. Enqueueing neighbor D`);
      await enqueue("Node D", 3, 'process');
      
      await sleep(800);
      await dequeue(); // C
      await dequeue(); // D
      safeSetMessage("Graph Traversal Complete.");
    } catch (e) {}
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
