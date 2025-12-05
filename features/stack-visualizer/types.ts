export interface StackItem {
  id: string;
  value: string | number;
  type: 'default' | 'url' | 'code' | 'paren';
  color?: string;
}

export type StackOperation = 'idle' | 'pushing' | 'popping' | 'peeking' | 'overflow' | 'clearing' | 'success';

export interface Scenario {
  name: string;
  run: () => Promise<void>;
}
