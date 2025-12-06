import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GraphNode, GraphEdge, AlgorithmStep, AlgorithmType, GraphState, StructureState, DijkstraTableItem } from '../types';

const INITIAL_NODES: GraphNode[] = [
  { id: 'A', label: 'A', x: 250, y: 100, state: 'default' },
  { id: 'B', label: 'B', x: 150, y: 250, state: 'default' },
  { id: 'C', label: 'C', x: 350, y: 250, state: 'default' },
  { id: 'D', label: 'D', x: 100, y: 400, state: 'default' },
  { id: 'E', label: 'E', x: 250, y: 400, state: 'default' },
  { id: 'F', label: 'F', x: 400, y: 400, state: 'default' },
];

const INITIAL_EDGES: GraphEdge[] = [
  { id: 'A-B', source: 'A', target: 'B', weight: 4, state: 'default' },
  { id: 'A-C', source: 'A', target: 'C', weight: 2, state: 'default' },
  { id: 'B-D', source: 'B', target: 'D', weight: 3, state: 'default' },
  { id: 'B-E', source: 'B', target: 'E', weight: 3, state: 'default' },
  { id: 'C-E', source: 'C', target: 'E', weight: 1, state: 'default' },
  { id: 'C-F', source: 'C', target: 'F', weight: 5, state: 'default' },
  { id: 'E-F', source: 'E', target: 'F', weight: 1, state: 'default' },
];

