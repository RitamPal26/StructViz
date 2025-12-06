import React from 'react';
import { GitMerge, Search, Type } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <div className="w-full lg:w-80 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto lg:h-[calc(100vh-4rem)]">
      <div className="space-y-8">
        
        {/* Definition */}
        <section>
          <div className="flex items-center space-x-2 text-primary-400 mb-4">
            <GitMerge className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Concept</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            A <strong>Trie</strong> (Prefix Tree) is a tree-like data structure used to efficiently store and retrieve keys in a dataset of strings.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Each node represents a character. The path from the root to a node represents a prefix or a complete word.
          </p>
        </section>

        {/* Use Cases */}
        <section>
          <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">Real-World Applications</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
              <div className="flex items-center space-x-2 mb-2 text-green-400">
                <Type className="w-4 h-4" />
                <span className="font-semibold text-sm">Autocomplete</span>
              </div>
              <p className="text-xs text-gray-500">
                Quickly finding all words that start with a user's input prefix.
              </p>
            </div>

            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
              <div className="flex items-center space-x-2 mb-2 text-blue-400">
                <Search className="w-4 h-4" />
                <span className="font-semibold text-sm">Spell Checkers</span>
              </div>
              <p className="text-xs text-gray-500">
                Checking if a word exists in a dictionary and finding similar words.
              </p>
            </div>
          </div>
        </section>

        {/* Complexity */}
        <section className="bg-gray-950 p-4 rounded-lg border border-gray-900">
          <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Time Complexity</h4>
          <div className="flex justify-between text-xs text-gray-300 font-mono mb-1">
            <span>Insert</span>
            <span className="text-green-400">O(L)</span>
          </div>
          <div className="flex justify-between text-xs text-gray-300 font-mono mb-1">
            <span>Search</span>
            <span className="text-green-400">O(L)</span>
          </div>
          <div className="text-[10px] text-gray-500 mt-2 italic">where L is word length</div>
        </section>

      </div>
    </div>
  );
};