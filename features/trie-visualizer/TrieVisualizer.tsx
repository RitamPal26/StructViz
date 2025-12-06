import React, { useEffect } from 'react';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import { useTrie } from './hooks/useTrie';
import { TrieCanvas } from './components/TrieCanvas';
import { ControlPanel } from './components/ControlPanel';
import { Sidebar } from './components/Sidebar';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
import { ChatPanel } from '../ai-tutor/ChatPanel';
import { MobileLandscapeAlert } from '../../shared/components/MobileLandscapeAlert';
import { motion } from 'framer-motion';

interface TrieVisualizerProps {
  onBack: () => void;
}

export const TrieVisualizer: React.FC<TrieVisualizerProps> = ({ onBack }) => {
  const { 
    visualNodes, 
    visualEdges, 
    operation, 
    message, 
    insert, 
    search, 
    startsWith, 
    reset,
    buildTree,
    speed,
    setSpeed
  } = useTrie();

  // Initial Demo Data
  useEffect(() => {
    const init = async () => {
      await new Promise(r => setTimeout(r, 500));
      buildTree(['cat', 'car', 'cart', 'dog', 'done']);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runDemo = () => {
    buildTree(['algo', 'algorithm', 'ant', 'bat', 'ball', 'batman']);
  };

  const processAIInput = (words: number[] | string[]) => {
      // AI usually returns numbers for trees, but for trie we need strings.
      // If AI returns numbers (from analyzeStructureImage), convert to string?
      // Or we can just filter strings.
      // Let's assume onBuildStructure passes raw data, but our interface expects number[] currently in ChatPanel
      // We will need to update ChatPanel interface ideally, but for now we cast or handle.
      const stringWords = words.map(w => w.toString());
      buildTree(stringWords);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      <MobileLandscapeAlert />
      
      <div className="flex-1 flex flex-col lg:flex-row pt-16 lg:h-screen lg:overflow-hidden">
        
        {/* Main Area */}
        <main className="flex-1 flex flex-col relative min-h-[calc(100vh-4rem)] lg:min-h-0 lg:h-auto overflow-y-auto lg:overflow-hidden">
          
          {/* Top Bar */}
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800 bg-gray-900/50 backdrop-blur gap-4 shrink-0 z-10">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={onBack} className="rounded-full w-10 h-10 p-0 flex items-center justify-center shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl sm:text-2xl font-bold">Trie (Prefix Tree)</h1>
            </div>
            
            <Button size="sm" variant="secondary" onClick={runDemo}>
               <PlayCircle className="w-4 h-4 mr-2" /> Load Dictionary Demo
            </Button>
          </div>

          <div className="flex-1 flex flex-col bg-gray-900 relative">
            
            {/* Controls Overlay */}
            <div className="w-full max-w-2xl mx-auto p-4 z-20 shrink-0">
              <ControlPanel 
                onInsert={insert}
                onSearch={search}
                onStartsWith={startsWith}
                onReset={reset}
                operation={operation}
              />
            </div>

            {/* Canvas Area */}
            <div className="flex-1 p-4 sm:p-8 overflow-auto relative flex flex-col min-h-[400px]">
              
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

              <div className="flex-1 overflow-hidden relative rounded-xl border border-gray-800 bg-gray-950/50 flex flex-col">
                <TrieCanvas nodes={visualNodes} edges={visualEdges} />
              </div>

              {/* Slider for Speed */}
               <div className="absolute bottom-6 left-6 z-20 bg-gray-900/80 p-2 rounded-lg border border-gray-700">
                  <div className="text-xs text-gray-400 mb-1">Animation Speed</div>
                  <input 
                    type="range" min="100" max="1000" step="100" 
                    value={speed} onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-24 accent-primary-500 h-1" 
                  />
               </div>
            </div>
          </div>
        </main>

        <Sidebar />

        <ChatPanel 
          context="Trie (Prefix Tree). Efficient for string storage. Operations: Insert, Search, StartsWith. Nodes represent characters. Path represents word. Green nodes = End of Word."
          onHighlightNode={(val) => { /* Trie handles strings, not nums */ }}
          onBuildStructure={(values) => processAIInput(values)}
        />
      </div>
    </div>
  );
};