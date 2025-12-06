export type AlgorithmType = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick' | 'heap';

export interface SortStep {
  array: number[];
  comparing: number[]; // Indices being compared
  swapping: number[]; // Indices being swapped/overwritten
  sorted: number[]; // Indices confirmed sorted
  pivot?: number; // Index of pivot (for quick sort)
  description: string;
}

export interface AlgorithmInfo {
  id: AlgorithmType;
  name: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  description: string;
}

export type SortMode = 'single' | 'race';