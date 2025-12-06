import React from 'react';
import { motion } from 'framer-motion';
import { VisualAVLNode } from '../types';

interface AVLNodeProps {
  node: VisualAVLNode;
  mini?: boolean; // For comparison mode small rendering
}

export const AVLNode: React.FC<AVLNodeProps> = ({ node, mini = false }) => {
  const radius = mini ? 12 : 24;
  const fontSize = mini ? 10 : 14;

  const getColors = () => {
    if (node.state === 'imbalanced') return { fill: '#ef4444', stroke: '#b91c1c' }; // Red
    if (node.state === 'checking') return { fill: '#eab308', stroke: '#a16207' }; // Yellow
    return { fill: '#1f2937', stroke: '#3b82f6' }; // Default Blue
  };

  const colors = getColors();

  return (
    <motion.g
      layoutId={node.id}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        x: node.x, 
        y: node.y, 
        scale: 1, 
        opacity: 1 
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <circle
        r={radius}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={mini ? 1 : 3}
      />
      
      {!mini && (
        <>
          {/* Main Value */}
          <text
            dy=".35em"
            textAnchor="middle"
            fill="white"
            fontSize={fontSize}
            fontWeight="bold"
            className="pointer-events-none select-none"
          >
            {node.value}
          </text>

          {/* Height Badge (Top Right) */}
          <g transform={`translate(${radius * 0.7}, -${radius * 0.7})`}>
            <circle r="8" fill="#111827" stroke="#4b5563" strokeWidth="1" />
            <text dy=".35em" textAnchor="middle" fill="#9ca3af" fontSize="9" fontWeight="bold">H{node.height}</text>
          </g>

          {/* Balance Factor Badge (Top Left) */}
          <g transform={`translate(-${radius * 0.7}, -${radius * 0.7})`}>
            <circle r="8" fill={Math.abs(node.balanceFactor) > 1 ? '#ef4444' : '#111827'} stroke="none" />
            <text dy=".35em" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
              {node.balanceFactor > 0 ? '+' : ''}{node.balanceFactor}
            </text>
          </g>
        </>
      )}
    </motion.g>
  );
};