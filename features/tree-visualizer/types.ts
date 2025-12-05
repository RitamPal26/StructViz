export interface TreeNode {
  id: string;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x: number;
  y: number;
}

export interface VisualNode {
  id: string;
  value: number;
  x: number;
  y: number;
  state: 'default' | 'highlighted' | 'found' | 'modifying';
}

export interface VisualEdge {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export type TreeOperation = 'idle' | 'inserting' | 'deleting' | 'searching';
