import React from 'react';
import { ArrowLeft, Navigation } from 'lucide-react';
import { usePathfinding } from './hooks/usePathfinding';
import { GridBoard } from './components/GridBoard';
import { ControlPanel } from './components/ControlPanel';
import { Sidebar } from './components/Sidebar';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
import { ChatPanel } from '../ai-tutor/ChatPanel';
import { MobileLandscapeAlert } from '../../shared/components/MobileLandscapeAlert';

interface PathfindingVisualizerProps {
  onBack: () => void;
}

export const PathfindingVisualizer: React.FC<PathfindingVisualizerProps> = ({ onBack }) => {
  const { 
    grid,
    isRunning,
    algorithm,
    speed,
    setAlgorithm,
    setSpeed,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    runAlgorithm,
    resetGrid,
    generateMaze
  } = usePathfinding();

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
                <Navigation className="w-6 h-6 text-primary-400" />
                <h1 className="text-xl sm:text-2xl font-bold">Pathfinding</h1>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-gray-900 relative h-full">
            
            {/* Sidebar Controls */}
            <div className="w-full lg:w-80 p-4 border-r border-gray-800 bg-gray-900 shrink-0 overflow-y-auto">
              <ControlPanel 
                algorithm={algorithm}
                setAlgorithm={setAlgorithm}
                isRunning={isRunning}
                onVisualize={runAlgorithm}
                onReset={() => resetGrid(false)}
                onClearWalls={() => resetGrid(true)}
                onGenerateMaze={generateMaze}
                speed={speed}
                setSpeed={setSpeed}
              />
              <div className="mt-4 text-xs text-gray-500 text-center">
                Click & Drag to draw walls. Move Start/End nodes.
              </div>
            </div>

            {/* Grid Canvas */}
            <div className="flex-1 p-4 bg-gray-950/50 overflow-hidden relative flex items-center justify-center">
              <GridBoard 
                grid={grid}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onMouseUp={handleMouseUp}
              />
            </div>

          </div>
        </main>

        <Sidebar />

        <ChatPanel 
          context={`Pathfinding Algorithm: ${algorithm.toUpperCase()}. Grid navigation. Dijkstra (Weighted, Shortest), A* (Heuristic, Shortest), BFS (Unweighted Shortest), DFS (Not Shortest).`}
          onHighlightNode={() => {}} 
        />
      </div>
    </div>
  );
};