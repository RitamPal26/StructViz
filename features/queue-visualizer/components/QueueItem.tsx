import React from 'react';
import { motion } from 'framer-motion';
import { QueueItem as IQueueItem, QueueMode } from '../types';
import { Printer, User, Cpu, FileText } from 'lucide-react';

interface QueueItemProps {
  item: IQueueItem;
  index: number;
  isHead: boolean;
  isTail: boolean;
  mode: QueueMode;
  isPeeking: boolean;
  circularIndex?: number; // For label in circular mode
}

export const QueueItem: React.FC<QueueItemProps> = ({ 
  item, 
  index, 
  isHead, 
  isTail, 
  mode,
  isPeeking,
  circularIndex
}) => {
  const getIcon = () => {
    switch (item.type) {
      case 'job': return <Printer className="w-5 h-5" />;
      case 'person': return <User className="w-5 h-5" />;
      case 'process': return <Cpu className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getPriorityColor = () => {
    if (mode !== 'priority') return 'border-indigo-500 bg-indigo-900/30 text-indigo-100';
    if (item.priority === 1) return 'border-red-500 bg-red-900/30 text-red-100'; // High
    if (item.priority === 2) return 'border-yellow-500 bg-yellow-900/30 text-yellow-100'; // Medium
    return 'border-green-500 bg-green-900/30 text-green-100'; // Low
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        scale: isPeeking ? 1.1 : 1,
        borderColor: isPeeking ? '#f472b6' : '' // pink-400
      }}
      exit={{ opacity: 0, x: -50, scale: 0.5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`
        relative flex flex-col items-center justify-center
        w-20 h-24 sm:w-24 sm:h-32 rounded-xl border-2 shadow-lg backdrop-blur-sm
        ${getPriorityColor()}
        ${isPeeking ? 'ring-4 ring-pink-500/50 z-20' : ''}
      `}
    >
      {/* Pointers */}
      {(isHead || isTail) && (
        <div className="absolute -top-8 flex space-x-1">
          {isHead && (
            <motion.span 
              layoutId="head-ptr"
              className="px-2 py-0.5 bg-green-500 text-black text-[10px] font-bold rounded-full uppercase"
            >
              Front
            </motion.span>
          )}
          {isTail && (
            <motion.span 
              layoutId="tail-ptr"
              className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-full uppercase"
            >
              Rear
            </motion.span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="mb-2 p-2 bg-black/20 rounded-full">
        {getIcon()}
      </div>
      <span className="text-xs font-semibold truncate max-w-full px-2">{item.value}</span>
      
      {mode === 'priority' && (
        <span className="text-[10px] opacity-70 mt-1">Pri: {item.priority}</span>
      )}

      {/* Index Label */}
      <span className="absolute -bottom-6 text-xs text-gray-500 font-mono">
        {mode === 'circular' ? circularIndex : index}
      </span>
    </motion.div>
  );
};
