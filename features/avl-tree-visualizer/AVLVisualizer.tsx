import React, { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAVLTree } from './hooks/useAVLTree';
import { AVLCanvas } from './components/AVLCanvas';
import { ControlPanel } from './components/ControlPanel';
import { ComparisonMode } from './components/ComparisonMode';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
import { ChatPanel } from '../ai-tutor/ChatPanel';
import { MobileLandscapeAlert } from '../../shared/components/MobileLandscapeAlert';

interface AVLVisualizerProps {
  onBack: () => void;
}

export const AVLVisualizer: React.FC<AVLVisualizerProps> = ({ onBack }) => {
  const { 
    visualNodes, 
    visualEdges, 
    bstNodes, 
    bstEdges, 
    insert, 
    reset,
    bulkInsert,
    operation, 
    message,
    comparisonStats
  } = useAVLTree();

  const [showComparison, setShowComparison] = useState(false);

  // Initial Demo
  useEffect(() => {
    bulkInsert([10, 20, 30, 40, 50, 25]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleWorstCase = () => {
    reset();
    // Inserting sorted data causes standard BST to skew, AVL to balance
    const sorted = [1, 2, 3, 4, 5, 6, 7];
    let delay = 0;
    sorted.forEach(val => {
      setTimeout(() => insert(val), delay);
      delay += 2000; // Allow rotation time
    });
  };

  const handleRandom = () => {
    reset();
    const randoms = Array.from({length: 8}, () => Math.floor(Math.random() * 50) + 1);
    let delay = 0;
    randoms.forEach(val => {
      setTimeout(() => insert(val), delay);
      delay += 2000;
    });
  };

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
              <h1 className="text-xl sm:text-2xl font-bold">AVL Tree</h1>
            </div>
            
            <Button 
              size="sm" 
              variant={showComparison ? 'primary' : 'outline'} 
              onClick={() => setShowComparison(!showComparison)}
            >
              <Layers className="w-4 h-4 mr-2" />
              {showComparison ? 'Hide Comparison' : 'Compare vs BST'}
            </Button>
          </div>

          <div className="flex-1 flex flex-col bg-gray-900 relative p-4 sm:p-8 overflow-y-auto">
            
            {/* Controls */}
            <div className="w-full max-w-2xl mx-auto mb-6">
              <ControlPanel 
                onInsert={insert}
                onReset={reset}
                onWorstCase={handleWorstCase}
                onRandom={handleRandom}
                operation={operation}
              />
            </div>

            {/* Message Toast */}
            <div className="text-center mb-6 h-8">
              <motion.div
                key={message}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block px-4 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-sm font-medium text-primary-300"
              >
                {message}
              </motion.div>
            </div>

            {/* Main Canvas */}
            {!showComparison ? (
              <div className="flex-1 min-h-[400px]">
                <AVLCanvas nodes={visualNodes} edges={visualEdges} height={500} />
                
                {/* Legend */}
                <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
                  <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-gray-800 border border-blue-500 mr-2"></div> Balanced</div>
                  <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-gray-800 border border-yellow-500 mr-2"></div> Checking</div>
                  <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-gray-800 border border-red-500 mr-2"></div> Imbalanced</div>
                </div>
              </div>
            ) : (
              <ComparisonMode 
                avlNodes={visualNodes} 
                avlEdges={visualEdges} 
                bstNodes={bstNodes} 
                bstEdges={bstEdges}
                stats={comparisonStats}
              />
            )}

          </div>
        </main>

        {/* Sidebar Info */}
        <div className="w-full lg:w-80 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto lg:h-[calc(100vh-4rem)]">
          <div className="space-y-8">
            <section>
              <div className="flex items-center space-x-2 text-primary-400 mb-4">
                <BookOpen className="w-5 h-5" />
                <h3 className="font-bold text-sm uppercase tracking-wider">Concept</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                AVL Trees are self-balancing Binary Search Trees. They ensure that the height difference (balance factor) between left and right subtrees is at most 1.
              </p>
              <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700 text-xs font-mono text-gray-300">
                Balance Factor = Height(Left) - Height(Right)
              </div>
            </section>

            <section>
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">Rotations</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex justify-between"><span>Left-Left (LL)</span> <span className="text-white">Right Rotation</span></li>
                <li className="flex justify-between"><span>Right-Right (RR)</span> <span className="text-white">Left Rotation</span></li>
                <li className="flex justify-between"><span>Left-Right (LR)</span> <span className="text-white">Left then Right</span></li>
                <li className="flex justify-between"><span>Right-Left (RL)</span> <span className="text-white">Right then Left</span></li>
              </ul>
            </section>
          </div>
        </div>

        <ChatPanel 
          context="AVL Tree. Self-balancing BST. Maintains O(log n) height using rotations. Balance Factor = Height(Left) - Height(Right). Rotations: LL (Right Rotate), RR (Left Rotate), LR (Left then Right), RL (Right then Left)."
          onHighlightNode={(val) => insert(val)}
        />
      </div>
    </div>
  );
};