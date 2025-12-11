import { Network, Link2, Layers, ListEnd, Share2, Hash, Triangle, Zap, Brain, Globe, Briefcase, Code2, Cpu, BarChart, GitMerge, BarChart3, Scale, Grid3x3, Split, Table2, Navigation } from 'lucide-react';
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
    id: 'pathfinding',
    title: 'Pathfinding',
    description: 'Visualize how algorithms like Dijkstra, A*, and BFS find the shortest path between nodes in a grid.',
    icon: Navigation
  },
  {
    id: 'dp',
    title: 'Dynamic Programming',
    description: 'Master optimization problems by visualizing the DP table filling process, recurrence relations, and solution backtracking.',
    icon: Table2
  },
  {
    id: 'segment-tree',
    title: 'Segment Tree',
    description: 'Efficiently query ranges and update values using a hierarchical tree structure with lazy propagation.',
    icon: Split
  },
  {
    id: 'matrix',
    title: 'Matrix Operations',
    description: 'Visualize 2D array algorithms including Spiral Traversal, Rotation, Transpose, and Search in Sorted Matrix.',
    icon: Grid3x3
  },
  {
    id: 'avl-tree',
    title: 'AVL Tree',
    description: 'Master self-balancing binary search trees. Visualize rotations (LL, RR, LR, RL) that keep lookup times optimal.',
    icon: Scale
  },
  {
    id: 'sorting',
    title: 'Sorting Algorithms',
    description: 'Compare classic sorting algorithms like Quick Sort, Merge Sort, and Bubble Sort in real-time races.',
    icon: BarChart3
  },
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
  },
  {
    id: 'trie',
    title: 'Trie (Prefix Tree)',
    description: 'Efficiently store and retrieve keys in a dataset of strings. Essential for autocomplete systems.',
    icon: GitMerge
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