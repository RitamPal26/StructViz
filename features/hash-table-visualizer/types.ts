export type CollisionMethod = 'chaining' | 'linearProbing';

export interface HashItem {
  id: string;
  key: string;
  value: string;
}

export interface Bucket {
  index: number;
  items: HashItem[];
  state: 'default' | 'active' | 'collision' | 'found';
}

export type Operation = 'idle' | 'inserting' | 'searching' | 'deleting' | 'rehashing';
