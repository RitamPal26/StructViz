import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, RotateCw } from 'lucide-react';
import { useLinkedListAnimation } from './hooks/useLinkedListAnimation';
import { ListNode } from './components/ListNode';
import { PlaybackControls } from './components/PlaybackControls';
import { Sidebar } from './components/Sidebar';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
import { LinkedListNode } from './types';

interface LinkedListVisualizerProps {
  onBack: () => void;
}

export const LinkedListVisualizer: React.FC<LinkedListVisualizerProps> = ({ onBack }) => {
  const { 
    currentStep,
    totalSteps,
    currentStepIndex,
    isPlaying,
    play,
    pause,
    stepForward,
    stepBackward,
    speed,
    setSpeed,
    actions
  } = useLinkedListAnimation();

  // Helper to order nodes for display based on pointer structure
  const getOrderedNodes = (nodes: LinkedListNode[], headId: string | null): LinkedListNode[] => {
    if (!headId) return [];
    const ordered: LinkedListNode[] = [];
    let currId: string | null = headId;
    const visited = new Set<string>();

    while (currId && !visited.has(currId)) {
      const node = nodes.find(n => n.id === currId);
      if (node) {
        ordered.push(node);
        visited.add(currId);
        currId = node.nextId;
      } else {
        break;
      }
    }
    return ordered;
  };

  const displayNodes = getOrderedNodes(currentStep.state.nodes, currentStep.state.headId);
  const isBusy = isPlaying; // Could also check totalSteps > 0 && index < max

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      
      {/* Layout Fix */}
      <div className="flex-1 flex flex-col lg:flex-row pt-16 lg:h-screen lg:overflow-hidden">
        
        {/* Main Canvas Area */}
        <main className="flex-1 flex flex-col relative min-h-[calc(100vh-4rem)] lg:min-h-0 lg:h-auto overflow-y-auto lg:overflow-hidden">
          
          {/* Top Bar */}
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800 bg-gray-900/50 backdrop-blur gap-4 shrink-0">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={onBack} className="rounded-full w-10 h-10 p-0 flex items-center justify-center shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl sm:text-2xl font-bold truncate">Linked List Operations</h1>
            </div>
            
            {/* Operation Buttons */}
            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:space-x-2">
              <Button 
                size="sm" 
                onClick={() => actions.insertHead(Math.floor(Math.random() * 99))}
                disabled={isBusy}
                className="w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Head
              </Button>
              <Button 
                size="sm" 
                variant="secondary"
                onClick={() => actions.insertTail(Math.floor(Math.random() * 99))}
                disabled={isBusy}
                className="w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Tail
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => actions.deleteNode(displayNodes[0]?.value || 0)} // Simple demo delete first
                disabled={isBusy || displayNodes.length === 0}
                className="w-full sm:w-auto"
              >
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="text-indigo-400 border-indigo-900/50 hover:bg-indigo-900/20 w-full sm:w-auto"
                onClick={actions.reverse}
                disabled={isBusy || displayNodes.length < 2}
              >
                <RotateCw className="w-4 h-4 mr-1" /> Reverse
              </Button>
            </div>
          </div>

          {/* Visualization Canvas */}
          <div className="flex-1 bg-gray-900 relative overflow-hidden flex flex-col min-h-[300px]">
            {/* Scrollable container for nodes */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden flex items-center px-4 sm:px-12">
               {/* Step Message (absolute relative to canvas) */}
              <div className="absolute top-4 left-0 right-0 text-center pointer-events-none z-10 px-4">
                <motion.div
                  key={currentStep.message}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-block px-4 py-2 bg-gray-800/80 backdrop-blur rounded-full border border-gray-700 text-sm font-mono text-primary-300 shadow-xl break-words max-w-full"
                >
                  {currentStep.message}
                </motion.div>
              </div>

              <div className="flex items-center space-x-0 min-w-max mx-auto">
                <AnimatePresence mode='popLayout'>
                  {displayNodes.map((node, index) => {
                    // Find if any pointers point to this node
                    const activePointers = Object.entries(currentStep.pointers)
                      .filter(([_, nodeId]) => nodeId === node.id)
                      .map(([label]) => label);

                    return (
                      <motion.div
                        key={node.id}
                        layout
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <ListNode 
                          value={node.value}
                          highlight={currentStep.highlightedIds.includes(node.id)}
                          pointers={activePointers}
                          isTail={index === displayNodes.length - 1}
                        />
                      </motion.div>
                    );
                  })}
                  
                  {displayNodes.length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className="text-gray-600 font-mono text-sm border-2 border-dashed border-gray-800 rounded-xl p-8"
                    >
                      List is empty
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="shrink-0">
            <PlaybackControls 
              isPlaying={isPlaying}
              onPlay={play}
              onPause={pause}
              onStepForward={stepForward}
              onStepBackward={stepBackward}
              currentStep={currentStepIndex}
              totalSteps={totalSteps}
              speed={speed}
              onSpeedChange={setSpeed}
            />
          </div>
        </main>

        <Sidebar />
      </div>
    </div>
  );
};
