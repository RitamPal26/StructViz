import { useState, useRef, useEffect, useCallback } from 'react';
import { Bucket, CollisionMethod, HashItem, HashStep, HashState, Operation } from '../types';

const INITIAL_SIZE = 10;

export const useHashTable = () => {
  // The "committed" state (what the table looks like when idle)
  const [baseState, setBaseState] = useState<HashState>({
    buckets: Array.from({ length: INITIAL_SIZE }, (_, i) => ({ index: i, items: [], state: 'default' })),
    itemsCount: 0,
    tableSize: INITIAL_SIZE
  });

  const [method, setMethod] = useState<CollisionMethod>('chaining');
  
  // Animation Control
  const [steps, setSteps] = useState<HashStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef<number | null>(null);

  // Computed current visual state
  const currentStep = steps[currentStepIndex] || {
    state: baseState,
    activeBucketIndex: null,
    collisionIndex: null,
    message: 'Ready to process',
  };

  const loadFactor = baseState.itemsCount / baseState.tableSize;

  // --- HELPERS ---

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

  // --- ANIMATION ENGINE ---

  const play = useCallback(() => {
    if (currentStepIndex >= steps.length - 1) setCurrentStepIndex(0);
    setIsPlaying(true);
  }, [currentStepIndex, steps.length]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const stepForward = useCallback(() => {
    pause();
    setCurrentStepIndex(prev => Math.min(prev + 1, steps.length - 1));
  }, [pause, steps.length]);

  const stepBackward = useCallback(() => {
    pause();
    setCurrentStepIndex(prev => Math.max(prev - 1, 0));
  }, [pause]);

  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      timerRef.current = window.setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            pause();
            return prev;
          }
          return prev + 1;
        });
      }, 1200 / speed); // Slower base speed (1200ms) for clarity
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, steps.length, speed, pause]);

  // --- ALGORITHMS (Step Generators) ---

  const generateSteps = useCallback((
    algoFn: (initial: HashState, record: (s: HashState, idx: number|null, col: number|null, msg: string) => void) => HashState
  ) => {
    const newSteps: HashStep[] = [];
    
    const record = (s: HashState, activeIdx: number | null, collisionIdx: number | null, msg: string) => {
      // Deep copy buckets to isolate frames
      const deepBuckets = s.buckets.map(b => ({
        ...b,
        items: [...b.items], // Copy items array
      }));
      
      newSteps.push({
        state: { ...s, buckets: deepBuckets },
        activeBucketIndex: activeIdx,
        collisionIndex: collisionIdx,
        message: msg
      });
    };

    // Initial snapshot
    record(baseState, null, null, "Starting operation...");

    // Run algo
    const finalState = algoFn(baseState, record);

    // Final snapshot
    record(finalState, null, null, "Operation Complete.");

    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setBaseState(finalState);
  }, [baseState]);

  const insert = useCallback((key: string, value: string) => {
    generateSteps((initialState, record) => {
      const state = { ...initialState, buckets: initialState.buckets.map(b => ({...b, state: 'default' as Bucket['state']})) };
      const newItem: HashItem = { id: Math.random().toString(36).substr(2, 9), key, value };
      
      const targetIndex = hash(key, state.tableSize);
      
      record(state, null, null, `Computing Hash: hash("${key}") % ${state.tableSize}`);
      record(state, targetIndex, null, `Result = Index ${targetIndex}`);

      // Highlight target
      state.buckets[targetIndex].state = 'active';
      record(state, targetIndex, null, `Checking Bucket ${targetIndex}...`);

      if (method === 'chaining') {
        const bucket = state.buckets[targetIndex];
        
        if (bucket.items.length > 0) {
          // Collision!
          state.buckets[targetIndex].state = 'collision';
          record(state, targetIndex, targetIndex, `Collision! Bucket ${targetIndex} is not empty.`);
          record(state, targetIndex, null, `Resolution: Chaining. Appending "${key}" to list.`);
        }

        bucket.items.push(newItem);
        state.buckets[targetIndex].state = 'found';
        state.itemsCount++;
        
        record(state, targetIndex, null, `Inserted "${key}: ${value}" at index ${targetIndex}.`);
      } 
      else {
        // Linear Probing
        let currIndex = targetIndex;
        let probes = 0;
        let inserted = false;

        while (probes < state.tableSize) {
          state.buckets[currIndex].state = 'active';
          
          if (state.buckets[currIndex].items.length === 0) {
            // Found spot
            record(state, currIndex, null, `Bucket ${currIndex} is empty. Found spot.`);
            state.buckets[currIndex].items.push(newItem);
            state.buckets[currIndex].state = 'found';
            state.itemsCount++;
            inserted = true;
            break;
          } else {
            // Collision
            state.buckets[currIndex].state = 'collision';
            record(state, currIndex, currIndex, `Collision at ${currIndex}! Probing next...`);
            
            // Prepare for next loop
            state.buckets[currIndex].state = 'probing'; // Mark previous as probed
            currIndex = (currIndex + 1) % state.tableSize;
            probes++;
            
            record(state, currIndex, null, `Moving to index ${currIndex}...`);
          }
        }

        if (!inserted) {
           record(state, null, null, "Table is full! Cannot insert.");
        } else {
           record(state, currIndex, null, `Inserted "${key}" after ${probes} probes.`);
        }
      }

      // Cleanup visual states for final frame
      state.buckets.forEach(b => { 
        if(b.state !== 'found') b.state = 'default'; 
      });
      
      return state;
    });
  }, [generateSteps, method, hash]);

  const reset = useCallback(() => {
    setBaseState({
      buckets: Array.from({ length: INITIAL_SIZE }, (_, i) => ({ index: i, items: [], state: 'default' })),
      itemsCount: 0,
      tableSize: INITIAL_SIZE
    });
    setSteps([]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, []);

  const search = useCallback((key: string) => {
    generateSteps((initialState, record) => {
      const state = { ...initialState, buckets: initialState.buckets.map(b => ({...b, state: 'default' as Bucket['state']})) };
      const targetIndex = hash(key, state.tableSize);
      
      record(state, targetIndex, null, `Searching for "${key}" (Hash: ${targetIndex})`);

      if (method === 'chaining') {
         state.buckets[targetIndex].state = 'active';
         record(state, targetIndex, null, `Checking Bucket ${targetIndex}...`);
         
         const found = state.buckets[targetIndex].items.find(i => i.key === key);
         if (found) {
           state.buckets[targetIndex].state = 'found';
           record(state, targetIndex, null, `Found "${key}"!`);
         } else {
           state.buckets[targetIndex].state = 'collision';
           record(state, targetIndex, null, `Key "${key}" not found in bucket.`);
         }
      } else {
        let currIndex = targetIndex;
        let probes = 0;
        let found = false;
        
        while (probes < state.tableSize) {
           state.buckets[currIndex].state = 'active';
           record(state, currIndex, null, `Checking Bucket ${currIndex}...`);
           
           if (state.buckets[currIndex].items.length === 0) {
             break; // Empty slot means item doesn't exist in probing
           }

           if (state.buckets[currIndex].items[0].key === key) {
             state.buckets[currIndex].state = 'found';
             record(state, currIndex, null, `Found "${key}" at index ${currIndex}!`);
             found = true;
             break;
           }

           state.buckets[currIndex].state = 'probing';
           currIndex = (currIndex + 1) % state.tableSize;
           probes++;
        }

        if (!found) {
           record(state, null, null, `"${key}" not found in table.`);
        }
      }
      return state;
    });
  }, [generateSteps, method, hash]);

  return {
    // Current Step Data
    buckets: currentStep.state.buckets,
    itemsCount: currentStep.state.itemsCount,
    tableSize: currentStep.state.tableSize,
    activeBucketIndex: currentStep.activeBucketIndex,
    collisionIndex: currentStep.collisionIndex,
    message: currentStep.message,
    
    // Config
    method,
    setMethod: (m: CollisionMethod) => { 
      reset(); 
      setMethod(m); 
    },
    loadFactor,
    
    // Actions
    insert,
    search,
    reset,
    
    // Playback
    isPlaying,
    currentStepIndex,
    totalSteps: steps.length,
    play,
    pause,
    stepForward,
    stepBackward,
    speed,
    setSpeed
  };
};