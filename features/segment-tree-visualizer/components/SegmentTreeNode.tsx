import React from 'react';
import { motion } from 'framer-motion';
import { SegmentNode } from '../types';

interface SegmentTreeNodeProps {
  node: SegmentNode;
}

export const SegmentTreeNode: React.FC<SegmentTreeNodeProps> = ({ node }) => {
  const getStyles = () => {
    switch (node.state) {
      case 'active': return { fill: '#fbbf24', stroke: '#d97706', scale: 1.1 }; // Amber (Processing)
      case 'visited': return { fill: '#3b82f6', stroke: '#1d4ed8', scale: 1 }; // Blue (Visited)
      case 'accepted': return { fill: '#22c55e', stroke: '#15803d', scale: 1.1 }; // Green (Contributing)
      case 'rejected': return { fill: '#374151', stroke: '#4b5563', scale: 0.9, opacity: 0.5 }; // Gray (Out of range)
      case 'lazy': return { fill: '#a855f7', stroke: '#7e22ce', scale: 1.05 }; // Purple (Lazy push)
      default: return { fill: '#1f2937', stroke: '#4b5563', scale: 1 }; // Default Dark
    }
  };

  const style = getStyles();

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        x: node.x, 
        y: node.y, 
        scale: style.scale,
        opacity: style.opacity ?? 1
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Node Body */}
      <motion.rect
        x="-30"
        y="-20"
        width="60"
        height="40"
        rx="8"
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth="2"
        animate={{ fill: style.fill, stroke: style.stroke }}
      />
      
      {/* Value */}
      <text
        dy="5"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="bold"
        className="pointer-events-none select-none"
      >
        {node.value}
      </text>

      {/* Range Label (Top) */}
      <text
        dy="-28"
        textAnchor="middle"
        fill="#9ca3af"
        fontSize="10"
        className="pointer-events-none select-none font-mono"
      >
        [{node.range[0]}, {node.range[1]}]
      </text>

      {/* Lazy Badge (Bottom Right) */}
      {node.lazy !== 0 && (
        <g transform="translate(20, 10)">
          <circle r="10" fill="#ef4444" stroke="white" strokeWidth="1" />
          <text dy="3" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
            +{node.lazy}
          </text>
        </g>
      )}
    </motion.g>
  );
};