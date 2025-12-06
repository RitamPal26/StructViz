export interface MatrixCell {
  id: string;
  row: number;
  col: number;
  value: number;
  state: 'default' | 'active' | 'visited' | 'target' | 'zero' | 'found';
  visitOrder?: number;
}

export type MatrixOperation = 
  | 'idle' 
  | 'spiral' 
  | 'rotate' 
  | 'search' 
  | 'set-zeroes' 
  | 'transpose'
  | 'wave';

export interface MatrixStep {
  grid: MatrixCell[][];
  activeCell?: { r: number, c: number };
  message: string;
}

export type GenerationMode = 'random' | 'sorted' | 'zeroes';