export type CellType = 'empty' | 'wall' | 'start' | 'finish' | 'visited' | 'path' | 'frontier';

export interface GridCell {
  row: number;
  col: number;
  type: CellType;
  distance: number;
  isVisited: boolean;
  previousNode: GridCell | null;
  // A* specific
  fScore: number;
  gScore: number;
  hScore: number;
}

export type AlgorithmType = 'dijkstra' | 'astar' | 'bfs' | 'dfs';

export interface GridState {
  grid: GridCell[][];
  startNode: { row: number, col: number };
  finishNode: { row: number, col: number };
  isRunning: boolean;
  isFinished: boolean;
  nodesVisited: number;
  pathLength: number;
}

export type MouseMode = 'wall' | 'moveStart' | 'moveFinish' | 'idle';