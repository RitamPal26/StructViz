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
      
      <div className="flex-1 flex flex-col lg:flex-row pt-16 overflow-hidden">
        
        {/* Main Canvas Area */}
        <main className="flex-1 flex flex-col relative">
          
          {/* Top Bar */}
          <div className="p-6 flex items-center justify-between border-b border-gray-800 bg-gray-900/50 backdrop-blur">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={onBack} className="rounded-full w-10 h-10 p-0 flex items-center justify-center">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold">Linked List Operations</h1>
            </div>
            
            {/* Operation Buttons */}
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                onClick={() => actions.insertHead(Math.floor(Math.random() * 99))}
                disabled={isBusy}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Head
              </Button>
              <Button 
                size="sm" 
                variant="secondary"
                onClick={() => actions.insertTail(Math.floor(Math.random() * 99))}
                disabled={isBusy}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Tail
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => actions.deleteNode(displayNodes[0]?.value || 0)} // Simple demo delete first
                disabled={isBusy || displayNodes.length === 0}
              >
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="text-indigo-400 border-indigo-900/50 hover:bg-indigo-900/20"
                onClick={actions.reverse}
                disabled={isBusy || displayNodes.length < 2}
              >
                <RotateCw className="w-4 h-4 mr-1" /> Reverse
              </Button>
            </div>
          </div>

          {/* Visualization Canvas */}
          <div className="flex-1 bg-gray-900 relative overflow-x-auto flex flex-col">
            
            {/* Step Message */}
            <div className="absolute top-4 left-0 right-0 text-center pointer-events-none">
              <motion.div
                key={currentStep.message}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block px-4 py-2 bg-gray-800/80 backdrop-blur rounded-full border border-gray-700 text-sm font-mono text-primary-300 shadow-xl"
              >
                {currentStep.message}
              </motion.div>
            </div>

            {/* Nodes Container */}
            <div className="flex-1 flex items-center px-12 min-w-max">
              <div className="flex items-center space-x-0">
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
        </main>

        {/* Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
};
