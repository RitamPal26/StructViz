import React, { useState } from 'react';
import { LandingPage } from './features/landing/LandingPage';
import { TreeVisualizer } from './features/tree-visualizer/TreeVisualizer';
import { ViewType } from './shared/types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('landing');

  const renderView = () => {
    switch (currentView) {
      case 'binary-tree':
        return <TreeVisualizer onBack={() => setCurrentView('landing')} />;
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
