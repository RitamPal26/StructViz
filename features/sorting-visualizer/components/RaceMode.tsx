import React from 'react';
import { SortStep, AlgorithmType } from '../types';
import { SortingBars } from './SortingBars';
import { Trophy, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface RaceModeProps {
  algorithms: AlgorithmType[];
  steps: Record<AlgorithmType, SortStep[]>;
  currentIndices: Record<AlgorithmType, number>;
  maxValue: number;
}

const ALG_NAMES: Record<AlgorithmType, string> = {
  bubble: 'Bubble Sort',
  selection: 'Selection Sort',
  insertion: 'Insertion Sort',
  merge: 'Merge Sort',
  quick: 'Quick Sort',
  heap: 'Heap Sort'
};

export const RaceMode: React.FC<RaceModeProps> = ({ algorithms, steps, currentIndices, maxValue }) => {
  // Determine if finished
  const getProgress = (alg: AlgorithmType) => {
    const total = steps[alg]?.length || 1;
    const current = currentIndices[alg];
    return Math.min((current / (total - 1)) * 100, 100);
  };

  const isFinished = (alg: AlgorithmType) => {
    return currentIndices[alg] >= (steps[alg]?.length || 0) - 1;
  };

  // Find rank
  const finishedAlgos = algorithms.filter(a => isFinished(a)).sort((a, b) => {
    // If we tracked real completion time, we'd use that. 
    // Here we can approximate by assuming they started together and "finished" implies they reached end.
    // Ideally the parent component tracks completion order. For simplicity, we just show "Done".
    return 0;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full p-4 overflow-y-auto">
      {algorithms.map((alg) => {
        const algSteps = steps[alg];
        const index = currentIndices[alg];
        const step = algSteps[index] || algSteps[algSteps.length - 1];
        const progress = getProgress(alg);
        const finished = isFinished(alg);

        return (
          <div key={alg} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex flex-col h-[250px] relative">
            <div className="p-3 border-b border-gray-700 bg-gray-900/50 flex justify-between items-center">
              <h3 className="font-bold text-white text-sm">{ALG_NAMES[alg]}</h3>
              <div className="flex items-center space-x-2">
                {finished && <Trophy className="w-4 h-4 text-yellow-400 animate-bounce" />}
                <span className="text-xs font-mono text-gray-400">{index} ops</span>
              </div>
            </div>
            
            <div className="flex-1 p-2 relative">
              {step && <SortingBars step={step} maxValue={maxValue} />}
              
              {/* Finish Line Overlay */}
              {finished && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-green-900/20 flex items-center justify-center backdrop-blur-[1px]"
                >
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    Complete
                  </span>
                </motion.div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-gray-900 w-full">
              <motion.div 
                className={`h-full ${finished ? 'bg-green-500' : 'bg-primary-500'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};