export const useGraph = () => {
  const [nodes, setNodes] = useState<GraphNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<GraphEdge[]>(INITIAL_EDGES);
  
  // Interaction State
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const dragOffset = useRef<{ x: number, y: number }>({ x: 0, y: 0 });

  // Animation State
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef<number | null>(null);

  // --- Graph Manipulation ---

  const addNode = (x: number, y: number) => {
    const label = String.fromCharCode(65 + nodes.length + Math.floor(nodes.length / 26) * 26); // A, B, C...
    const newNode: GraphNode = {
      id: `n-${Date.now()}`,
      label: nodes.length < 26 ? label : `N${nodes.length}`,
      x,
      y,
      state: 'default'
    };
    setNodes(prev => [...prev, newNode]);
  };

  const removeNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setEdges(prev => prev.filter(e => e.source !== id && e.target !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const toggleEdge = (sourceId: string, targetId: string) => {
    const existingEdge = edges.find(
      e => (e.source === sourceId && e.target === targetId) || (e.source === targetId && e.target === sourceId)
    );

    if (existingEdge) {
      setEdges(prev => prev.filter(e => e.id !== existingEdge.id));
    } else {
      const newEdge: GraphEdge = {
        id: `${sourceId}-${targetId}-${Date.now()}`,
        source: sourceId,
        target: targetId,
        weight: Math.floor(Math.random() * 9) + 1, // Random weight 1-9
        state: 'default'
      };
      setEdges(prev => [...prev, newEdge]);
    }
  };

  // --- Algorithmic Logic ---

  const generateSteps = (
    algoType: AlgorithmType, 
    startNodeId: string
  ) => {
    const newSteps: AlgorithmStep[] = [];
    
    const record = (
      currentNodes: GraphNode[], 
      currentEdges: GraphEdge[], 
      structure: StructureState, 
      message: string,
      structureType: 'queue' | 'stack' | 'table' = 'queue'
    ) => {
      newSteps.push({
        graphState: { 
          nodes: currentNodes.map(n => ({...n})), 
          edges: currentEdges.map(e => ({...e})) 
        },
        structureState: JSON.parse(JSON.stringify(structure)),
        structureType,
        message
      });
    };

    let currentNodes: GraphNode[] = nodes.map(n => ({ ...n, state: 'default', distance: Infinity }));
    let currentEdges: GraphEdge[] = edges.map(e => ({ ...e, state: 'default' }));

    const startNode = currentNodes.find(n => n.id === startNodeId);
    if (!startNode) return;

    if (algoType === 'bfs') {
      const queue: string[] = [startNodeId];
      const visited = new Set<string>([startNodeId]);
      startNode.state = 'start';
      record(currentNodes, currentEdges, queue, `Start BFS at ${startNode.label}`, 'queue');

      while (queue.length > 0) {
        const currId = queue[0];
        const currNode = currentNodes.find(n => n.id === currId)!;
        currNode.state = 'current';
        record(currentNodes, currentEdges, queue, `Visiting ${currNode.label}`, 'queue');
        
        queue.shift();
        currNode.state = 'visited';

        const neighbors = currentEdges
          .filter(e => e.source === currId || e.target === currId)
          .map(e => {
            const neighborId = e.source === currId ? e.target : e.source;
            return { id: neighborId, edgeId: e.id };
          });

        for (const { id: nextId, edgeId } of neighbors) {
          if (!visited.has(nextId)) {
            visited.add(nextId);
            queue.push(nextId);
            const nextNode = currentNodes.find(n => n.id === nextId)!;
            nextNode.state = 'queued';
            const edge = currentEdges.find(e => e.id === edgeId)!;
            edge.state = 'traversed';
            record(currentNodes, currentEdges, queue, `Queueing neighbor ${nextNode.label}`, 'queue');
          }
        }
      }
      record(currentNodes, currentEdges, [], "BFS Traversal Complete", 'queue');
    }

    if (algoType === 'dfs') {
      const stack: string[] = [startNodeId];
      const visited = new Set<string>();
      record(currentNodes, currentEdges, stack, `Push start node ${startNode.label}`, 'stack');

      while (stack.length > 0) {
        const currId = stack.pop()!;
        const currNode = currentNodes.find(n => n.id === currId)!;

        if (!visited.has(currId)) {
          visited.add(currId);
          currNode.state = 'current';
          record(currentNodes, currentEdges, stack, `Pop and visit ${currNode.label}`, 'stack');
          currNode.state = 'visited';

          const neighbors = currentEdges
            .filter(e => e.source === currId || e.target === currId)
            .map(e => e.source === currId ? e.target : e.source);

          let added = false;
          for (const nextId of neighbors) {
            if (!visited.has(nextId)) {
               stack.push(nextId);
               const nextNode = currentNodes.find(n => n.id === nextId)!;
               if (nextNode.state !== 'visited') nextNode.state = 'queued';
               added = true;
            }
          }
          if(added) record(currentNodes, currentEdges, stack, `Push neighbors of ${currNode.label}`, 'stack');
          else record(currentNodes, currentEdges, stack, `Backtracking from ${currNode.label}`, 'stack');
        }
      }
      record(currentNodes, currentEdges, [], "DFS Traversal Complete", 'stack');
    }

    if (algoType === 'dijkstra') {
      startNode.distance = 0;
      startNode.state = 'start';
      let pq: DijkstraTableItem[] = [{ id: startNodeId, dist: 0 }];
      const visited = new Set<string>();
      
      record(currentNodes, currentEdges, pq, `Initialize distances. Start: 0`, 'table');

      while (pq.length > 0) {
        pq.sort((a, b) => a.dist - b.dist);
        const { id: currId, dist } = pq.shift()!;
        
        if (visited.has(currId)) continue;
        visited.add(currId);

        const currNode = currentNodes.find(n => n.id === currId)!;
        currNode.state = 'current';
        record(currentNodes, currentEdges, pq, `Visit closest node: ${currNode.label} (dist: ${dist})`, 'table');
        currNode.state = 'visited';

        const neighbors = currentEdges
          .filter(e => e.source === currId || e.target === currId)
          .map(e => ({ 
             id: e.source === currId ? e.target : e.source, 
             weight: e.weight,
             edgeId: e.id 
          }));

        for (const { id: nextId, weight, edgeId } of neighbors) {
           if (!visited.has(nextId)) {
             const nextNode = currentNodes.find(n => n.id === nextId)!;
             const newDist = dist + weight;
             
             if (newDist < (nextNode.distance || Infinity)) {
               nextNode.distance = newDist;
               pq.push({ id: nextId, dist: newDist });
               const edge = currentEdges.find(e => e.id === edgeId)!;
               edge.state = 'traversed';
               record(currentNodes, currentEdges, pq, `Update ${nextNode.label} dist to ${newDist}`, 'table');
             }
           }
        }
      }
      record(currentNodes, currentEdges, [], "Shortest paths calculated", 'table');
    }

    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  const handleNodeMouseDown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) return;
    setDraggingNodeId(id);
  };

  const handleNodeClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) return;
    if (selectedNodeId === null) setSelectedNodeId(id);
    else if (selectedNodeId === id) setSelectedNodeId(null);
    else {
      toggleEdge(selectedNodeId, id);
      setSelectedNodeId(null);
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isPlaying) return;
    const pt = e.currentTarget.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(e.currentTarget.getScreenCTM()?.inverse());
    dragOffset.current = { x: svgP.x, y: svgP.y };
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggingNodeId) return;
    const pt = e.currentTarget.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(e.currentTarget.getScreenCTM()?.inverse());
    setNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, x: svgP.x, y: svgP.y } : n));
  };

  const handleCanvasMouseUp = () => {
    setDraggingNodeId(null);
  };

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isPlaying || draggingNodeId) return;
    if (selectedNodeId) {
      setSelectedNodeId(null);
      return;
    }
    const pt = e.currentTarget.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(e.currentTarget.getScreenCTM()?.inverse());
    addNode(svgP.x, svgP.y);
  };

  const handleNodeTouchStart = (id: string, e: React.TouchEvent) => {
    e.stopPropagation();
    if (isPlaying) return;
    setDraggingNodeId(id);
    setSelectedNodeId(prev => prev === id ? null : id);
  };

  const handleCanvasTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    if (isPlaying) return;
    if (e.touches.length > 1) return;
    const touch = e.touches[0];
    const pt = e.currentTarget.createSVGPoint();
    pt.x = touch.clientX;
    pt.y = touch.clientY;
    const svgP = pt.matrixTransform(e.currentTarget.getScreenCTM()?.inverse());
    dragOffset.current = { x: svgP.x, y: svgP.y };
  };

  const handleCanvasTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!draggingNodeId) return;
    const touch = e.touches[0];
    const pt = e.currentTarget.createSVGPoint();
    pt.x = touch.clientX;
    pt.y = touch.clientY;
    const svgP = pt.matrixTransform(e.currentTarget.getScreenCTM()?.inverse());
    setNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, x: svgP.x, y: svgP.y } : n));
  };

  const handleCanvasTouchEnd = () => {
    setDraggingNodeId(null);
  };

  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
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

  const reset = () => {
    stop();
    setSteps([]);
    setCurrentStepIndex(0);
    setNodes(prev => prev.map(n => ({...n, state: 'default', distance: undefined})));
    setEdges(prev => prev.map(e => ({...e, state: 'default'})));
    setSelectedNodeId(null);
  };

  const loadPreset = (type: 'social' | 'map' | 'tree') => {
    reset();
    if (type === 'tree') {
      setNodes([
        { id: '1', label: 'Root', x: 250, y: 50, state: 'default' },
        { id: '2', label: 'L', x: 150, y: 150, state: 'default' },
        { id: '3', label: 'R', x: 350, y: 150, state: 'default' },
        { id: '4', label: 'LL', x: 100, y: 250, state: 'default' },
        { id: '5', label: 'LR', x: 200, y: 250, state: 'default' }
      ]);
      setEdges([
        { id: 'e1', source: '1', target: '2', weight: 1, state: 'default' },
        { id: 'e2', source: '1', target: '3', weight: 1, state: 'default' },
        { id: 'e3', source: '2', target: '4', weight: 1, state: 'default' },
        { id: 'e4', source: '2', target: '5', weight: 1, state: 'default' }
      ]);
    } else {
      setNodes(INITIAL_NODES);
      setEdges(INITIAL_EDGES);
    }
  };

  const currentStep = steps[currentStepIndex];
  const activeNodes = currentStep ? currentStep.graphState.nodes : nodes;
  const activeEdges = currentStep ? currentStep.graphState.edges : edges;

  return {
    nodes: activeNodes,
    edges: activeEdges,
    selectedNodeId,
    isPlaying,
    currentStepIndex,
    totalSteps: steps.length,
    currentStep,
    speed,
    setSpeed,
    handlers: {
      handleCanvasClick,
      handleCanvasMouseDown,
      handleCanvasMouseMove,
      handleCanvasMouseUp,
      handleNodeClick,
      handleNodeMouseDown,
      handleCanvasTouchStart,
      handleCanvasTouchMove,
      handleCanvasTouchEnd,
      handleNodeTouchStart,
      removeNode
    },
    runAlgorithm: generateSteps,
    reset,
    loadPreset,
    stop,
    stepForward: () => { stop(); setCurrentStepIndex(p => Math.min(p + 1, steps.length - 1)); },
    stepBackward: () => { stop(); setCurrentStepIndex(p => Math.max(p - 1, 0)); }
  };
};
