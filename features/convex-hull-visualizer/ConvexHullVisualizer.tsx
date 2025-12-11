import React, { useEffect } from 'react';
import { ArrowLeft, Hexagon } from 'lucide-react';
import { useConvexHull } from './hooks/useConvexHull';
import { HullCanvas } from './components/HullCanvas';
import { ControlPanel } from './components/ControlPanel';
import { Sidebar } from './components/Sidebar';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
import { ChatPanel } from '../ai-tutor/ChatPanel';
import { MobileLandscapeAlert } from '../../shared/components/MobileLandscapeAlert';

interface ConvexHullVisualizerProps {
  onBack: () => void;
}

export const ConvexHullVisualizer: React.FC<ConvexHullVisualizerProps> = ({ onBack }) => {
  const { 
    points, 
    hull, 
    candidateLine, 
    activePoint,
    algorithm,
    setAlgorithm,
    generatePoints,
    clearPoints,
    addPoint,
    runAlgorithm,
    isRunning,
    message,
    speed,
    setSpeed
  } = useConvexHull();

  useEffect(() => {
    generatePoints(15);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      <MobileLandscapeAlert />
      
      <div className="flex-1 flex flex-col lg:flex-row pt-16 lg:h-screen lg:overflow-hidden">
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col relative min-h-[calc(100vh-4rem)] lg:min-h-0 lg:h-auto overflow-y-auto lg:overflow-hidden">
          
          {/* Top Bar */}
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800 bg-gray-900/50 backdrop-blur gap-4 shrink-0 z-10">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={onBack} className="rounded-full w-10 h-10 p-0 flex items-center justify-center shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <Hexagon className="w-6 h-6 text-primary-400" />
                <h1 className="text-xl sm:text-2xl font-bold">Convex Hull</h1>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-gray-900 relative h-full">
            
            {/* Sidebar Controls */}
            <div className="w-full lg:w-80 p-4 border-r border-gray-800 bg-gray-900 shrink-0 overflow-y-auto order-2 lg:order-1">
              <ControlPanel 
                onGenerate={() => generatePoints(20)}
                onClear={clearPoints}
                onRun={runAlgorithm}
                algorithm={algorithm}
                setAlgorithm={setAlgorithm}
                isRunning={isRunning}
                message={message}
                speed={speed}
                setSpeed={setSpeed}
              />
            </div>

            {/* Canvas */}
            <div className="flex-1 p-4 bg-gray-950/50 overflow-hidden relative flex items-center justify-center order-1 lg:order-2">
              <HullCanvas 
                points={points}
                hull={hull}
                candidateLine={candidateLine}
                activePoint={activePoint}
                onCanvasClick={addPoint}
              />
            </div>

          </div>
        </main>

        <Sidebar />

        <ChatPanel 
          context={`Convex Hull Algorithm: ${algorithm === 'graham' ? 'Graham Scan (Sort by angle, simple pass)' : algorithm === 'jarvis' ? 'Jarvis March (Gift wrapping)' : 'Monotone Chain'}. Points: ${points.length}.`}
          onHighlightNode={() => {}} 
        />
      </div>
    </div>
  );
};