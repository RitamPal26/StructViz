import React, { useState, Suspense, lazy } from 'react';
import { ViewType } from './shared/types';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { Loader2 } from 'lucide-react';
import { SoundProvider } from './shared/context/SoundContext';
import { PageTransition } from './shared/components/PageTransition';
import { AnimatePresence } from 'framer-motion';

// Lazy load pages and visualizers
const LandingPage = lazy(() => import('./features/landing/LandingPage'));
const AboutPage = lazy(() => import('./features/about/AboutPage'));

const TreeVisualizer = lazy(() => import('./features/tree-visualizer/TreeVisualizer').then(module => ({ default: module.TreeVisualizer })));
const LinkedListVisualizer = lazy(() => import('./features/linked-list/LinkedListVisualizer').then(module => ({ default: module.LinkedListVisualizer })));
const StackVisualizer = lazy(() => import('./features/stack-visualizer/StackVisualizer').then(module => ({ default: module.StackVisualizer })));
const QueueVisualizer = lazy(() => import('./features/queue-visualizer/QueueVisualizer').then(module => ({ default: module.QueueVisualizer })));
const GraphVisualizer = lazy(() => import('./features/graph-visualizer/GraphVisualizer').then(module => ({ default: module.GraphVisualizer })));
const HashTableVisualizer = lazy(() => import('./features/hash-table-visualizer/HashTableVisualizer').then(module => ({ default: module.HashTableVisualizer })));
const HeapVisualizer = lazy(() => import('./features/heap-visualizer/HeapVisualizer').then(module => ({ default: module.HeapVisualizer })));
const TrieVisualizer = lazy(() => import('./features/trie-visualizer/TrieVisualizer').then(module => ({ default: module.TrieVisualizer })));
const SortingVisualizer = lazy(() => import('./features/sorting-visualizer/SortingVisualizer').then(module => ({ default: module.SortingVisualizer })));
const AVLVisualizer = lazy(() => import('./features/avl-tree-visualizer/AVLVisualizer').then(module => ({ default: module.AVLVisualizer })));
const MatrixVisualizer = lazy(() => import('./features/matrix-visualizer/MatrixVisualizer').then(module => ({ default: module.MatrixVisualizer })));
const SegmentTreeVisualizer = lazy(() => import('./features/segment-tree-visualizer/SegmentTreeVisualizer').then(module => ({ default: module.SegmentTreeVisualizer })));
const DPVisualizer = lazy(() => import('./features/dp-visualizer/DPVisualizer').then(module => ({ default: module.DPVisualizer })));
const PathfindingVisualizer = lazy(() => import('./features/pathfinding-visualizer/PathfindingVisualizer').then(module => ({ default: module.PathfindingVisualizer })));

const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      <span className="text-gray-400 font-medium">Loading...</span>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('landing');

  const renderView = () => {
    switch (currentView) {
      case 'about':
        return <AboutPage onNavigate={setCurrentView} />;
      case 'binary-tree':
        return <TreeVisualizer onBack={() => setCurrentView('landing')} />;
      case 'linked-list':
        return <LinkedListVisualizer onBack={() => setCurrentView('landing')} />;
      case 'stack':
        return <StackVisualizer onBack={() => setCurrentView('landing')} />;
      case 'queue':
        return <QueueVisualizer onBack={() => setCurrentView('landing')} />;
      case 'graph':
        return <GraphVisualizer onBack={() => setCurrentView('landing')} />;
      case 'hash-table':
        return <HashTableVisualizer onBack={() => setCurrentView('landing')} />;
      case 'heap':
        return <HeapVisualizer onBack={() => setCurrentView('landing')} />;
      case 'trie':
        return <TrieVisualizer onBack={() => setCurrentView('landing')} />;
      case 'sorting':
        return <SortingVisualizer onBack={() => setCurrentView('landing')} />;
      case 'avl-tree':
        return <AVLVisualizer onBack={() => setCurrentView('landing')} />;
      case 'matrix':
        return <MatrixVisualizer onBack={() => setCurrentView('landing')} />;
      case 'segment-tree':
        return <SegmentTreeVisualizer onBack={() => setCurrentView('landing')} />;
      case 'dp':
        return <DPVisualizer onBack={() => setCurrentView('landing')} />;
      case 'pathfinding':
        return <PathfindingVisualizer onBack={() => setCurrentView('landing')} />;
      case 'landing':
      default:
        return <LandingPage onNavigate={setCurrentView} />;
    }
  };

  return (
    <ErrorBoundary>
      <SoundProvider>
        <Suspense fallback={<LoadingFallback />}>
          <AnimatePresence mode="wait">
            <PageTransition key={currentView}>
              {renderView()}
            </PageTransition>
          </AnimatePresence>
        </Suspense>
      </SoundProvider>
    </ErrorBoundary>
  );
};

export default App;