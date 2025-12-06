import React, { useEffect, useState } from 'react';
import { useBinaryTree } from './hooks/useBinaryTree';
import { TreeCanvas } from './components/TreeCanvas';
import { ControlPanel } from './components/ControlPanel';
import { ChatPanel } from '../ai-tutor/ChatPanel';
import { motion } from 'framer-motion';
import { ArrowLeft, Book, Brain } from 'lucide-react';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
import { MobileLandscapeAlert } from '../../shared/components/MobileLandscapeAlert';

interface TreeVisualizerProps {
  onBack: () => void;
}

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ onBack }) => {
  const { 
    visualNodes, 
    visualEdges, 
    insert, 
    delete: remove, 
    search, 
    clear, 
    buildTree,
    highlightValue,
    operation,
    message,
    speed,
    setSpeed
  } = useBinaryTree();

  const [showQuiz, setShowQuiz] = useState(false);

  // Initial demo data
  useEffect(() => {
    const init = async () => {
      await new Promise(r => setTimeout(r, 500));
      insert(50);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <MobileLandscapeAlert />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-start md:items-center space-x-4">
              <Button variant="outline" size="sm" onClick={onBack} className="rounded-full w-10 h-10 p-0 flex items-center justify-center shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Binary Search Tree</h1>
                <p className="text-gray-400 text-sm mt-1">Visualize insertion, deletion, and search operations.</p>
              </div>
            </div>
            
            <div className="flex space-x-2 w-full md:w-auto">
               <Button 
                 variant="secondary" 
                 size="sm"
                 onClick={() => setShowQuiz(!showQuiz)}
                 className={`w-full md:w-auto ${showQuiz ? 'bg-primary-600' : ''}`}
               >
                 <Brain className="w-4 h-4 mr-2" />
                 {showQuiz ? 'Exit Quiz' : 'Quiz Mode'}
               </Button>
            </div>
          </div>

          {/* Main Layout */}
          <div className="space-y-6">
            <ControlPanel 
              onInsert={insert}
              onDelete={remove}
              onSearch={search}
              onClear={clear}
              onSpeedChange={setSpeed}
              speed={speed}
              operation={operation}
              message={message}
            />
            
            <div className="relative">
               <TreeCanvas nodes={visualNodes} edges={visualEdges} />
               
               {/* Quiz Overlay */}
               {showQuiz && (
                 <motion.div 
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }}
                   className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-20 p-4"
                 >
                   <div className="bg-gray-800 p-8 rounded-2xl border border-primary-500/50 shadow-2xl max-w-md w-full text-center">
                     <Brain className="w-12 h-12 text-primary-400 mx-auto mb-4" />
                     <h3 className="text-xl font-bold text-white mb-2">Pop Quiz!</h3>
                     <p className="text-gray-300 mb-6">
                       Where would the value <strong>{Math.floor(Math.random() * 100)}</strong> be inserted in the current tree?
                       <br/><span className="text-xs text-gray-500 mt-2 block">Ask the AI Tutor for a hint!</span>
                     </p>
                     <Button className="w-full" onClick={() => setShowQuiz(false)}>Back to Visualization</Button>
                   </div>
                 </motion.div>
               )}
            </div>
            
            {/* Educational Notes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-primary-500/30 transition-colors">
                <div className="flex items-center space-x-2 mb-2">
                  <Book className="w-4 h-4 text-primary-400" />
                  <h3 className="text-primary-400 font-semibold">Real-World Use</h3>
                </div>
                <p className="text-sm text-gray-400">Database indexing (e.g., SQL) often uses variants of BSTs (like B-Trees) to lookup records efficiently.</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h3 className="text-primary-400 font-semibold mb-2">Time Complexity</h3>
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Search</span>
                  <span className="font-mono text-white">O(log n)</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Insert/Delete</span>
                  <span className="font-mono text-white">O(log n)</span>
                </div>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h3 className="text-primary-400 font-semibold mb-2">Legend</h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="flex items-center bg-gray-700 px-2 py-1 rounded"><span className="w-2 h-2 rounded-full bg-primary-400 mr-2"></span>Node</span>
                  <span className="flex items-center bg-gray-700 px-2 py-1 rounded"><span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>Scan</span>
                  <span className="flex items-center bg-gray-700 px-2 py-1 rounded"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>Found</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Tutor Integration */}
        <ChatPanel 
          context="Binary Search Trees" 
          onHighlightNode={highlightValue}
          onBuildStructure={buildTree}
        />
      </main>
    </div>
  );
};
