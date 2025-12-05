import React from 'react';
import { motion } from 'framer-motion';
import { StackItem } from '../types';
import { Globe, Code, Braces } from 'lucide-react';

interface StackBlockProps {
  item: StackItem;
  index: number;
  isTop: boolean;
  isPeeking: boolean;
}

export const StackBlock: React.FC<StackBlockProps> = ({ item, index, isTop, isPeeking }) => {
  const getIcon = () => {
    switch (item.type) {
      case 'url': return <Globe className="w-4 h-4 text-blue-400" />;
      case 'code': return <Code className="w-4 h-4 text-yellow-400" />;
      case 'paren': return <Braces className="w-4 h-4 text-purple-400" />;
      default: return <span className="text-xs font-mono text-gray-500">#{index}</span>;
    }
  };

  const getColors = () => {
    switch (item.type) {
      case 'url': return 'border-blue-500/50 bg-blue-900/20 text-blue-100';
      case 'code': return 'border-yellow-500/50 bg-yellow-900/20 text-yellow-100';
      case 'paren': return 'border-purple-500/50 bg-purple-900/20 text-purple-100';
      default: return 'border-gray-600 bg-gray-800 text-gray-100';
    }
  };

  return (
    <motion.div
      layout
      initial={{ y: -100, opacity: 0, scale: 0.8 }}
      animate={{ 
        y: 0, 
        opacity: 1, 
        scale: isPeeking ? 1.05 : 1,
        boxShadow: isTop 
          ? '0 0 20px rgba(56, 189, 248, 0.3)' // Primary glow
          : '0 4px 6px rgba(0, 0, 0, 0.1)' 
      }}
      exit={{ 
        x: 200, 
        rotate: 45, 
        opacity: 0,
        transition: { duration: 0.4 } 
      }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 20 
      }}
      className={`
        relative h-14 w-full md:w-64 rounded-xl border-2 flex items-center justify-between px-4
        ${getColors()}
        ${isTop ? 'border-primary-400' : ''}
        ${isPeeking ? 'ring-4 ring-primary-500/50' : ''}
      `}
    >
      <div className="flex items-center space-x-3 truncate">
        {getIcon()}
        <span className="font-medium truncate">{item.value}</span>
      </div>
      
      {isTop && (
        <motion.div
          layoutId="top-indicator"
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary-400 rounded-full shadow-[0_0_10px_#38bdf8]"
        />
      )}
      
      <span className="absolute -left-8 text-xs text-gray-600 font-mono">
        {index}
      </span>
    </motion.div>
  );
};
