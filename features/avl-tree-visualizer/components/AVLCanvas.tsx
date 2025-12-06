import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { VisualAVLNode, VisualEdge } from '../types';
import { AVLNode } from './AVLNode';

interface AVLCanvasProps {
  nodes: VisualAVLNode[];
  edges: VisualEdge[];
  height?: number;
  mini?: boolean;
}

export const AVLCanvas: React.FC<AVLCanvasProps> = ({ nodes, edges, height = 500, mini = false }) => {
  // Calculate bounding box for dynamic viewBox
  const minX = Math.min(...nodes.map(n => n.x), 0);
  const maxX = Math.max(...nodes.map(n => n.x), 1000);
  
  return (
    <div className={`w-full bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-inner relative ${mini ? 'h-[300px]' : `h-[${height}px]`}`} style={{ height }}>
      {/* Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', 
             backgroundSize: '20px 20px' 
           }} 
      />

      <svg 
        className="w-full h-full"
        viewBox={`${minX - 50} 0 ${maxX - minX + 100} ${mini ? 400 : 600}`}
        preserveAspectRatio="xMidYMin meet"
      >
        <AnimatePresence>
          {edges.map(edge => (
            <motion.line
              key={edge.id}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                x1: edge.x1, y1: edge.y1, x2: edge.x2, y2: edge.y2, 
                pathLength: 1, opacity: 1 
              }}
              stroke="#4b5563"
              strokeWidth={mini ? 1 : 2}
            />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {nodes.map(node => (
            <AVLNode key={node.id} node={node} mini={mini} />
          ))}
        </AnimatePresence>
      </svg>
    </div>
  );
};