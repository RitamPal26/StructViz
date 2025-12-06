import React from 'react';
import { Bucket, CollisionMethod } from '../types';
import { HashBucket } from './HashBucket';
import { motion } from 'framer-motion';

interface HashCanvasProps {
  buckets: Bucket[];
  method: CollisionMethod;
  activeBucketIndex: number | null;
  collisionIndex: number | null;
}

export const HashCanvas: React.FC<HashCanvasProps> = ({ buckets, method, activeBucketIndex, collisionIndex }) => {
  return (
    <div className="w-full h-full bg-gray-900 border border-gray-800 rounded-xl p-4 overflow-y-auto custom-scrollbar">
      <div className="max-w-3xl mx-auto space-y-2">
        {/* Header Visual */}
        <div className="flex gap-2 mb-4 ml-10 border-b border-gray-800 pb-2">
          <span className="text-xs font-mono text-gray-500 w-14 text-center">Index</span>
          <span className="text-xs font-mono text-gray-500">
             {method === 'chaining' ? 'Linked Chain' : 'Stored Item'}
          </span>
        </div>

        {buckets.map((bucket) => (
          <HashBucket 
            key={bucket.index} 
            bucket={bucket} 
            method={method}
            isActive={activeBucketIndex === bucket.index}
            isCollision={collisionIndex === bucket.index}
          />
        ))}

        {buckets.length === 0 && (
          <div className="text-center text-gray-500 py-10 italic">
            Table is initializing...
          </div>
        )}
      </div>
    </div>
  );
};
