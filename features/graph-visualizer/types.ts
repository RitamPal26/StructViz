export type NodeState = 'default' | 'current' | 'visited' | 'queued' | 'path' | 'start' | 'target';
export type EdgeState = 'default' | 'traversed' | 'path';

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  state: NodeState;
  distance?: number; // For Dijkstra
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  state: EdgeState;
}

export interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export type DijkstraTableItem = { id: string; dist: number };
export type StructureState = string[] | DijkstraTableItem[];

export interface AlgorithmStep {
  graphState: GraphState; // Snapshot of nodes/edges states
  structureState: StructureState; // Queue for BFS, Stack for DFS, PriorityQueue for Dijkstra
  structureType: 'queue' | 'stack' | 'table';
  message: string;
  currentEdgeId?: string | null;
}

export type AlgorithmType = 'bfs' | 'dfs' | 'dijkstra';
