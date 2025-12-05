import React from 'react';
import { motion } from 'framer-motion';
import { VisualEdge } from '../types';

interface TreeEdgeProps {
  edge: VisualEdge;
}

export const TreeEdge: React.FC<TreeEdgeProps> = ({ edge }) => {
  return (
    <motion.line
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ 
        x1: edge.x1,
        y1: edge.y1,
        x2: edge.x2,
        y2: edge.y2,
        pathLength: 1, 
        opacity: 1 
      }}
      transition={{ duration: 0.5 }}
      stroke="#4b5563" // gray-600
      strokeWidth="2"
      className="transition-colors duration-300"
    />
  );
};
