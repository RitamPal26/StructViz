import React from 'react';
import { motion } from 'framer-motion';
import { VisualNode } from '../types';

interface TreeNodeProps {
  node: VisualNode;
}

export const TreeNode: React.FC<TreeNodeProps> = ({ node }) => {
  const getColors = () => {
    switch (node.state) {
      case 'highlighted':
        return { stroke: '#fbbf24', fill: '#1f2937', text: '#fbbf24' }; // amber-400
      case 'found':
        return { stroke: '#22c55e', fill: 'rgba(21, 128, 61, 0.2)', text: '#4ade80' }; // green-500
      case 'modifying':
        return { stroke: '#ef4444', fill: '#1f2937', text: '#ef4444' }; // red-500
      default:
        return { stroke: '#38bdf8', fill: '#1f2937', text: '#f3f4f6' }; // primary-400
    }
  };

  const colors = getColors();

  return (
    <motion.g
      layoutId={node.id} // Enables magic layout animations
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        x: node.x, 
        y: node.y, 
        scale: 1, 
        opacity: 1 
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <motion.circle
        r="20"
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth="3"
        initial={false}
        animate={{ fill: colors.fill, stroke: colors.stroke }}
        transition={{ duration: 0.3 }}
      />
      
      <motion.text
        dy=".35em"
        textAnchor="middle"
        fill={colors.text}
        fontSize="14"
        fontWeight="600"
        initial={false}
        animate={{ fill: colors.text }}
      >
        {node.value}
      </motion.text>
      
      {/* Pulse effect for found nodes */}
      {node.state === 'found' && (
        <motion.circle
          r="20"
          fill="none"
          stroke={colors.stroke}
          strokeWidth="2"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      )}
    </motion.g>
  );
};
