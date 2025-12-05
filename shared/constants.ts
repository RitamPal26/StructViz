import { Network, Link2, Layers, ListEnd, Share2 } from 'lucide-react';
import { DataStructure } from './types';

export const DATA_STRUCTURES: DataStructure[] = [
  {
    id: 'binary-tree',
    title: 'Binary Tree',
    description: 'Explore hierarchical data structures where each node has at most two children.',
    icon: Network
  },
  {
    id: 'linked-list',
    title: 'Linked List',
    description: 'Visualize linear collections of data elements whose order is not given by their physical placement in memory.',
    icon: Link2
  },
  {
    id: 'stack',
    title: 'Stack',
    description: 'Understand the LIFO (Last In, First Out) principle with push and pop operations.',
    icon: Layers
  },
  {
    id: 'queue',
    title: 'Queue',
    description: 'Master the FIFO (First In, First Out) principle for scheduling and buffering.',
    icon: ListEnd
  },
  {
    id: 'graph',
    title: 'Graph Algorithms',
    description: 'Navigate complex networks using BFS, DFS, and Dijkstra pathfinding algorithms.',
    icon: Share2
  }
];

export const NAV_ITEMS = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#about' },
  { label: 'Resources', href: '#resources' },
];
