import { LucideIcon } from 'lucide-react';

export type ViewType = 'landing' | 'about' | 'binary-tree' | 'linked-list' | 'stack' | 'queue' | 'graph' | 'hash-table' | 'heap' | 'trie' | 'sorting';

export interface DataStructure {
  id: ViewType;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface NavItem {
  label: string;
  view: ViewType;
}