import { LucideIcon } from 'lucide-react';

export interface DataStructure {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface NavItem {
  label: string;
  href: string;
}
