import { useState, useRef, useEffect } from 'react';
import { Bucket, CollisionMethod, HashItem, Operation } from '../types';

const INITIAL_SIZE = 10;
const SLEEP_TIME = 600;

export const useHashTable = () => {
  const [tableSize, setTableSize] = useState(INITIAL_SIZE);
  const [buckets, setBuckets] = useState<Bucket[]>(
    Array.from({ length: INITIAL_SIZE }, (_, i) => ({ index: i, items: [], state: 'default' }))
  );
  const [method, setMethod] = useState<CollisionMethod>('chaining');
  const [operation, setOperation] = useState<Operation>('idle');
  const [message, setMessage] = useState('Ready');
  const [itemsCount, setItemsCount] = useState(0);

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
  const safeSetOperation = (op: Operation) => { if(isMounted.current) setOperation(op); };

  // Stats
  const loadFactor = itemsCount / tableSize;

  // Helpers
  const hash = (key: string, size: number) => {
    let hashVal = 0;
    if (!isNaN(Number(key))) {
      hashVal = Number(key);
    } else {
      for (let i = 0; i < key.length; i++) {
        hashVal += key.charCodeAt(i);
      }
    }
    return Math.abs(hashVal % size);
  };

  const clearHighlights = () => {
    if(isMounted.current) setBuckets(prev => prev.map(b => ({ ...b, state: 'default' })));
  };

  const reset = () => {
    setTableSize(INITIAL_SIZE);
    setBuckets(Array.from({ length: INITIAL_SIZE }, (_, i) => ({ index: i, items: [], state: 'default' })));
    setItemsCount(0);
    setMessage('Table cleared.');
    setOperation('idle');
  };

  const rehash = async () => {
    try {
      safeSetOperation('rehashing');
      safeSetMessage(`Load Factor > 0.7. Rehashing table...`);
      await sleep(1000);

      const oldBuckets = buckets;
      const newSize = tableSize * 2;
      if(isMounted.current) setTableSize(newSize);
      
      // Create new empty table
      const newBuckets: Bucket[] = Array.from({ length: newSize }, (_, i) => ({ index: i, items: [], state: 'default' }));
      
      // Gather all items
      const allItems: HashItem[] = [];
      oldBuckets.forEach(b => allItems.push(...b.items));
      
      if(isMounted.current) setBuckets(newBuckets); // Visual clear
      safeSetMessage(`Expanded size to ${newSize}. Re-inserting ${allItems.length} items...`);
      await sleep(800);

      // Re-insert logic (synchronous for speed during rehash visualization)
      for (const item of allItems) {
         const index = hash(item.key, newSize);
         if (method === 'chaining') {
           newBuckets[index].items.push(item);
         } else {
           // Linear Probing Rehash
           let idx = index;
           while (newBuckets[idx].items.length > 0) {
             idx = (idx + 1) % newSize;
           }
           newBuckets[idx].items.push(item);
         }
      }
      
      if(isMounted.current) setBuckets([...newBuckets]); // Trigger update
      safeSetOperation('idle');
      safeSetMessage('Rehashing complete.');
    } catch(e) {}
  };

  const insert = async (key: string, value: string) => {
    if (operation !== 'idle') return;
    try {
      // Check Load Factor for auto-rehash (unless we are just demoing collision)
      if (loadFactor > 0.7) {
        await rehash();
        // Since rehash is async and updates state, we must ensure new size is used.
        // But simple implementation just stops here to let user decide next.
        // Or re-call recursively? Let's just prompt user.
        return; 
      }

      safeSetOperation('inserting');
      clearHighlights();
      
      const newItem: HashItem = { id: Math.random().toString(36).substr(2, 9), key, value };
      const targetIndex = hash(key, tableSize);
      
      safeSetMessage(`Hashing "${key}": ${key} % ${tableSize} = ${targetIndex}`);
      
      if(isMounted.current) setBuckets(prev => prev.map((b, i) => i === targetIndex ? { ...b, state: 'active' } : b));
      await sleep(SLEEP_TIME);

      if (method === 'chaining') {
        // Check collision
        // Note: Accessing buckets directly from state in async function might be stale if rehash happened.
        // But we blocked concurrent ops so mostly fine.
        if (buckets[targetIndex].items.length > 0) {
          safeSetMessage(`Collision at index ${targetIndex}. Appending to chain.`);
          if(isMounted.current) setBuckets(prev => prev.map((b, i) => i === targetIndex ? { ...b, state: 'collision' } : b));
          await sleep(SLEEP_TIME);
        }

        if(isMounted.current) {
          setBuckets(prev => prev.map((b, i) => {
            if (i === targetIndex) {
              return { ...b, items: [...b.items, newItem], state: 'found' };
            }
            return b;
          }));
          setItemsCount(c => c + 1);
        }

      } else {
        // Linear Probing
        let currIndex = targetIndex;
        let probes = 0;
        
        while (probes < tableSize) {
          if(!isMounted.current) break;
          // Highlight current probe
          if(isMounted.current) setBuckets(prev => prev.map((b, i) => i === currIndex ? { ...b, state: 'active' } : { ...b, state: 'default' }));
          safeSetMessage(`Checking index ${currIndex}...`);
          await sleep(SLEEP_TIME / 2);

          // Check if empty
          if (buckets[currIndex].items.length === 0) {
            // Found spot
            if(isMounted.current) {
              setBuckets(prev => prev.map((b, i) => i === currIndex ? { ...b, items: [newItem], state: 'found' } : b));
              setItemsCount(c => c + 1);
            }
            break;
          } else {
            // Collision
            safeSetMessage(`Index ${currIndex} occupied. Probing next...`);
            if(isMounted.current) setBuckets(prev => prev.map((b, i) => i === currIndex ? { ...b, state: 'collision' } : b));
            await sleep(SLEEP_TIME / 2);
            currIndex = (currIndex + 1) % tableSize;
            probes++;
          }
        }
        
        if (probes === tableSize) {
          safeSetMessage("Table is full! Cannot insert.");
        }
      }

      await sleep(SLEEP_TIME);
      clearHighlights();
      safeSetOperation('idle');
      safeSetMessage('Inserted.');
    } catch(e) {}
  };

  const search = async (key: string) => {
    if (operation !== 'idle') return;
    try {
      safeSetOperation('searching');
      clearHighlights();

      const targetIndex = hash(key, tableSize);
      safeSetMessage(`Hashing "${key}": ${targetIndex}`);
      
      if(isMounted.current) setBuckets(prev => prev.map((b, i) => i === targetIndex ? { ...b, state: 'active' } : b));
      await sleep(SLEEP_TIME);

      if (method === 'chaining') {
         const bucket = buckets[targetIndex];
         const found = bucket.items.find(item => item.key === key);
         
         if (found) {
           safeSetMessage(`Found "${key}" in bucket ${targetIndex}.`);
           if(isMounted.current) setBuckets(prev => prev.map((b, i) => i === targetIndex ? { ...b, state: 'found' } : b));
         } else {
           safeSetMessage(`"${key}" not found in bucket ${targetIndex}.`);
           if(isMounted.current) setBuckets(prev => prev.map((b, i) => i === targetIndex ? { ...b, state: 'collision' } : b)); // Red highlight for fail
         }

      } else {
        // Linear Probing Search
        let currIndex = targetIndex;
        let probes = 0;
        let found = false;

        while (probes < tableSize) {
          if(!isMounted.current) break;
          if(isMounted.current) setBuckets(prev => prev.map((b, i) => i === currIndex ? { ...b, state: 'active' } : { ...b, state: 'default' }));
          safeSetMessage(`Checking index ${currIndex}...`);
          await sleep(SLEEP_TIME / 2);

          const bucket = buckets[currIndex];
          
          if (bucket.items.length === 0) {
             // If we hit an empty slot in probing, item doesn't exist
             break;
          }

          if (bucket.items[0].key === key) {
             if(isMounted.current) setBuckets(prev => prev.map((b, i) => i === currIndex ? { ...b, state: 'found' } : b));
             safeSetMessage(`Found "${key}" at index ${currIndex}.`);
             found = true;
             break;
          }

          currIndex = (currIndex + 1) % tableSize;
          probes++;
        }

        if (!found) {
          safeSetMessage(`"${key}" not found.`);
        }
      }

      await sleep(1500);
      clearHighlights();
      safeSetOperation('idle');
    } catch(e) {}
  };

  const deleteItem = async (key: string) => {
     if (operation !== 'idle') return;
     try {
       safeSetOperation('deleting');
       safeSetMessage(`Searching to delete "${key}"...`);

       const targetIndex = hash(key, tableSize);
       
       if (method === 'chaining') {
          if(isMounted.current) {
            setBuckets(prev => prev.map((b, i) => {
              if (i === targetIndex) {
                  const filtered = b.items.filter(item => item.key !== key);
                  if (filtered.length < b.items.length) {
                    setItemsCount(c => c - 1);
                    safeSetMessage(`Deleted "${key}".`);
                    return { ...b, items: filtered, state: 'found' };
                  }
              }
              return b;
            }));
          }
       } else {
          // Probing Delete
          let currIndex = targetIndex;
          let probes = 0;
          
          while (probes < tableSize) {
             const bucket = buckets[currIndex];
             if (bucket.items.length > 0 && bucket.items[0].key === key) {
                if(isMounted.current) {
                  setBuckets(prev => prev.map((b, i) => i === currIndex ? { ...b, items: [], state: 'found' } : b));
                  setItemsCount(c => c - 1);
                }
                safeSetMessage(`Deleted "${key}" from index ${currIndex}.`);
                break;
             }
             if (bucket.items.length === 0) break; // Not found
             currIndex = (currIndex + 1) % tableSize;
             probes++;
          }
       }
       
       await sleep(1000);
       clearHighlights();
       safeSetOperation('idle');
     } catch(e) {}
  };

  return {
    buckets,
    tableSize,
    itemsCount,
    loadFactor,
    method,
    setMethod,
    operation,
    message,
    insert,
    search,
    deleteItem,
    reset,
    rehash
  };
};
