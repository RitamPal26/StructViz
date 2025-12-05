import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { TreeNode } from './TreeNode';
import { TreeEdge } from './TreeEdge';
import { VisualNode, VisualEdge } from '../types';

interface TreeCanvasProps {
  nodes: VisualNode[];
  edges: VisualEdge[];
}

export const TreeCanvas: React.FC<TreeCanvasProps> = ({ nodes, edges }) => {
  return (
    <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px] bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-inner relative">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10" 
           style={{ 
             backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', 
             backgroundSize: '20px 20px' 
           }} 
      />

      <svg 
        className="w-full h-full relative z-10"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMin meet"
      >
        <AnimatePresence>
          {edges.map((edge) => (
            <TreeEdge key={edge.id} edge={edge} />
          ))}
        </AnimatePresence>
        
        <AnimatePresence>
          {nodes.map((node) => (
            <TreeNode key={node.id} node={node} />
          ))}
        </AnimatePresence>
      </svg>
    </div>
  );
};
