import React from 'react';
import { motion } from 'framer-motion';
import { VisualHeapNode } from '../types';

interface HeapNodeProps {
  node: VisualHeapNode;
  isComparing: boolean;
}

export const HeapNode: React.FC<HeapNodeProps> = ({ node, isComparing }) => {
  return (
    <motion.g
      layoutId={node.id} // Enables shared layout animation (swapping)
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        x: node.x, 
        y: node.y, 
        scale: 1, 
        opacity: 1 
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        mass: 1 
      }}
    >
      <motion.circle
        r="22"
        fill="#1f2937" // gray-800
        stroke={isComparing ? '#fbbf24' : '#8b5cf6'} // amber-400 vs violet-500
        strokeWidth={isComparing ? 4 : 2}
        animate={{ stroke: isComparing ? '#fbbf24' : '#8b5cf6' }}
      />
      
      <text
        dy=".35em"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="bold"
        className="pointer-events-none select-none"
      >
        {node.value}
      </text>

      {/* Index Badge */}
      <circle cx="16" cy="16" r="8" fill="#111827" />
      <text x="16" y="16" dy=".3em" textAnchor="middle" fill="#9ca3af" fontSize="9">
        {node.index}
      </text>
    </motion.g>
  );
};
