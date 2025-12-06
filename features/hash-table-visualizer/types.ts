export type CollisionMethod = 'chaining' | 'linearProbing';

export interface HashItem {
  id: string;
  key: string;
  value: string;
}

export interface Bucket {
  index: number;
  items: HashItem[];
  // Visual states for the bucket during animation
  state: 'default' | 'active' | 'collision' | 'found' | 'probing';
  highlight?: boolean;
}

export interface HashState {
  buckets: Bucket[];
  itemsCount: number;
  tableSize: number;
}

export interface HashStep {
  state: HashState;
  activeBucketIndex: number | null; // The bucket currently being processed
  collisionIndex: number | null;    // Bucket where collision occurred
  message: string;
  codeSnippet?: string; // Optional context for what's happening
}

export type Operation = 'idle' | 'inserting' | 'searching' | 'deleting' | 'rehashing';
