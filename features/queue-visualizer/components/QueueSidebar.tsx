import React from 'react';
import { ListEnd, Printer, Repeat, ArrowUpNarrowWide } from 'lucide-react';
import { QueueMode } from '../types';

interface QueueSidebarProps {
  mode: QueueMode;
}

export const QueueSidebar: React.FC<QueueSidebarProps> = ({ mode }) => {
  return (
    <div className="w-full lg:w-80 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto lg:h-[calc(100vh-4rem)]">
      <div className="space-y-8">
        
        {/* Contextual Info based on Mode */}
        <section>
          <div className="flex items-center space-x-2 text-primary-400 mb-4">
            <ListEnd className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wider">
              {mode === 'simple' ? 'FIFO Principle' : mode === 'circular' ? 'Circular Buffer' : 'Priority Logic'}
            </h3>
          </div>
          
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            {mode === 'simple' && "First In, First Out. Elements are added to the rear and removed from the front. Think of a line at a store."}
            {mode === 'circular' && "Connects the end of the queue back to the start to utilize empty space created by dequeuing. Efficient for fixed-size buffers."}
            {mode === 'priority' && "Elements are ordered by importance. High priority items skip the line to be processed first."}
          </p>
        </section>

        {/* Real World Uses */}
        <section>
          <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">Real-World Examples</h3>
          
          <div className="space-y-4">
            {mode === 'simple' && (
              <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                <div className="flex items-center space-x-2 mb-2 text-blue-400">
                  <Printer className="w-4 h-4" />
                  <span className="font-semibold text-sm">Print Spooler</span>
                </div>
                <p className="text-xs text-gray-500">
                  Documents print in the order they were sent.
                </p>
              </div>
            )}

            {mode === 'circular' && (
              <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                <div className="flex items-center space-x-2 mb-2 text-green-400">
                  <Repeat className="w-4 h-4" />
                  <span className="font-semibold text-sm">Traffic Lights / Streaming</span>
                </div>
                <p className="text-xs text-gray-500">
                  Streaming audio buffers reuse memory space continuously.
                </p>
              </div>
            )}

            {mode === 'priority' && (
              <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                <div className="flex items-center space-x-2 mb-2 text-red-400">
                  <ArrowUpNarrowWide className="w-4 h-4" />
                  <span className="font-semibold text-sm">Task Scheduler</span>
                </div>
                <p className="text-xs text-gray-500">
                  OS executes critical system processes before user applications.
                </p>
              </div>
            )}
          </div>
        </section>

         {/* Complexity */}
         <section className="bg-gray-950 p-4 rounded-lg border border-gray-900">
          <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Time Complexity</h4>
          <div className="flex justify-between text-xs text-gray-300 font-mono mb-1">
            <span>Enqueue</span>
            <span className={mode === 'priority' ? 'text-yellow-400' : 'text-green-400'}>
              {mode === 'priority' ? 'O(n)' : 'O(1)'}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-300 font-mono">
            <span>Dequeue</span>
            <span className="text-green-400">O(1)</span>
          </div>
        </section>

      </div>
    </div>
  );
};
