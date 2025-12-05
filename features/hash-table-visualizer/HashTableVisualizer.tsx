import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import { useHashTable } from './hooks/useHashTable';
import { HashCanvas } from './components/HashCanvas';
import { ControlPanel } from './components/ControlPanel';
import { Sidebar } from './components/Sidebar';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
import { ChatPanel } from '../ai-tutor/ChatPanel';

interface HashTableVisualizerProps {
  onBack: () => void;
}

export const HashTableVisualizer: React.FC<HashTableVisualizerProps> = ({ onBack }) => {
  const { 
    buckets, 
    tableSize, 
    itemsCount,
    loadFactor, 
    method, 
    setMethod, 
    operation, 
    message,
    insert,
    search,
    deleteItem,
    reset,
    rehash
  } = useHashTable();

  // Demo Scenarios
  const runCollisionDemo = async () => {
    reset();
    await new Promise(r => setTimeout(r, 500));
    // Keys that likely collide modulo 10: 10, 20, 30 if hash is numeric
    // Or for strings: "abc", "bac" might have different hashes, but let's use integers as strings for clarity if logic supports it.
    // Our hash function supports numeric string parsing.
    insert("15", "Apple");
    setTimeout(() => insert("25", "Banana"), 1500); // 15%10=5, 25%10=5
    setTimeout(() => insert("35", "Cherry"), 3000);
  };

  const runDictionaryDemo = async () => {
    reset();
    await new Promise(r => setTimeout(r, 500));
    const words = [
      {k: "cat", v: "meow"},
      {k: "dog", v: "woof"},
      {k: "owl", v: "hoot"},
      {k: "cow", v: "moo"}
    ];
    let delay = 0;
    for(const w of words) {
      setTimeout(() => insert(w.k, w.v), delay);
      delay += 1500;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      
      {/* Layout Fix */}
      <div className="flex-1 flex flex-col lg:flex-row pt-16 lg:h-screen lg:overflow-hidden">
        
        {/* Main Area */}
        <main className="flex-1 flex flex-col relative min-h-[calc(100vh-4rem)] lg:min-h-0 lg:h-auto overflow-y-auto lg:overflow-hidden">
          
          {/* Top Bar */}
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800 bg-gray-900/50 backdrop-blur gap-4 shrink-0 z-10">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={onBack} className="rounded-full w-10 h-10 p-0 flex items-center justify-center shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl sm:text-2xl font-bold">Hash Table</h1>
            </div>
            
            {/* Scenarios */}
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={runCollisionDemo} disabled={operation !== 'idle'}>
                <PlayCircle className="w-4 h-4 mr-2" /> Collision Demo
              </Button>
              <Button size="sm" variant="secondary" onClick={runDictionaryDemo} disabled={operation !== 'idle'}>
                <PlayCircle className="w-4 h-4 mr-2" /> Dict Demo
              </Button>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-gray-900 relative">
            
            {/* Controls Overlay */}
            <div className="w-full max-w-2xl mx-auto p-4 z-20 shrink-0">
              <ControlPanel 
                onInsert={insert}
                onSearch={search}
                onDelete={deleteItem}
                onReset={reset}
                method={method}
                onMethodChange={setMethod}
                operation={operation}
              />
            </div>

            {/* Canvas Area */}
            <div className="flex-1 p-4 sm:p-8 overflow-auto relative flex flex-col min-h-[300px]">
              
              {/* Message Toast */}
              <div className="text-center mb-4 min-h-[30px]">
                <motion.div
                  key={message}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-block px-4 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-sm font-medium text-primary-300"
                >
                  {message}
                </motion.div>
              </div>

              <div className="flex-1 overflow-auto relative rounded-xl border border-gray-800 bg-gray-950/50">
                <HashCanvas buckets={buckets} method={method} />
              </div>
            </div>
          </div>
        </main>

        <Sidebar 
          itemsCount={itemsCount}
          tableSize={tableSize}
          loadFactor={loadFactor}
          onRehash={rehash}
          isBusy={operation !== 'idle'}
        />

        <ChatPanel 
          context={`Hash Table. Method: ${method === 'chaining' ? 'Chaining' : 'Linear Probing'}. Load Factor: ${loadFactor.toFixed(2)}.`} 
          onHighlightNode={() => {}} 
        />
      </div>
    </div>
  );
};
