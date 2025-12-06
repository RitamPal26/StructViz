import React from 'react';
import { motion } from 'framer-motion';
import { VisualTrieEdge } from '../types';

interface TrieEdgeProps {
  edge: VisualTrieEdge;
}

export const TrieEdge: React.FC<TrieEdgeProps> = ({ edge }) => {
  return (
    <g>
      <motion.line
        initial={{ opacity: 0 }}
        animate={{ 
          x1: edge.x1, 
          y1: edge.y1, 
          x2: edge.x2, 
          y2: edge.y2, 
          opacity: 1,
          stroke: edge.state === 'active' ? '#60a5fa' : '#4b5563',
          strokeWidth: edge.state === 'active' ? 3 : 1
        }}
        transition={{ duration: 0.3 }}
      />
      {/* Small Character Label on Edge (Optional, but node has char so maybe redundant? Kept for clarity in dense trees) */}
      {/* <text x={(edge.x1+edge.x2)/2} y={(edge.y1+edge.y2)/2} fill="gray" fontSize="10">{edge.char}</text> */}
    </g>
  );
};