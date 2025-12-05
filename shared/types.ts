import { LucideIcon } from 'lucide-react';

export type ViewType = 'landing' | 'binary-tree' | 'linked-list' | 'stack' | 'queue' | 'graph';

export interface DataStructure {
  id: ViewType;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface NavItem {
  label: string;
  href: string;
}
