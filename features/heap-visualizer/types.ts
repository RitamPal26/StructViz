export type HeapType = 'min' | 'max';

export interface HeapNode {
  id: string;
  value: number;
}

export interface VisualHeapNode extends HeapNode {
  index: number;
  x: number;
  y: number;
  state: 'default' | 'active' | 'comparing' | 'sorted';
}

export type HeapOperation = 'idle' | 'inserting' | 'extracting' | 'building' | 'sorting';
