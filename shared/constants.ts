import { Network, Link2, Layers, ListEnd, Share2, Hash, Triangle, Zap, Brain, Globe, Briefcase, Code2, Cpu, BarChart } from 'lucide-react';
import { DataStructure, NavItem } from './types';

export const ANIMATION_CONFIG = {
  duration: {
    fast: 0.15,
    medium: 0.5,
    slow: 0.8
  },
  easing: {
    spring: { type: 'spring', stiffness: 260, damping: 20 },
    easeInOut: [0.4, 0, 0.2, 1]
  }
};

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
    id: 'hash-table',
    title: 'Hash Table',
    description: 'Learn how key-value pairs are stored and retrieved efficiently using hash functions.',
    icon: Hash
  },
  {
    id: 'heap',
    title: 'Min/Max Heap',
    description: 'Visualize priority queues and heap sort using complete binary trees.',
    icon: Triangle
  },
  {
    id: 'graph',
    title: 'Graph Algorithms',
    description: 'Navigate complex networks using BFS, DFS, and Dijkstra pathfinding algorithms.',
    icon: Share2
  }
];

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', view: 'landing' },
  { label: 'About', view: 'about' },
];

export const FEATURES = [
  {
    icon: Zap,
    title: 'Interactive Visualizations',
    desc: 'Don’t just read code. Watch algorithms execute step-by-step with smooth, high-frame-rate animations.'
  },
  {
    icon: Brain,
    title: 'AI Tutor Mode',
    desc: 'Stuck? Ask our Gemini-powered AI tutor for instant hints, complexity analysis, and code explanations.'
  },
  {
    icon: Globe,
    title: 'Real-World Examples',
    desc: 'Understand how data structures power the software you use daily, from browser history to social networks.'
  },
  {
    icon: Briefcase,
    title: 'Interview Ready',
    desc: 'Master the patterns and fundamental concepts needed to ace technical interviews at top tech companies.'
  }
];

export const TECH_STACK = [
  { name: 'React 18', category: 'Frontend' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'Framer Motion', category: 'Animation' },
  { name: 'Gemini 3 Pro', category: 'AI Model' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'GSAP', category: 'Effects' }
];

export const STATS = [
  { value: '6+', label: 'Data Structures' },
  { value: 'AI', label: 'Real-Time Explanations' },
  { value: '100%', label: 'Free & Open Source' },
];