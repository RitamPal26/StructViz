import React from 'react';
import { Navigation, Route, Zap, Compass } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <div className="w-full lg:w-80 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto lg:h-[calc(100vh-4rem)]">
      <div className="space-y-8">
        
        <section>
          <div className="flex items-center space-x-2 text-primary-400 mb-4">
            <Navigation className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Algorithms</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
              <div className="flex items-center space-x-2 mb-1 text-yellow-400">
                <Zap className="w-4 h-4" />
                <span className="font-semibold text-sm">Dijkstra</span>
              </div>
              <p className="text-xs text-gray-500">
                The father of pathfinding. Guarantees the shortest path. Expands in all directions equally.
              </p>
            </div>

            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
              <div className="flex items-center space-x-2 mb-1 text-green-400">
                <Compass className="w-4 h-4" />
                <span className="font-semibold text-sm">A* Search</span>
              </div>
              <p className="text-xs text-gray-500">
                Uses heuristics to guide the search towards the target. Usually faster than Dijkstra.
              </p>
            </div>

            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
              <div className="flex items-center space-x-2 mb-1 text-blue-400">
                <Route className="w-4 h-4" />
                <span className="font-semibold text-sm">BFS</span>
              </div>
              <p className="text-xs text-gray-500">
                Breadth-First Search. Good for unweighted graphs. Explores neighbors layer by layer.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">Legend</h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
            <div className="flex items-center"><div className="w-3 h-3 bg-green-500 mr-2 rounded-sm"></div> Start</div>
            <div className="flex items-center"><div className="w-3 h-3 bg-red-500 mr-2 rounded-sm"></div> Target</div>
            <div className="flex items-center"><div className="w-3 h-3 bg-gray-800 border border-gray-600 mr-2 rounded-sm"></div> Wall</div>
            <div className="flex items-center"><div className="w-3 h-3 bg-sky-400 mr-2 rounded-sm"></div> Visited</div>
            <div className="flex items-center"><div className="w-3 h-3 bg-yellow-400 mr-2 rounded-sm"></div> Path</div>
          </div>
        </section>

      </div>
    </div>
  );
};