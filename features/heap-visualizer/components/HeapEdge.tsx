import React from 'react';
import { motion } from 'framer-motion';

interface HeapEdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const HeapEdge: React.FC<HeapEdgeProps> = ({ x1, y1, x2, y2 }) => {
  return (
    <motion.line
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ 
        x1, y1, x2, y2,
        pathLength: 1, 
        opacity: 0.4 
      }}
      stroke="#9ca3af" // gray-400
      strokeWidth="2"
    />
  );
};
