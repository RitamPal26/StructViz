import React from 'react';
import { motion } from 'framer-motion';

interface ArrayDisplayProps {
  array: number[];
}

export const ArrayDisplay: React.FC<ArrayDisplayProps> = ({ array }) => {
  return (
    <div className="flex flex-col items-center p-4 bg-gray-900/50 border-t border-gray-800">
      <span className="text-xs text-gray-500 uppercase font-bold mb-2">Original Array</span>
      <div className="flex gap-2 overflow-x-auto max-w-full p-2">
        {array.map((val, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <motion.div
              layout
              className="w-10 h-10 flex items-center justify-center bg-gray-800 border border-gray-700 rounded text-gray-200 font-mono text-sm"
            >
              {val}
            </motion.div>
            <span className="text-[10px] text-gray-500 mt-1">{idx}</span>
          </div>
        ))}
      </div>
    </div>
  );
};