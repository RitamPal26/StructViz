export interface Point {
  id: string;
  x: number;
  y: number;
  isHull?: boolean;
  state?: 'default' | 'active' | 'considered' | 'discarded';
}

export type HullAlgorithm = 'graham' | 'jarvis' | 'monotone';

export interface HullStep {
  hull: Point[];
  candidateLine?: { p1: Point; p2: Point };
  consideredPoint?: Point;
  message: string;
}

export interface HullState {
  points: Point[];
  hull: Point[];
  lines: { p1: Point; p2: Point; color?: string }[];
  activePointId: string | null;
  message: string;
}