import React from 'react';
import { VisualTrieNode, VisualTrieEdge } from '../types';
import { TrieNode } from './TrieNode';
import { TrieEdge } from './TrieEdge';
import { motion, AnimatePresence } from 'framer-motion';

interface TrieCanvasProps {
  nodes: VisualTrieNode[];
  edges: VisualTrieEdge[];
}

export const TrieCanvas: React.FC<TrieCanvasProps> = ({ nodes, edges }) => {
  // Calculate bounding box to center the view
  const minX = Math.min(...nodes.map(n => n.x), -300);
  const maxX = Math.max(...nodes.map(n => n.x), 300);
  const width = Math.max(maxX - minX + 100, 800);
  const centerX = width / 2;
  const offsetX = centerX - ((maxX + minX) / 2); // Shift logic

  return (
    <div className="w-full h-[400px] sm:h-[500px] bg-gray-900 border border-gray-800 rounded-xl overflow-auto shadow-inner custom-scrollbar relative">
       {/* Background Grid */}
       <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', 
             backgroundSize: '20px 20px',
             width: '200%', // ensure coverage
             height: '200%'
           }} 
      />
      
      <motion.svg 
        className="w-full h-full min-w-[800px]"
        viewBox={`${minX - 50} 0 ${width} 600`}
        preserveAspectRatio="xMidYMin meet"
      >
        <AnimatePresence>
          {edges.map(edge => (
            <TrieEdge key={edge.id} edge={edge} />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {nodes.map(node => (
            <TrieNode key={node.id} node={node} />
          ))}
        </AnimatePresence>
      </motion.svg>

      {nodes.length === 1 && (
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm pointer-events-none">
           Empty Trie
         </div>
      )}
    </div>
  );
};