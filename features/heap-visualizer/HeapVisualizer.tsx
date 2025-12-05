import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useHeap } from './hooks/useHeap';
import { HeapCanvas } from './components/HeapCanvas';
import { ControlPanel } from './components/ControlPanel';
import { Sidebar } from './components/Sidebar';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
import { ChatPanel } from '../ai-tutor/ChatPanel';
import { motion, AnimatePresence } from 'framer-motion';

interface HeapVisualizerProps {
  onBack: () => void;
}

export const HeapVisualizer: React.FC<HeapVisualizerProps> = ({ onBack }) => {
  const { 
    heap, 
    visualNodes,
    heapType,
    operation,
    message,
    comparingIndices,
    sortedArray,
    insert,
    extractRoot,
    toggleType,
    sort,
    reset
  } = useHeap();

  // Initial Data
  useEffect(() => {
    const init = async () => {
      await new Promise(r => setTimeout(r, 500));
      insert(10);
      setTimeout(() => insert(5), 1000);
      setTimeout(() => insert(15), 2000);
      setTimeout(() => insert(2), 3000);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      
      <div className="flex-1 flex flex-col lg:flex-row pt-16 lg:h-screen lg:overflow-hidden">
        
        {/* Main Area */}
        <main className="flex-1 flex flex-col relative min-h-[calc(100vh-4rem)] lg:min-h-0 lg:h-auto overflow-y-auto lg:overflow-hidden">
          
          {/* Top Bar */}
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800 bg-gray-900/50 backdrop-blur gap-4 shrink-0 z-10">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={onBack} className="rounded-full w-10 h-10 p-0 flex items-center justify-center shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl sm:text-2xl font-bold">Binary Heap</h1>
            </div>
            
            <div className="text-sm font-mono text-gray-400">
               Size: <span className="text-white">{heap.length}</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-gray-900 relative">
            
            {/* Controls Overlay */}
            <div className="w-full max-w-2xl mx-auto p-4 z-20 shrink-0">
              <ControlPanel 
                onInsert={insert}
                onExtract={extractRoot}
                onSort={sort}
                onReset={reset}
                onToggleType={toggleType}
                heapType={heapType}
                operation={operation}
              />
            </div>

            {/* Canvas Area */}
            <div className="flex-1 p-4 sm:p-8 overflow-auto relative flex flex-col min-h-[400px]">
              
              {/* Message Toast */}
              <div className="text-center mb-4 min-h-[30px]">
                <motion.div
                  key={message}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-block px-4 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-sm font-medium text-primary-300"
                >
                  {message}
                </motion.div>
              </div>

              <div className="flex-1 overflow-hidden relative rounded-xl border border-gray-800 bg-gray-950/50 flex flex-col">
                <HeapCanvas nodes={visualNodes} comparingIndices={comparingIndices} />
                
                {/* Array Visualization */}
                <div className="p-4 border-t border-gray-800 bg-gray-900/80">
                  <div className="text-xs font-bold text-gray-500 uppercase mb-2">Internal Array Representation</div>
                  <div className="flex space-x-1 overflow-x-auto pb-2">
                    <AnimatePresence>
                      {heap.map((node, i) => (
                         <motion.div
                           key={node.id}
                           layoutId={`arr-${node.id}`}
                           initial={{ opacity: 0, scale: 0.8 }}
                           animate={{ opacity: 1, scale: 1 }}
                           exit={{ opacity: 0, scale: 0 }}
                           className={`w-10 h-10 shrink-0 flex items-center justify-center rounded border font-mono text-sm font-bold
                             ${comparingIndices.includes(i) ? 'border-amber-400 text-amber-400 bg-amber-900/20' : 'border-gray-700 text-gray-300 bg-gray-800'}
                           `}
                         >
                           {node.value}
                         </motion.div>
                      ))}
                    </AnimatePresence>
                    {heap.length === 0 && <div className="text-gray-600 text-sm italic p-2">Empty</div>}
                  </div>
                </div>
              </div>

              {/* Sorted Array Output (for Heap Sort) */}
              {sortedArray.length > 0 && (
                <div className="mt-4 p-4 rounded-xl border border-gray-800 bg-gray-900/80">
                  <div className="text-xs font-bold text-green-500 uppercase mb-2">Sorted Output</div>
                  <div className="flex flex-wrap gap-2">
                    {sortedArray.map((val, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="px-2 py-1 bg-green-900/20 border border-green-500/30 rounded text-green-300 text-sm font-mono"
                      >
                        {val}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <Sidebar />

        <ChatPanel 
          context={`Binary Heap (${heapType} heap). Operations: Insert (Bubble Up), Extract (Bubble Down).`}
          onHighlightNode={() => {}}
        />
      </div>
    </div>
  );
};
