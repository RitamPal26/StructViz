import React from 'react';
import { Triangle, Activity, ArrowUpNarrowWide } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <div className="w-full lg:w-80 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto lg:h-[calc(100vh-4rem)]">
      <div className="space-y-8">
        
        {/* Definition */}
        <section>
          <div className="flex items-center space-x-2 text-primary-400 mb-4">
            <Triangle className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Concept</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            A <strong>Heap</strong> is a specialized tree-based data structure that satisfies the heap property.
          </p>
          <div className="bg-gray-900/50 rounded p-3 border border-gray-700 text-xs space-y-2">
            <div>
              <span className="text-blue-400 font-bold">Min Heap:</span> Parent ≤ Children. Root is minimum.
            </div>
            <div>
              <span className="text-orange-400 font-bold">Max Heap:</span> Parent ≥ Children. Root is maximum.
            </div>
          </div>
        </section>

        {/* Real World Uses */}
        <section>
          <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">Real-World Applications</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
              <div className="flex items-center space-x-2 mb-2 text-red-400">
                <Activity className="w-4 h-4" />
                <span className="font-semibold text-sm">Emergency Room Triage</span>
              </div>
              <p className="text-xs text-gray-500">
                Patients are treated based on severity (priority), not arrival time. A Max Heap efficiently manages this queue.
              </p>
            </div>

            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
              <div className="flex items-center space-x-2 mb-2 text-indigo-400">
                <ArrowUpNarrowWide className="w-4 h-4" />
                <span className="font-semibold text-sm">Sorting Algorithms</span>
              </div>
              <p className="text-xs text-gray-500">
                Heap Sort uses a heap to sort elements in O(n log n) time with O(1) extra space.
              </p>
            </div>
          </div>
        </section>

        {/* Complexity */}
        <section className="bg-gray-950 p-4 rounded-lg border border-gray-900">
          <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Time Complexity</h4>
          <div className="flex justify-between text-xs text-gray-300 font-mono mb-1">
            <span>Insert</span>
            <span className="text-green-400">O(log n)</span>
          </div>
          <div className="flex justify-between text-xs text-gray-300 font-mono mb-1">
            <span>Extract Root</span>
            <span className="text-green-400">O(log n)</span>
          </div>
          <div className="flex justify-between text-xs text-gray-300 font-mono">
            <span>Peek</span>
            <span className="text-green-400">O(1)</span>
          </div>
        </section>

      </div>
    </div>
  );
};
