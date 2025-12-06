import { useState, useCallback, useRef, useEffect } from 'react';
import { LinkedListNode, ListState, AnimationStep, PlaybackSpeed } from '../types';

const INITIAL_NODES: LinkedListNode[] = [
  { id: 'n1', value: 10, nextId: 'n2' },
  { id: 'n2', value: 20, nextId: 'n3' },
  { id: 'n3', value: 30, nextId: null },
];

export const useLinkedListAnimation = () => {
  // The "committed" state of the list (what exists when no animation is running)
  const [baseState, setBaseState] = useState<ListState>({
    nodes: INITIAL_NODES,
    headId: 'n1'
  });

  // Animation Timeline
  const [steps, setSteps] = useState<AnimationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);

  const timerRef = useRef<number | null>(null);

  // Computed current visual state
  const currentStep = steps[currentStepIndex] || {
    state: baseState,
    highlightedIds: [],
    pointers: { head: baseState.headId },
    message: 'Ready',
  };

  // --- ALGORITHMS ---

  type RecordFn = (state: ListState, highlightedIds: string[], pointers: { [key: string]: string | null }, message: string) => void;

  const generateSteps = useCallback((
    algoFn: (
      initialState: ListState, 
      record: RecordFn
    ) => ListState
  ) => {
    const newSteps: AnimationStep[] = [];
    
    // Helper to record a step
    const record: RecordFn = (state, highlightedIds, pointers, message) => {
      // Deep copy state to ensure immutability in history
      const deepNodes = state.nodes.map(n => ({...n}));
      newSteps.push({
        state: { nodes: deepNodes, headId: state.headId },
        highlightedIds,
        pointers,
        message
      });
    };

    // Initial snapshot
    record(baseState, [], { head: baseState.headId }, "Start");

    // Run algorithm logic
    const finalState = algoFn(baseState, record);

    // Final snapshot
    record(finalState, [], { head: finalState.headId }, "Complete");

    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    
    setBaseState(finalState);
  }, [baseState]);

  const insertHead = useCallback((value: number) => {
    generateSteps((initial, record) => {
      const newNodeId = `n-${Date.now()}`;
      const newNode: LinkedListNode = { id: newNodeId, value, nextId: null };
      
      const nodes = [...initial.nodes, newNode];
      let headId = initial.headId;

      record({ nodes, headId }, [newNodeId], { head: headId, new: newNodeId }, `Create new node ${value}`);

      newNode.nextId = headId;
      record({ nodes, headId }, [newNodeId], { head: headId, new: newNodeId }, "Point new node to current head");

      headId = newNodeId;
      record({ nodes, headId }, [newNodeId], { head: headId }, "Update Head pointer");

      return { nodes, headId };
    });
  }, [generateSteps]);

  const insertTail = useCallback((value: number) => {
    generateSteps((initial, record) => {
      const newNodeId = `n-${Date.now()}`;
      const newNode: LinkedListNode = { id: newNodeId, value, nextId: null };
      const nodes = [...initial.nodes, newNode];
      let headId = initial.headId;

      if (!headId) {
        record({ nodes, headId: newNodeId }, [newNodeId], { head: newNodeId }, "List empty, new node is Head");
        return { nodes, headId: newNodeId };
      }

      let currId: string | null = headId;
      let curr = nodes.find(n => n.id === currId);

      record({ nodes, headId }, [currId], { head: headId, curr: currId }, "Start at Head");

      while (curr && curr.nextId) {
        currId = curr.nextId;
        curr = nodes.find(n => n.id === currId);
        record({ nodes, headId }, [currId!], { head: headId, curr: currId }, "Traverse to next node");
      }

      if (curr) {
        curr.nextId = newNodeId;
        record({ nodes, headId }, [currId!, newNodeId], { head: headId, curr: currId }, "Link last node to new node");
      }

      return { nodes, headId };
    });
  }, [generateSteps]);

  const deleteNode = useCallback((value: number) => {
    generateSteps((initial, record) => {
      let nodes = [...initial.nodes.map(n => ({...n}))];
      let headId = initial.headId;

      if (!headId) {
        record(initial, [], {}, "List is empty");
        return initial;
      }

      let currId: string | null = headId;
      let prevId: string | null = null;
      let curr = nodes.find(n => n.id === currId);

      record({ nodes, headId }, [currId], { head: headId, curr: currId }, `Searching for ${value}...`);

      if (curr && curr.value === value) {
        record({ nodes, headId }, [currId], { head: headId, curr: currId }, `Found ${value} at Head`);
        headId = curr.nextId;
        nodes = nodes.filter(n => n.id !== currId);
        record({ nodes, headId }, [], { head: headId }, "Updated Head pointer");
        return { nodes, headId };
      }

      while (curr) {
        if (curr.value === value) {
           record({ nodes, headId }, [currId!], { head: headId, prev: prevId, curr: currId }, `Found ${value}`);
           const prev = nodes.find(n => n.id === prevId);
           if (prev) {
             prev.nextId = curr.nextId;
             record({ nodes, headId }, [prevId!, currId!], { head: headId, prev: prevId, curr: currId }, "Update previous node's next pointer");
           }
           nodes = nodes.filter(n => n.id !== currId);
           record({ nodes, headId }, [], { head: headId }, "Remove node from memory");
           return { nodes, headId };
        }

        prevId = currId;
        currId = curr.nextId;
        curr = nodes.find(n => n.id === currId);
        
        if (currId) {
          record({ nodes, headId }, [currId], { head: headId, prev: prevId, curr: currId }, "Traversing...");
        }
      }

      record({ nodes, headId }, [], { head: headId }, `Value ${value} not found`);
      return { nodes, headId };
    });
  }, [generateSteps]);

  const reverse = useCallback(() => {
    generateSteps((initial, record) => {
      const nodes = initial.nodes.map(n => ({...n}));
      let headId = initial.headId;

      let prevId: string | null = null;
      let currId: string | null = headId;
      let nextId: string | null = null;

      record({ nodes, headId }, [], { head: headId, prev: 'null', curr: currId }, "Initialize pointers");

      while (currId) {
        const currNode = nodes.find(n => n.id === currId)!;
        nextId = currNode.nextId;

        record({ nodes, headId }, [currId], { prev: prevId || 'null', curr: currId, next: nextId || 'null' }, "Save next node");

        currNode.nextId = prevId;
        record({ nodes, headId }, [currId], { prev: prevId || 'null', curr: currId, next: nextId || 'null' }, "Reverse pointer: Curr -> Prev");

        prevId = currId;
        currId = nextId;
        
        record({ nodes, headId }, [], { prev: prevId, curr: currId || 'null' }, "Shift pointers forward");
      }

      headId = prevId;
      record({ nodes, headId }, [], { head: headId }, "Update Head to last node");

      return { nodes, headId };
    });
  }, [generateSteps]);

  // --- PLAYBACK ENGINE ---

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const pause = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (steps.length === 0) return;
    
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  }, [currentStepIndex, steps.length]);

  const stepForward = useCallback(() => {
    pause(); // Use pause to avoid setting isPlaying(false) via stop if we wanted to stay in "play mode" but paused. 
             // Actually standard behavior is to stop playing when manually stepping.
    setCurrentStepIndex(prev => Math.min(prev + 1, steps.length - 1));
  }, [pause, steps.length]);

  const stepBackward = useCallback(() => {
    pause();
    setCurrentStepIndex(prev => Math.max(prev - 1, 0));
  }, [pause]);

  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = window.setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    }

    // Cleanup: Only clear interval, do not stop() which sets state
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, steps.length, speed]);

  // Separate effect to handle end of playback state sync
  useEffect(() => {
    if (isPlaying && currentStepIndex >= steps.length - 1 && steps.length > 0) {
      setIsPlaying(false);
    }
  }, [currentStepIndex, isPlaying, steps.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if no input is focused
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        isPlaying ? pause() : play();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        stepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        stepBackward();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, play, pause, stepForward, stepBackward]);

  return {
    currentStep,
    totalSteps: steps.length,
    currentStepIndex,
    isPlaying,
    speed,
    setSpeed,
    play,
    pause,
    stepForward,
    stepBackward,
    actions: { insertHead, insertTail, deleteNode, reverse }
  };
};
