import { useState, useCallback, useRef, useEffect } from 'react';
import { GridCell, AlgorithmType, GridState, MouseMode, CellType } from '../types';
import { useSound } from '../../../shared/context/SoundContext';

// Helper to determine grid size based on viewport
const getGridDimensions = () => {
  if (typeof window === 'undefined') return { rows: 25, cols: 50 };
  if (window.innerWidth < 640) return { rows: 18, cols: 15 }; // Mobile
  if (window.innerWidth < 1024) return { rows: 20, cols: 30 }; // Tablet
  return { rows: 25, cols: 50 }; // Desktop
};

export const usePathfinding = () => {
  const [dimensions, setDimensions] = useState(getGridDimensions());
  const [grid, setGrid] = useState<GridCell[][]>([]);
  
  // Calculate relative start/finish positions based on grid size
  const getInitialNodes = (rows: number, cols: number) => ({
    start: { row: Math.floor(rows / 2), col: Math.floor(cols * 0.2) },
    finish: { row: Math.floor(rows / 2), col: Math.floor(cols * 0.8) }
  });

  const [startNode, setStartNode] = useState(getInitialNodes(dimensions.rows, dimensions.cols).start);
  const [finishNode, setFinishNode] = useState(getInitialNodes(dimensions.rows, dimensions.cols).finish);
  
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [stats, setStats] = useState({ visited: 0, length: 0 });
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('dijkstra');
  const [speed, setSpeed] = useState(20);

  const isMousePressed = useRef(false);
  const mouseMode = useRef<MouseMode>('idle');
  const { play } = useSound();

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const newDims = getGridDimensions();
      // Debounce slightly or just check if changed
      if (newDims.rows !== dimensions.rows || newDims.cols !== dimensions.cols) {
        setDimensions(newDims);
        // Reset start/finish for new dimensions
        const { start, finish } = getInitialNodes(newDims.rows, newDims.cols);
        setStartNode(start);
        setFinishNode(finish);
      }
    };

    let timeoutId: number;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(handleResize, 200);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [dimensions]);

  // Initialize Grid
  const createNode = useCallback((row: number, col: number, sNode: typeof startNode, fNode: typeof finishNode): GridCell => {
    return {
      row,
      col,
      type: (row === sNode.row && col === sNode.col) ? 'start' :
            (row === fNode.row && col === fNode.col) ? 'finish' : 'empty',
      distance: Infinity,
      isVisited: false,
      previousNode: null,
      fScore: Infinity,
      gScore: Infinity,
      hScore: Infinity
    };
  }, []);

  const resetGrid = useCallback((clearWalls = false) => {
    setIsRunning(false); // Stop any running algo
    const newGrid: GridCell[][] = [];
    for (let row = 0; row < dimensions.rows; row++) {
      const currentRow: GridCell[] = [];
      for (let col = 0; col < dimensions.cols; col++) {
        const node = createNode(row, col, startNode, finishNode);
        // Preserve walls if not clearing and bounds check
        if (!clearWalls && grid[row] && grid[row][col] && grid[row][col].type === 'wall') {
          node.type = 'wall';
        }
        currentRow.push(node);
      }
      newGrid.push(currentRow);
    }
    setGrid(newGrid);
    setIsFinished(false);
    setStats({ visited: 0, length: 0 });
  }, [dimensions, startNode, finishNode, grid, createNode]);

  // Re-run resetGrid when dimensions or start/finish nodes change significantly (init)
  useEffect(() => {
    // Only reset if grid size doesn't match dimensions or it's empty
    if (grid.length !== dimensions.rows || (grid[0] && grid[0].length !== dimensions.cols)) {
      resetGrid(true);
    }
  }, [dimensions, resetGrid, grid]);

  // --- MOUSE HANDLERS ---

  const handleMouseDown = (row: number, col: number) => {
    if (isRunning) return;
    isMousePressed.current = true;
    
    if (row === startNode.row && col === startNode.col) {
      mouseMode.current = 'moveStart';
    } else if (row === finishNode.row && col === finishNode.col) {
      mouseMode.current = 'moveFinish';
    } else {
      mouseMode.current = 'wall';
      toggleWall(row, col);
    }
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isMousePressed.current || isRunning) return;
    
    // Bounds check
    if (row < 0 || row >= dimensions.rows || col < 0 || col >= dimensions.cols) return;

    if (mouseMode.current === 'moveStart') {
      if (grid[row][col].type !== 'wall' && grid[row][col].type !== 'finish') {
        const newGrid = [...grid];
        newGrid[startNode.row][startNode.col].type = 'empty'; // Old start
        newGrid[row][col].type = 'start'; // New start
        setStartNode({ row, col });
        setGrid(newGrid);
        if (isFinished) runAlgorithmInstant(row, col, finishNode.row, finishNode.col);
      }
    } else if (mouseMode.current === 'moveFinish') {
      if (grid[row][col].type !== 'wall' && grid[row][col].type !== 'start') {
        const newGrid = [...grid];
        newGrid[finishNode.row][finishNode.col].type = 'empty';
        newGrid[row][col].type = 'finish';
        setFinishNode({ row, col });
        setGrid(newGrid);
        if (isFinished) runAlgorithmInstant(startNode.row, startNode.col, row, col);
      }
    } else if (mouseMode.current === 'wall') {
      toggleWall(row, col);
    }
  };

  const handleMouseUp = () => {
    isMousePressed.current = false;
    mouseMode.current = 'idle';
  };

  const toggleWall = (row: number, col: number) => {
    // Bounds check
    if (row < 0 || row >= dimensions.rows || col < 0 || col >= dimensions.cols) return;
    if (grid[row][col].type === 'start' || grid[row][col].type === 'finish') return;
    
    const newGrid = [...grid];
    const node = newGrid[row][col];
    const newType = node.type === 'wall' ? 'empty' : 'wall';
    node.type = newType;
    setGrid(newGrid);
    play('click');
  };

  // --- ALGORITHMS ---

  const getNeighbors = (node: GridCell, grid: GridCell[][]) => {
    const neighbors: GridCell[] = [];
    const { row, col } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < dimensions.rows - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < dimensions.cols - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited && neighbor.type !== 'wall');
  };

  const manhattanDistance = (nodeA: GridCell, nodeB: GridCell) => {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
  };

  const runAlgorithm = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    // Clear previous path
    const newGrid: GridCell[][] = grid.map(row => row.map(node => ({
      ...node,
      isVisited: false,
      previousNode: null,
      distance: Infinity,
      type: (node.type === 'visited' || node.type === 'path' || node.type === 'frontier') ? 'empty' : node.type
    })));
    setGrid(newGrid);

    const visitedNodesInOrder: GridCell[] = [];
    const start = newGrid[startNode.row][startNode.col];
    const finish = newGrid[finishNode.row][finishNode.col];

    // Select Algorithm Logic
    if (algorithm === 'dijkstra') {
      start.distance = 0;
      const unvisitedNodes = getAllNodes(newGrid);
      
      while (!!unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        if (!closestNode || closestNode.distance === Infinity) break; 
        
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        if (closestNode === finish) break; 

        const neighbors = getNeighbors(closestNode, newGrid);
        for (const neighbor of neighbors) {
          neighbor.distance = closestNode.distance + 1;
          neighbor.previousNode = closestNode;
        }
      }
    } else if (algorithm === 'astar') {
      start.gScore = 0;
      start.hScore = manhattanDistance(start, finish);
      start.fScore = start.hScore;
      const openSet = [start];

      while (openSet.length > 0) {
        openSet.sort((a, b) => a.fScore - b.fScore);
        const current = openSet.shift()!;
        
        if (current.isVisited) continue;
        current.isVisited = true;
        visitedNodesInOrder.push(current);

        if (current === finish) break;

        const neighbors = getNeighbors(current, newGrid);
        for (const neighbor of neighbors) {
          const tentativeG = current.gScore + 1;
          if (tentativeG < neighbor.gScore) {
            neighbor.previousNode = current;
            neighbor.gScore = tentativeG;
            neighbor.hScore = manhattanDistance(neighbor, finish);
            neighbor.fScore = neighbor.gScore + neighbor.hScore;
            if (!openSet.includes(neighbor)) openSet.push(neighbor);
          }
        }
      }
    } else if (algorithm === 'bfs') {
      const queue = [start];
      start.isVisited = true;
      
      while (queue.length) {
        const current = queue.shift()!;
        visitedNodesInOrder.push(current);
        if (current === finish) break;

        const neighbors = getNeighbors(current, newGrid);
        for (const neighbor of neighbors) {
          neighbor.isVisited = true;
          neighbor.previousNode = current;
          queue.push(neighbor);
        }
      }
    } else if (algorithm === 'dfs') {
      const stack = [start];
      while (stack.length) {
        const current = stack.pop()!;
        if (current.isVisited) continue;
        current.isVisited = true;
        visitedNodesInOrder.push(current);
        if (current === finish) break;

        const neighbors = getNeighbors(current, newGrid);
        for (const neighbor of neighbors) {
          neighbor.previousNode = current;
          stack.push(neighbor);
        }
      }
    }

    // Animation Loop
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animatePath(finish);
        }, speed * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (node.type !== 'start' && node.type !== 'finish') {
          updateNodeState(node.row, node.col, 'visited');
        }
      }, speed * i);
    }
  };

  const animatePath = (finishNode: GridCell) => {
    const nodesInShortestPathOrder = [];
    let currentNode: GridCell | null = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }

    setStats({ visited: 0, length: nodesInShortestPathOrder.length }); 

    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (node.type !== 'start' && node.type !== 'finish') {
          updateNodeState(node.row, node.col, 'path');
        }
        if (i === nodesInShortestPathOrder.length - 1) {
          setIsRunning(false);
          setIsFinished(true);
          play('success');
        }
      }, 50 * i);
    }
  };

  const updateNodeState = (row: number, col: number, type: CellType) => {
    setGrid(prev => {
      const newGrid = [...prev];
      if (newGrid[row]) {
        newGrid[row] = [...newGrid[row]];
        if (newGrid[row][col]) {
          newGrid[row][col] = { ...newGrid[row][col], type };
        }
      }
      return newGrid;
    });
  };

  const runAlgorithmInstant = (sR: number, sC: number, fR: number, fC: number) => {
    // Simplified sync update logic would go here if needed for drag preview
  };

  const getAllNodes = (grid: GridCell[][]) => {
    const nodes = [];
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    return nodes;
  };

  const sortNodesByDistance = (unvisitedNodes: GridCell[]) => {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  };

  const generateMaze = () => {
    resetGrid(true);
    const newGrid = grid.map(row => row.map(node => ({...node})));
    for(let r=0; r<dimensions.rows; r++) {
      for(let c=0; c<dimensions.cols; c++) {
        if (Math.random() < 0.3 && !(r === startNode.row && c === startNode.col) && !(r === finishNode.row && c === finishNode.col)) {
          newGrid[r][c].type = 'wall';
        }
      }
    }
    setGrid(newGrid);
  };

  return {
    grid,
    dimensions, // Export dims
    isRunning,
    isFinished,
    stats,
    algorithm,
    speed,
    setAlgorithm,
    setSpeed,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    runAlgorithm,
    resetGrid,
    generateMaze
  };
};