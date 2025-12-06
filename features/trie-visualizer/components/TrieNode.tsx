import React from 'react';
import { motion } from 'framer-motion';
import { VisualTrieNode } from '../types';

interface TrieNodeProps {
  node: VisualTrieNode;
}

export const TrieNode: React.FC<TrieNodeProps> = ({ node }) => {
  const isRoot = node.char === '';
  
  const getColors = () => {
    if (node.state === 'found') return { fill: '#22c55e', stroke: '#166534', text: '#dcfce7' }; // Green
    if (node.state === 'active') return { fill: '#3b82f6', stroke: '#1e40af', text: '#dbeafe' }; // Blue
    if (node.isEndOfWord) return { fill: '#a855f7', stroke: '#6b21a8', text: '#f3e8ff' }; // Purple
    return { fill: '#1f2937', stroke: '#4b5563', text: '#e5e7eb' }; // Gray
  };

  const colors = getColors();
  const radius = 18;

  return (
    <motion.g
      layoutId={node.id}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1, x: node.x, y: node.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <circle
        r={radius}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={node.isEndOfWord ? 3 : 2}
      />
      
      <text
        dy=".35em"
        textAnchor="middle"
        fill={colors.text}
        fontSize="14"
        fontWeight="bold"
        className="select-none font-mono uppercase"
      >
        {isRoot ? 'ROOT' : node.char}
      </text>

      {/* End of Word Indicator (Star) if needed, or just thick border/color */}
      {node.isEndOfWord && node.state === 'found' && (
        <motion.circle
          r={radius + 5}
          fill="none"
          stroke="#22c55e"
          strokeWidth="2"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 1.5 }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      )}
    </motion.g>
  );
};