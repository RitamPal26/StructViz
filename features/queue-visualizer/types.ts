export type QueueMode = 'simple' | 'circular' | 'priority';

export interface QueueItem {
  id: string;
  value: string;
  priority: number; // 1 (High) to 5 (Low)
  type: 'default' | 'job' | 'person' | 'process';
  color?: string;
}

export type QueueOperation = 'idle' | 'enqueueing' | 'dequeueing' | 'peeking' | 'clearing';

export interface Scenario {
  name: string;
  mode: QueueMode;
  run: () => Promise<void>;
}
