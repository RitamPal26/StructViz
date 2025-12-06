export interface AVLNode {
  id: string;
  value: number;
  height: number;
  left: AVLNode | null;
  right: AVLNode | null;
  // Visual props (calculated during layout)
  x: number;
  y: number;
}

export type NodeState = 'default' | 'inserted' | 'checking' | 'imbalanced' | 'rotating-pivot' | 'rotating-child' | 'balanced';

export interface VisualAVLNode extends AVLNode {
  balanceFactor: number;
  state: NodeState;
}

export interface VisualEdge {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  state: 'default' | 'active';
}

export type AVLOperation = 'idle' | 'inserting' | 'deleting' | 'balancing' | 'comparing';

export interface ComparisonStats {
  avlHeight: number;
  bstHeight: number;
  avlRotations: number;
}