import React from 'react';
import { Grid3x3, RotateCw, Search, Target } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <div className="w-full lg:w-80 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto lg:h-[calc(100vh-4rem)]">
      <div className="space-y-8">
        
        <section>
          <div className="flex items-center space-x-2 text-primary-400 mb-4">
            <Grid3x3 className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Matrix Algorithms</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Matrices (2D arrays) are fundamental in computer graphics, pathfinding, and machine learning.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">Techniques</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
              <div className="flex items-center space-x-2 mb-2 text-blue-400">
                <RotateCw className="w-4 h-4" />
                <span className="font-semibold text-sm">In-Place Rotation</span>
              </div>
              <p className="text-xs text-gray-500">
                Rotating an image by 90° without extra space. Typically done by transposing, then reversing rows.
              </p>
            </div>

            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
              <div className="flex items-center space-x-2 mb-2 text-green-400">
                <Search className="w-4 h-4" />
                <span className="font-semibold text-sm">Staircase Search</span>
              </div>
              <p className="text-xs text-gray-500">
                Searching in a row/col sorted matrix. Start at top-right. Go left if too large, down if too small. O(R+C).
              </p>
            </div>

            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
              <div className="flex items-center space-x-2 mb-2 text-red-400">
                <Target className="w-4 h-4" />
                <span className="font-semibold text-sm">Set Matrix Zeroes</span>
              </div>
              <p className="text-xs text-gray-500">
                Using the first row and column as flags to achieve O(1) space complexity when marking zeroes.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};