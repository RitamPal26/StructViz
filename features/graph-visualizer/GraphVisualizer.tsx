import React from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useGraph } from './hooks/useGraph';
import { GraphNode } from './components/GraphNode';
import { GraphEdge } from './components/GraphEdge';
import { GraphSidebar } from './components/GraphSidebar';
import { AlgorithmPanel } from './components/AlgorithmPanel';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
import { ChatPanel } from '../ai-tutor/ChatPanel';
import { AlgorithmType } from './types';
import { MobileLandscapeAlert } from '../../shared/components/MobileLandscapeAlert';

interface GraphVisualizerProps {
  onBack: () => void;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ onBack }) => {
  const { 
    nodes, 
    edges, 
    selectedNodeId, 
    isPlaying,
    currentStep,
    handlers,
    runAlgorithm,
    reset,
    loadPreset,
    stop,
    stepForward,
    stepBackward,
    speed,
    setSpeed
  } = useGraph();

  const handleAlgorithmStart = (type: AlgorithmType) => {
    const startNode = selectedNodeId || nodes[0]?.id;
    if (startNode) {
      runAlgorithm(type, startNode);
    } else {
      alert("Please select a start node first!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col overflow-hidden">
      <Header />
      <MobileLandscapeAlert />
      
      {/* Layout */}
      <div className="flex-1 flex flex-col lg:flex-row pt-16 lg:h-screen lg:overflow-hidden">
        
        {/* Main Canvas Area */}
        <main className="flex-1 flex flex-col relative min-h-[calc(100vh-4rem)] lg:min-h-0 lg:h-auto">
          
          {/* Canvas Toolbar */}
          <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap gap-2 pointer-events-none">
            <div className="pointer-events-auto">
                <Button variant="outline" size="sm" onClick={onBack} className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-gray-900/80 backdrop-blur">
                <ArrowLeft className="w-5 h-5" />
                </Button>
            </div>
            
            <div className="pointer-events-auto bg-gray-900/80 backdrop-blur border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-300 shadow-lg flex-1 min-w-[200px]">
              {isPlaying ? (
                <span className="text-yellow-400 font-bold">Animation Running...</span>
              ) : selectedNodeId ? (
                <div className="flex items-center justify-between">
                  <span>Node Selected</span>
                  <button 
                    onClick={() => handlers.removeNode(selectedNodeId)}
                    className="ml-2 text-red-400 hover:text-red-300 flex items-center bg-red-900/20 px-2 py-1 rounded"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </button>
                </div>
              ) : (
                <>
                  <span className="font-bold text-primary-400">Edit Mode:</span> Tap to Add • Tap 2 Nodes to Connect • Drag
                </>
              )}
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="flex-1 bg-gray-950 overflow-auto cursor-crosshair relative min-h-[400px]">
             {/* Grid Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ 
                   backgroundImage: 'linear-gradient(#374151 1px, transparent 1px), linear-gradient(90deg, #374151 1px, transparent 1px)', 
                   backgroundSize: '40px 40px',
                   minWidth: '100%',
                   minHeight: '100%'
                 }} 
            />

            <svg 
              className="w-full h-full min-w-[600px] min-h-[600px] touch-none"
              onMouseDown={handlers.handleCanvasMouseDown}
              onMouseMove={handlers.handleCanvasMouseMove}
              onMouseUp={handlers.handleCanvasMouseUp}
              onClick={handlers.handleCanvasClick}
              onTouchStart={handlers.handleCanvasTouchStart}
              onTouchMove={handlers.handleCanvasTouchMove}
              onTouchEnd={handlers.handleCanvasTouchEnd}
            >
              {edges.map(edge => {
                const source = nodes.find(n => n.id === edge.source);
                const target = nodes.find(n => n.id === edge.target);
                if (!source || !target) return null;
                return (
                  <GraphEdge 
                    key={edge.id} 
                    edge={edge} 
                    source={source} 
                    target={target} 
                  />
                );
              })}

              {nodes.map(node => (
                <GraphNode
                  key={node.id}
                  node={node}
                  isSelected={node.id === selectedNodeId}
                  onMouseDown={(e) => handlers.handleNodeMouseDown(node.id, e)}
                  onClick={(e) => handlers.handleNodeClick(node.id, e)}
                  onRightClick={(e) => {
                    e.preventDefault();
                    handlers.removeNode(node.id);
                  }}
                  onTouchStart={(e) => handlers.handleNodeTouchStart(node.id, e)}
                />
              ))}
            </svg>
          </div>

          {/* Data Structure Panel */}
          <div className="absolute bottom-6 right-6 w-64 h-64 bg-gray-900/90 backdrop-blur border border-gray-700 rounded-xl shadow-2xl p-4 overflow-hidden z-20 hidden md:block">
             <AlgorithmPanel step={currentStep} />
          </div>

        </main>

        <GraphSidebar 
          onAlgorithm={handleAlgorithmStart}
          onReset={reset}
          onPreset={loadPreset}
          isPlaying={isPlaying}
          onPlayPause={() => isPlaying ? stop() : stepForward()}
          onStepForward={stepForward}
          onStepBackward={stepBackward}
          speed={speed}
          onSpeedChange={setSpeed}
          message={currentStep?.message}
        />

        <ChatPanel 
          context="Graph Data Structure. A set of nodes (vertices) and edges. Algorithms: BFS (Breadth-First Search uses Queue), DFS (Depth-First Search uses Stack), Dijkstra (Finds shortest path uses Priority Queue)."
        />
      </div>
    </div>
  );
};