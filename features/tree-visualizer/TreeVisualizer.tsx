import React, { useEffect } from 'react';
import { useBinaryTree } from './hooks/useBinaryTree';
import { TreeCanvas } from './components/TreeCanvas';
import { ControlPanel } from './components/ControlPanel';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';

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
    operation,
    message,
    speed,
    setSpeed
  } = useBinaryTree();

  // Initial demo data
  useEffect(() => {
    const init = async () => {
      // Small delay to let component mount smoothly
      await new Promise(r => setTimeout(r, 500));
      insert(50);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={onBack} className="rounded-full w-10 h-10 p-0 flex items-center justify-center">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">Binary Search Tree</h1>
                <p className="text-gray-400 text-sm mt-1">Visualize insertion, deletion, and search operations.</p>
              </div>
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
            
            <TreeCanvas nodes={visualNodes} edges={visualEdges} />
            
            {/* Educational Notes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h3 className="text-primary-400 font-semibold mb-2">BST Property</h3>
                <p className="text-sm text-gray-400">For every node, all values in the left subtree are smaller, and all values in the right subtree are larger.</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h3 className="text-primary-400 font-semibold mb-2">Time Complexity</h3>
                <p className="text-sm text-gray-400">Search, Insert, Delete: O(h) where h is height. In a balanced tree, h = log(n).</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h3 className="text-primary-400 font-semibold mb-2">Color Guide</h3>
                <div className="flex space-x-3 text-xs">
                  <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-primary-400 mr-1"></span>Default</span>
                  <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></span>Visiting</span>
                  <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>Found</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};
