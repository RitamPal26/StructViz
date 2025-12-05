import React from 'react';
import { AlgorithmStep } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface AlgorithmPanelProps {
  step: AlgorithmStep | undefined;
}

export const AlgorithmPanel: React.FC<AlgorithmPanelProps> = ({ step }) => {
  if (!step) return (
    <div className="h-full flex items-center justify-center text-gray-500 text-sm italic">
      Run an algorithm to see internal state
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
        <h3 className="font-bold text-gray-300 uppercase text-xs tracking-wider">
          {step.structureType === 'queue' ? 'Queue (FIFO)' : step.structureType === 'stack' ? 'Stack (LIFO)' : 'Distance Table'}
        </h3>
        <span className="text-xs text-primary-400">{step.structureState.length} items</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        <AnimatePresence mode="popLayout">
          {step.structureType === 'table' ? (
            // Dijkstra Table
            (step.structureState as {id: string, dist: number}[]).map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-between bg-gray-800 p-2 rounded border border-gray-700 text-sm"
              >
                <span className="font-bold text-gray-300">Node {item.id}</span> // Actually ID might be 'A', 'B' need label map or just rely on ID if ID was label.
                {/* Simplified for demo: assuming ID maps closely to label or we accept ID display */}
                <span className="font-mono text-yellow-400">{item.dist}</span>
              </motion.div>
            ))
          ) : (
            // Queue / Stack
            (step.structureState as string[]).map((id, index) => (
              <motion.div
                key={`${id}-${index}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className={`p-2 rounded border text-sm font-medium text-center
                  ${index === 0 && step.structureType === 'queue' ? 'bg-primary-900/50 border-primary-500 text-primary-200' : 'bg-gray-800 border-gray-700 text-gray-300'}
                  ${index === (step.structureState.length - 1) && step.structureType === 'stack' ? 'bg-indigo-900/50 border-indigo-500 text-indigo-200' : ''}
                `}
              >
                Node {id} 
                {/* Note: In real app, we'd lookup the Label from the ID */}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
