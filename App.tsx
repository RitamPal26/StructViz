import React, { useState } from 'react';
import { LandingPage } from './features/landing/LandingPage';
import { TreeVisualizer } from './features/tree-visualizer/TreeVisualizer';
import { LinkedListVisualizer } from './features/linked-list/LinkedListVisualizer';
import { StackVisualizer } from './features/stack-visualizer/StackVisualizer';
import { QueueVisualizer } from './features/queue-visualizer/QueueVisualizer';
import { GraphVisualizer } from './features/graph-visualizer/GraphVisualizer';
import { ViewType } from './shared/types';

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
      case 'landing':
      default:
        return <LandingPage onNavigate={setCurrentView} />;
    }
  };

  return (
    <>
      {renderView()}
    </>
  );
};

export default App;
