import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ListNodeProps {
  value: number;
  highlight: boolean;
  pointers: string[]; // e.g., ['head', 'curr']
  isTail: boolean;
}

export const ListNode: React.FC<ListNodeProps> = ({ value, highlight, pointers, isTail }) => {
  return (
    <div className="flex items-center">
      <div className="relative group">
        {/* Pointers Labels (Top) */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1">
          {pointers.map(p => (
            <motion.span 
              key={p}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] uppercase font-bold rounded-full shadow-md"
            >
              {p}
            </motion.span>
          ))}
        </div>

        {/* Node Body */}
        <motion.div
          layout
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1,
            backgroundColor: highlight ? '#4f46e5' : '#1f2937', // indigo-600 vs gray-800
            borderColor: highlight ? '#818cf8' : '#374151' // indigo-400 vs gray-700
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="w-16 h-16 rounded-xl border-2 flex items-center justify-center relative shadow-lg z-10"
        >
          <span className={`text-lg font-bold ${highlight ? 'text-white' : 'text-gray-200'}`}>
            {value}
          </span>
          
          {/* Internal separator for "next" pointer area representation */}
          <div className="absolute right-0 top-0 bottom-0 w-4 border-l border-inherit bg-black/20 rounded-r-sm" />
        </motion.div>
      </div>

      {/* Connection Arrow */}
      <div className="w-12 flex items-center justify-center text-gray-500 relative">
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '100%', opacity: 1 }}
          className="h-0.5 bg-gray-600 w-full absolute"
        />
        <ArrowRight className="w-5 h-5 absolute right-0 text-gray-400" />
      </div>

      {/* Null Indicator */}
      {isTail && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-8 h-8 flex items-center justify-center text-gray-500 font-mono text-sm border border-gray-700 rounded bg-gray-900/50"
        >
          null
        </motion.div>
      )}
    </div>
  );
};
