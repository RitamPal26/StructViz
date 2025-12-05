export interface LinkedListNode {
  id: string;
  value: number;
  nextId: string | null;
}

export interface ListState {
  nodes: LinkedListNode[];
  headId: string | null;
}

export interface AnimationStep {
  state: ListState;
  highlightedIds: string[];
  pointers: { [key: string]: string | null }; // e.g. { 'current': 'node-1', 'prev': null }
  message: string;
  codeSnippet?: string;
}

export type PlaybackSpeed = 0.5 | 1 | 2;
