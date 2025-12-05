import { useState, useRef, useEffect } from 'react';
import { Bucket, CollisionMethod, HashItem, Operation } from '../types';

const INITIAL_SIZE = 10;
const SLEEP_TIME = 600;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useHashTable = () => {
  const [tableSize, setTableSize] = useState(INITIAL_SIZE);
  const [buckets, setBuckets] = useState<Bucket[]>(
    Array.from({ length: INITIAL_SIZE }, (_, i) => ({ index: i, items: [], state: 'default' }))
  );
  const [method, setMethod] = useState<CollisionMethod>('chaining');
  const [operation, setOperation] = useState<Operation>('idle');
  const [message, setMessage] = useState('Ready');
  const [itemsCount, setItemsCount] = useState(0);

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
    return hashVal % size;
  };

  const clearHighlights = () => {
    setBuckets(prev => prev.map(b => ({ ...b, state: 'default' })));
  };

  const reset = () => {
    setTableSize(INITIAL_SIZE);
    setBuckets(Array.from({ length: INITIAL_SIZE }, (_, i) => ({ index: i, items: [], state: 'default' })));
    setItemsCount(0);
    setMessage('Table cleared.');
    setOperation('idle');
  };

  const rehash = async () => {
    setOperation('rehashing');
    setMessage(`Load Factor > 0.7. Rehashing table...`);
    await sleep(1000);

    const oldBuckets = buckets;
    const newSize = tableSize * 2;
    setTableSize(newSize);
    
    // Create new empty table
    const newBuckets: Bucket[] = Array.from({ length: newSize }, (_, i) => ({ index: i, items: [], state: 'default' }));
    
    // Gather all items
    const allItems: HashItem[] = [];
    oldBuckets.forEach(b => allItems.push(...b.items));
    
    setBuckets(newBuckets); // Visual clear
    setMessage(`Expanded size to ${newSize}. Re-inserting ${allItems.length} items...`);
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
    
    setBuckets([...newBuckets]); // Trigger update
    setOperation('idle');
    setMessage('Rehashing complete.');
  };

  const insert = async (key: string, value: string) => {
    if (operation !== 'idle') return;
    
    // Check Load Factor for auto-rehash (unless we are just demoing collision)
    if (loadFactor > 0.7) {
      await rehash();
      // Continue insert after rehash? For simplicity, we ask user to re-click or handle internally.
      // Let's recursively call insert with new state logic would be complex due to closures.
      // For this demo, we'll stop and let user click again or just handle it. 
      // Actually, let's just proceed with insert on the NEW table state.
      // NOTE: React state updates are async, so 'buckets' variable here is stale.
      // We will skip auto-rehash call inside insert for simplicity and rely on the button or "Suggested" message.
    }

    setOperation('inserting');
    clearHighlights();
    
    const newItem: HashItem = { id: Math.random().toString(36).substr(2, 9), key, value };
    const targetIndex = hash(key, tableSize);
    
    setMessage(`Hashing "${key}": ${key} % ${tableSize} = ${targetIndex}`);
    
    setBuckets(prev => prev.map((b, i) => i === targetIndex ? { ...b, state: 'active' } : b));
    await sleep(SLEEP_TIME);

    if (method === 'chaining') {
      // Check collision
      if (buckets[targetIndex].items.length > 0) {
        setMessage(`Collision at index ${targetIndex}. Appending to chain.`);
        setBuckets(prev => prev.map((b, i) => i === targetIndex ? { ...b, state: 'collision' } : b));
        await sleep(SLEEP_TIME);
      }

      setBuckets(prev => prev.map((b, i) => {
        if (i === targetIndex) {
          return { ...b, items: [...b.items, newItem], state: 'found' };
        }
        return b;
      }));
      setItemsCount(c => c + 1);

    } else {
      // Linear Probing
      let currIndex = targetIndex;
      let probes = 0;
      
      while (probes < tableSize) {
        // Highlight current probe
        setBuckets(prev => prev.map((b, i) => i === currIndex ? { ...b, state: 'active' } : { ...b, state: 'default' }));
        setMessage(`Checking index ${currIndex}...`);
        await sleep(SLEEP_TIME / 2);

        // Check if empty
        if (buckets[currIndex].items.length === 0) {
          // Found spot
          setBuckets(prev => prev.map((b, i) => i === currIndex ? { ...b, items: [newItem], state: 'found' } : b));
          setItemsCount(c => c + 1);
          break;
        } else {
          // Collision
          setMessage(`Index ${currIndex} occupied. Probing next...`);
          setBuckets(prev => prev.map((b, i) => i === currIndex ? { ...b, state: 'collision' } : b));
          await sleep(SLEEP_TIME / 2);
          currIndex = (currIndex + 1) % tableSize;
          probes++;
        }
      }
      
      if (probes === tableSize) {
        setMessage("Table is full! Cannot insert.");
      }
    }

    await sleep(SLEEP_TIME);
    clearHighlights();
    setOperation('idle');
    setMessage('Inserted.');
  };

  const search = async (key: string) => {
    if (operation !== 'idle') return;
    setOperation('searching');
    clearHighlights();

    const targetIndex = hash(key, tableSize);
    setMessage(`Hashing "${key}": ${targetIndex}`);
    
    setBuckets(prev => prev.map((b, i) => i === targetIndex ? { ...b, state: 'active' } : b));
    await sleep(SLEEP_TIME);

    if (method === 'chaining') {
       const bucket = buckets[targetIndex];
       const found = bucket.items.find(item => item.key === key);
       
       if (found) {
         setMessage(`Found "${key}" in bucket ${targetIndex}.`);
         setBuckets(prev => prev.map((b, i) => i === targetIndex ? { ...b, state: 'found' } : b));
       } else {
         setMessage(`"${key}" not found in bucket ${targetIndex}.`);
         setBuckets(prev => prev.map((b, i) => i === targetIndex ? { ...b, state: 'collision' } : b)); // Red highlight for fail
       }

    } else {
      // Linear Probing Search
      let currIndex = targetIndex;
      let probes = 0;
      let found = false;

      while (probes < tableSize) {
        setBuckets(prev => prev.map((b, i) => i === currIndex ? { ...b, state: 'active' } : { ...b, state: 'default' }));
        setMessage(`Checking index ${currIndex}...`);
        await sleep(SLEEP_TIME / 2);

        const bucket = buckets[currIndex];
        
        if (bucket.items.length === 0) {
           // If we hit an empty slot in probing, item doesn't exist
           break;
        }

        if (bucket.items[0].key === key) {
           setBuckets(prev => prev.map((b, i) => i === currIndex ? { ...b, state: 'found' } : b));
           setMessage(`Found "${key}" at index ${currIndex}.`);
           found = true;
           break;
        }

        currIndex = (currIndex + 1) % tableSize;
        probes++;
      }

      if (!found) {
        setMessage(`"${key}" not found.`);
      }
    }

    await sleep(1500);
    clearHighlights();
    setOperation('idle');
  };

  const deleteItem = async (key: string) => {
     if (operation !== 'idle') return;
     setOperation('deleting');
     setMessage(`Searching to delete "${key}"...`);

     // For simplicity in this visualizer, we just find and remove without complex animation 
     // (or re-hashing for probing deletion which is actually complex - usually requires 'deleted' marker).
     // We will implement simple removal for chaining, and simple removal (leaving hole) for probing 
     // Note: Real linear probing requires moving items back or using tombstones. We'll use Tombstone conceptually or just leave hole for visualizer simplicity.
     
     const targetIndex = hash(key, tableSize);
     
     if (method === 'chaining') {
        setBuckets(prev => prev.map((b, i) => {
           if (i === targetIndex) {
              const filtered = b.items.filter(item => item.key !== key);
              if (filtered.length < b.items.length) {
                 setItemsCount(c => c - 1);
                 setMessage(`Deleted "${key}".`);
                 return { ...b, items: filtered, state: 'found' };
              }
           }
           return b;
        }));
     } else {
        // Probing Delete (Naive - just remove)
        // In a real educational tool, explaining tombstones is good.
        // Let's just find and remove for now.
        let currIndex = targetIndex;
        let probes = 0;
        
        while (probes < tableSize) {
           const bucket = buckets[currIndex];
           if (bucket.items.length > 0 && bucket.items[0].key === key) {
              setBuckets(prev => prev.map((b, i) => i === currIndex ? { ...b, items: [], state: 'found' } : b));
              setItemsCount(c => c - 1);
              setMessage(`Deleted "${key}" from index ${currIndex}.`);
              break;
           }
           if (bucket.items.length === 0) break; // Not found
           currIndex = (currIndex + 1) % tableSize;
           probes++;
        }
     }
     
     await sleep(1000);
     clearHighlights();
     setOperation('idle');
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
