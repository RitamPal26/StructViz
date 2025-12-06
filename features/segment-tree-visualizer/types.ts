export type NodeState = 'default' | 'active' | 'visited' | 'accepted' | 'rejected' | 'lazy';

export interface SegmentNode {
  index: number;      // 1-based index in the heap array
  value: number;      // Aggregated value (Sum, Min, etc.)
  range: [number, number]; // [L, R] inclusive
  lazy: number;       // Pending update value
  x: number;          // Visual X coordinate
  y: number;          // Visual Y coordinate
  state: NodeState;
}

export interface SegmentEdge {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export type QueryType = 'sum' | 'min' | 'max';

export type Operation = 'idle' | 'building' | 'querying' | 'updating';