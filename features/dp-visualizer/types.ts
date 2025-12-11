export type DPProblemType = 'fibonacci' | 'lcs' | 'knapsack' | 'edit_distance';

export interface CellState {
  value: number | string | null;
  status: 'empty' | 'computing' | 'filled' | 'path'; // path = optimal solution
  dependencies: { r: number, c: number }[]; // Coordinates of cells used to compute this one
}

export interface DPState {
  grid: CellState[][];
  rows: number;
  cols: number;
  rowLabels: string[];
  colLabels: string[];
  activeCell: { r: number, c: number } | null;
  message: string;
  result: string | null;
}

export interface DPAlgorithm {
  id: DPProblemType;
  name: string;
  description: string;
  recurrence: string;
  timeComplexity: string;
  spaceComplexity: string;
  defaultInputs: Record<string, any>;
}

export interface PlaybackState {
  isPlaying: boolean;
  speed: number;
}