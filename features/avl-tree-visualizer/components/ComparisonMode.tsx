import React from 'react';
import { VisualAVLNode, VisualEdge, ComparisonStats } from '../types';
import { AVLCanvas } from './AVLCanvas';
import { Scale, AlertTriangle } from 'lucide-react';

interface ComparisonModeProps {
  avlNodes: VisualAVLNode[];
  avlEdges: VisualEdge[];
  bstNodes: VisualAVLNode[];
  bstEdges: VisualEdge[];
  stats: ComparisonStats;
}

export const ComparisonMode: React.FC<ComparisonModeProps> = ({ avlNodes, avlEdges, bstNodes, bstEdges, stats }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
      
      {/* AVL View */}
      <div className="bg-gray-800 rounded-xl p-4 border border-green-900/50 relative">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-green-400 flex items-center">
            <Scale className="w-4 h-4 mr-2" /> AVL Tree
          </h3>
          <div className="text-xs text-gray-400">Height: <span className="text-white font-mono">{stats.avlHeight}</span></div>
        </div>
        <AVLCanvas nodes={avlNodes} edges={avlEdges} height={300} mini={true} />
        <div className="absolute bottom-4 right-4 bg-black/50 px-2 py-1 rounded text-xs text-gray-300">
          Rotations: {stats.avlRotations}
        </div>
      </div>

      {/* BST View */}
      <div className="bg-gray-800 rounded-xl p-4 border border-red-900/50">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-red-400 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" /> Standard BST
          </h3>
          <div className="text-xs text-gray-400">Height: <span className="text-white font-mono">{stats.bstHeight}</span></div>
        </div>
        <AVLCanvas nodes={bstNodes} edges={bstEdges} height={300} mini={true} />
        {stats.bstHeight > stats.avlHeight + 2 && (
          <div className="mt-2 text-xs text-red-300 bg-red-900/20 p-2 rounded text-center">
            Warning: Tree is becoming skewed (O(n) search time)
          </div>
        )}
      </div>

    </div>
  );
};