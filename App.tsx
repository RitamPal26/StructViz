import React, { useState, Suspense, lazy } from 'react';
import { LandingPage } from './features/landing/LandingPage';
import { ViewType } from './shared/types';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { Loader2 } from 'lucide-react';
import { SoundProvider } from './shared/context/SoundContext';
import { PageTransition } from './shared/components/PageTransition';
import { AnimatePresence } from 'framer-motion';

// Lazy load visualizers
const TreeVisualizer = lazy(() => import('./features/tree-visualizer/TreeVisualizer').then(module => ({ default: module.TreeVisualizer })));
const LinkedListVisualizer = lazy(() => import('./features/linked-list/LinkedListVisualizer').then(module => ({ default: module.LinkedListVisualizer })));
const StackVisualizer = lazy(() => import('./features/stack-visualizer/StackVisualizer').then(module => ({ default: module.StackVisualizer })));
const QueueVisualizer = lazy(() => import('./features/queue-visualizer/QueueVisualizer').then(module => ({ default: module.QueueVisualizer })));
const GraphVisualizer = lazy(() => import('./features/graph-visualizer/GraphVisualizer').then(module => ({ default: module.GraphVisualizer })));
const HashTableVisualizer = lazy(() => import('./features/hash-table-visualizer/HashTableVisualizer').then(module => ({ default: module.HashTableVisualizer })));
const HeapVisualizer = lazy(() => import('./features/heap-visualizer/HeapVisualizer').then(module => ({ default: module.HeapVisualizer })));

const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      <span className="text-gray-400 font-medium">Loading Visualizer...</span>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('landing');

  const renderView = () => {
    switch (currentView) {
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
