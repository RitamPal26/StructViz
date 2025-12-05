import React from 'react';
import { motion } from 'framer-motion';
import { GraphNode as IGraphNode } from '../types';

interface GraphNodeProps {
  node: IGraphNode;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onClick: (e: React.MouseEvent) => void;
  onRightClick: (e: React.MouseEvent) => void;
}

export const GraphNode: React.FC<GraphNodeProps> = ({ 
  node, 
  isSelected, 
  onMouseDown, 
  onClick,
  onRightClick 
}) => {
  const getColors = () => {
    switch (node.state) {
      case 'start': return { fill: '#22c55e', stroke: '#15803d' }; // Green
      case 'target': return { fill: '#ef4444', stroke: '#b91c1c' }; // Red
      case 'current': return { fill: '#3b82f6', stroke: '#1d4ed8' }; // Blue
      case 'visited': return { fill: '#60a5fa', stroke: '#2563eb' }; // Light Blue
      case 'queued': return { fill: '#eab308', stroke: '#a16207' }; // Yellow
      default: return { fill: '#1f2937', stroke: isSelected ? '#38bdf8' : '#4b5563' }; // Gray
    }
  };

  const colors = getColors();
  const radius = 25;

  return (
    <motion.g
      initial={{ scale: 0 }}
      animate={{ 
        x: node.x, 
        y: node.y, 
        scale: 1 
      }}
      className="cursor-pointer"
      onMouseDown={onMouseDown}
      onClick={onClick}
      onContextMenu={onRightClick}
    >
      {/* Selection Halo */}
      {isSelected && (
        <circle r={radius + 4} fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" className="animate-spin-slow" />
      )}

      {/* Main Circle */}
      <motion.circle
        r={radius}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={isSelected ? 3 : 2}
        animate={{ fill: colors.fill, stroke: colors.stroke }}
        whileHover={{ scale: 1.1 }}
      />

      {/* Label */}
      <text
        dy=".35em"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="bold"
        className="pointer-events-none select-none"
      >
        {node.label}
      </text>

      {/* Distance Label (Dijkstra) */}
      {node.distance !== undefined && node.distance !== Infinity && (
        <g transform={`translate(0, -${radius + 12})`}>
          <rect x="-15" y="-10" width="30" height="16" rx="4" fill="#000" opacity="0.7" />
          <text textAnchor="middle" fill="#fbbf24" fontSize="10" dy="2">{node.distance}</text>
        </g>
      )}
    </motion.g>
  );
};
