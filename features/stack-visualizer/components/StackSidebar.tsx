import React from 'react';
import { Layers, RotateCcw, Globe, Code2 } from 'lucide-react';

export const StackSidebar: React.FC = () => {
  return (
    <div className="w-full lg:w-80 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto lg:h-[calc(100vh-4rem)]">
      <div className="space-y-8">
        
        {/* Definition */}
        <section>
          <div className="flex items-center space-x-2 text-primary-400 mb-4">
            <Layers className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Concept</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            A Stack is a linear data structure that follows the <strong>LIFO</strong> (Last In, First Out) principle. 
            Imagine a stack of plates: you can only add or remove the top plate.
          </p>
        </section>

        {/* Code Snippet */}
        <section>
          <div className="flex items-center space-x-2 text-indigo-400 mb-4">
            <Code2 className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Implementation</h3>
          </div>
          <div className="bg-gray-950 rounded-lg p-4 font-mono text-xs text-gray-300 overflow-x-auto border border-gray-900">
<pre>{`class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
}`}</pre>
          </div>
        </section>

        {/* Real World Uses */}
        <section>
          <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">Real-World Examples</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
              <div className="flex items-center space-x-2 mb-2 text-blue-400">
                <Globe className="w-4 h-4" />
                <span className="font-semibold text-sm">Browser History</span>
              </div>
              <p className="text-xs text-gray-500">
                Visiting a page <code>pushes</code> it to history. Clicking Back <code>pops</code> it.
              </p>
            </div>

            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
              <div className="flex items-center space-x-2 mb-2 text-yellow-400">
                <RotateCcw className="w-4 h-4" />
                <span className="font-semibold text-sm">Undo Mechanism</span>
              </div>
              <p className="text-xs text-gray-500">
                Editors store actions in a stack. Undo <code>pops</code> the last action to revert it.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
