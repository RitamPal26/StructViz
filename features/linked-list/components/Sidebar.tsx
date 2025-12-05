import React from 'react';
import { BookOpen, Chrome, Code2 } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <div className="w-full lg:w-80 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto lg:h-[calc(100vh-4rem)]">
      <div className="space-y-8">
        
        {/* Real World Application */}
        <section>
          <div className="flex items-center space-x-2 text-primary-400 mb-4">
            <Chrome className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Real-World Context</h3>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-medium mb-2">Browser History</h4>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Your web browser uses a Doubly Linked List to manage your history.
            </p>
            <div className="flex items-center justify-between px-2 py-3 bg-gray-800 rounded border border-gray-700 mb-2">
              <span className="text-xs text-gray-500">google.com</span>
              <span className="text-xs text-primary-400">Current</span>
              <span className="text-xs text-gray-500">github.com</span>
            </div>
            <p className="text-xs text-gray-500">
              Clicking "Back" moves the pointer to the <code>prev</code> node.
            </p>
          </div>
        </section>

        {/* Code Snippet */}
        <section>
          <div className="flex items-center space-x-2 text-indigo-400 mb-4">
            <Code2 className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Algorithm (Reverse)</h3>
          </div>
          <div className="bg-gray-950 rounded-lg p-4 font-mono text-xs text-gray-300 overflow-x-auto border border-gray-900">
<pre>{`function reverse(head) {
  let prev = null;
  let curr = head;
  
  while (curr !== null) {
    let next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`}</pre>
          </div>
        </section>

        {/* Quick Facts */}
        <section>
          <div className="flex items-center space-x-2 text-emerald-400 mb-4">
            <BookOpen className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Key Concepts</h3>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 mr-2 shrink-0"></span>
              <span className="text-sm text-gray-400">Dynamic size (unlike arrays)</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 mr-2 shrink-0"></span>
              <span className="text-sm text-gray-400">O(1) Insert/Delete at head</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 mr-2 shrink-0"></span>
              <span className="text-sm text-gray-400">O(n) Access time (sequential)</span>
            </li>
          </ul>
        </section>

      </div>
    </div>
  );
};
