export interface TrieNode {
  id: string;
  char: string;
  children: { [key: string]: TrieNode };
  isEndOfWord: boolean;
  x: number;
  y: number;
}

export interface VisualTrieNode {
  id: string;
  char: string;
  x: number;
  y: number;
  isEndOfWord: boolean;
  state: 'default' | 'active' | 'found' | 'visiting' | 'matching';
}

export interface VisualTrieEdge {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  char: string;
  state: 'default' | 'active';
}

export type TrieOperation = 'idle' | 'inserting' | 'searching' | 'deleting' | 'autocomplete';