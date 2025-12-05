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

  const generateSteps = (
    algoFn: (
      initialState: ListState, 
      record: (s: ListState, h: string[], p: any, m: string) => void
    ) => ListState
  ) => {
    const newSteps: AnimationStep[] = [];
    
    // Helper to record a step
    const record = (state: ListState, highlightedIds: string[], pointers: any, message: string) => {
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
    
    // Update the base state to the result of the operation effectively "committing" it
    // But we only show it when the animation finishes? 
    // Actually, usually we want the base state to update ONLY after animation or immediately if we want to skip.
    // For this design, we will let the timeline drive the view. When animation ends, we sync baseState.
    setBaseState(finalState);
  };

  const insertHead = (value: number) => {
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
  };

  const insertTail = (value: number) => {
    generateSteps((initial, record) => {
      const newNodeId = `n-${Date.now()}`;
      const newNode: LinkedListNode = { id: newNodeId, value, nextId: null };
      const nodes = [...initial.nodes, newNode];
      let headId = initial.headId;

      if (!headId) {
        record({ nodes, headId: newNodeId }, [newNodeId], { head: newNodeId }, "List empty, new node is Head");
        return { nodes, headId: newNodeId };
      }

      let currId = headId;
      let curr = nodes.find(n => n.id === currId);

      record({ nodes, headId }, [currId], { head: headId, curr: currId }, "Start at Head");

      while (curr && curr.nextId) {
        currId = curr.nextId;
        curr = nodes.find(n => n.id === currId);
        record({ nodes, headId }, [currId], { head: headId, curr: currId }, "Traverse to next node");
      }

      if (curr) {
        curr.nextId = newNodeId;
        record({ nodes, headId }, [currId, newNodeId], { head: headId, curr: currId }, "Link last node to new node");
      }

      return { nodes, headId };
    });
  };

  const deleteNode = (value: number) => {
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
  };

  const reverse = () => {
    generateSteps((initial, record) => {
      // Create deep copy for mutation
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
  };

  // --- PLAYBACK ENGINE ---

  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
  };

  const play = useCallback(() => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  }, [currentStepIndex, steps.length]);

  const stepForward = () => {
    stop();
    setCurrentStepIndex(prev => Math.min(prev + 1, steps.length - 1));
  };

  const stepBackward = () => {
    stop();
    setCurrentStepIndex(prev => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            stop();
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    }
    return () => stop();
  }, [isPlaying, steps.length, speed]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        isPlaying ? stop() : play();
      } else if (e.code === 'ArrowRight') {
        stepForward();
      } else if (e.code === 'ArrowLeft') {
        stepBackward();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, play]);

  return {
    currentStep,
    totalSteps: steps.length,
    currentStepIndex,
    isPlaying,
    speed,
    setSpeed,
    play,
    pause: stop,
    stepForward,
    stepBackward,
    actions: { insertHead, insertTail, deleteNode, reverse }
  };
};
