import React from 'react';
import { motion } from 'framer-motion';
import { GraphEdge as IGraphEdge, GraphNode } from '../types';

interface GraphEdgeProps {
  edge: IGraphEdge;
  source: GraphNode;
  target: GraphNode;
}

export const GraphEdge: React.FC<GraphEdgeProps> = ({ edge, source, target }) => {
  if (!source || !target) return null;

  const isTraversed = edge.state === 'traversed';
  
  // Calculate center for weight label
  const midX = (source.x + target.x) / 2;
  const midY = (source.y + target.y) / 2;

  return (
    <g>
      <motion.line
        x1={source.x}
        y1={source.y}
        x2={target.x}
        y2={target.y}
        stroke={isTraversed ? '#fbbf24' : '#4b5563'}
        strokeWidth={isTraversed ? 4 : 2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1, stroke: isTraversed ? '#fbbf24' : '#4b5563' }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Weight Label Background */}
      <circle cx={midX} cy={midY} r="10" fill="#111827" stroke="#374151" strokeWidth="1" />
      
      {/* Weight Text */}
      <text
        x={midX}
        y={midY}
        dy=".3em"
        textAnchor="middle"
        fill="#9ca3af"
        fontSize="10"
        className="select-none pointer-events-none font-mono"
      >
        {edge.weight}
      </text>
    </g>
  );
};
