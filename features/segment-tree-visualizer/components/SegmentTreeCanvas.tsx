import React from 'react';
import { SegmentNode } from '../types';
import { SegmentTreeNode } from './SegmentTreeNode';
import { motion, AnimatePresence } from 'framer-motion';

interface SegmentTreeCanvasProps {
  nodes: SegmentNode[];
}

export const SegmentTreeCanvas: React.FC<SegmentTreeCanvasProps> = ({ nodes }) => {
  return (
    <div className="w-full h-full bg-gray-900 border border-gray-800 rounded-xl overflow-auto shadow-inner custom-scrollbar relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', 
             backgroundSize: '20px 20px',
             width: '200%',
             height: '200%'
           }} 
      />
      
      <svg 
        className="w-full h-full min-w-[1000px] min-h-[600px]"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMin meet"
      >
        <AnimatePresence>
          {/* Edges */}
          {nodes.map(node => {
            const leftChild = nodes.find(n => n.index === 2 * node.index);
            const rightChild = nodes.find(n => n.index === 2 * node.index + 1);
            
            return (
              <g key={`edges-${node.index}`}>
                {leftChild && (
                  <motion.line
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    x1={node.x} y1={node.y + 20}
                    x2={leftChild.x} y2={leftChild.y - 20}
                    stroke="#4b5563"
                    strokeWidth="2"
                  />
                )}
                {rightChild && (
                  <motion.line
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    x1={node.x} y1={node.y + 20}
                    x2={rightChild.x} y2={rightChild.y - 20}
                    stroke="#4b5563"
                    strokeWidth="2"
                  />
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map(node => (
            <SegmentTreeNode key={node.index} node={node} />
          ))}
        </AnimatePresence>
      </svg>
    </div>
  );
};