import React from 'react';
import { Hexagon, Zap, Repeat, MousePointer2 } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <div className="w-full lg:w-80 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto lg:h-[calc(100vh-4rem)]">
      <div className="space-y-8">
        
        <section>
          <div className="flex items-center space-x-2 text-primary-400 mb-4">
            <Hexagon className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Concept</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            The <strong>Convex Hull</strong> of a set of points is the smallest convex polygon that contains all the points. 
            Imagine stretching a rubber band around the points; the shape it takes is the convex hull.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">Algorithms</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
              <div className="flex items-center space-x-2 mb-2 text-blue-400">
                <Zap className="w-4 h-4" />
                <span className="font-semibold text-sm">Graham Scan</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                Sorts points by polar angle and then iterates, maintaining a stack to remove concavities.
              </p>
              <div className="flex justify-between text-xs text-gray-400 font-mono">
                <span>Time: O(n log n)</span>
              </div>
            </div>

            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
              <div className="flex items-center space-x-2 mb-2 text-green-400">
                <Repeat className="w-4 h-4" />
                <span className="font-semibold text-sm">Jarvis March</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                "Gift Wrapping" algorithm. Finds the next hull point by checking all other points.
              </p>
              <div className="flex justify-between text-xs text-gray-400 font-mono">
                <span>Time: O(nh)</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">Controls</h3>
          <div className="text-sm text-gray-400 space-y-2">
            <div className="flex items-center">
              <MousePointer2 className="w-4 h-4 mr-2" /> Click canvas to add points manually.
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};