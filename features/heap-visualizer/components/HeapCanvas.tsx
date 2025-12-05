import React from 'react';
import { VisualHeapNode } from '../types';
import { HeapNode } from './HeapNode';
import { HeapEdge } from './HeapEdge';

interface HeapCanvasProps {
  nodes: VisualHeapNode[];
  comparingIndices: number[];
}

export const HeapCanvas: React.FC<HeapCanvasProps> = ({ nodes, comparingIndices }) => {
  return (
    <div className="w-full h-[400px] sm:h-[500px] bg-gray-900 border border-gray-800 rounded-xl overflow-auto shadow-inner relative">
       {/* Background Grid */}
       <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', 
             backgroundSize: '20px 20px',
             minWidth: '1000px'
           }} 
      />
      
      <svg 
        className="w-full h-full min-w-[1000px]"
        viewBox="0 0 1000 500"
        preserveAspectRatio="xMidYMin meet"
      >
        {/* Render Edges first so they are behind nodes */}
        {nodes.map(node => {
          const leftChild = nodes.find(n => n.index === 2 * node.index + 1);
          const rightChild = nodes.find(n => n.index === 2 * node.index + 2);
          
          return (
            <React.Fragment key={`edges-${node.id}`}>
              {leftChild && <HeapEdge x1={node.x} y1={node.y} x2={leftChild.x} y2={leftChild.y} />}
              {rightChild && <HeapEdge x1={node.x} y1={node.y} x2={rightChild.x} y2={rightChild.y} />}
            </React.Fragment>
          );
        })}

        {nodes.map(node => (
          <HeapNode 
            key={node.id} 
            node={node} 
            isComparing={comparingIndices.includes(node.index)}
          />
        ))}
      </svg>
    </div>
  );
};
