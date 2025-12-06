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
    activeBucketIndex,
    collisionIndex,
    message,
    insert,
    search,
    reset,
    
    // Playback
    isPlaying,
    play,
    pause,
    stepForward,
    stepBackward,
    currentStepIndex,
    totalSteps,
    speed,
    setSpeed
  } = useHashTable();

  // Enhanced Collision Demo
  const runCollisionDemo = async () => {
    reset();
    setTimeout(() => {
      // These numbers collide modulo 10 (all end in 5 -> bucket 5)
      // We process them one by one to let the user play/step through each
      insert("5", "First");
      setTimeout(() => insert("15", "Second (Collide)"), 2000);
      setTimeout(() => insert("25", "Third (Collide)"), 4000);
    }, 100);
  };

  const runDictionaryDemo = async () => {
    reset();
    setTimeout(() => {
      const words = [
        {k: "apple", v: "fruit"},
        {k: "apricot", v: "fruit"}, // might collide depending on hash
        {k: "banana", v: "yellow"}
      ];
      let delay = 0;
      for(const w of words) {
        setTimeout(() => insert(w.k, w.v), delay);
        delay += 2500;
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      
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
            
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={runCollisionDemo}>
                <PlayCircle className="w-4 h-4 mr-2" /> Collision Demo
              </Button>
              <Button size="sm" variant="secondary" onClick={runDictionaryDemo}>
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
                onReset={reset}
                method={method}
                onMethodChange={setMethod}
                // Playback
                isPlaying={isPlaying}
                onPlay={play}
                onPause={pause}
                onStepForward={stepForward}
                onStepBackward={stepBackward}
                currentStep={currentStepIndex}
                totalSteps={totalSteps}
                speed={speed}
                onSpeedChange={setSpeed}
                message={message}
              />
            </div>

            {/* Canvas Area */}
            <div className="flex-1 p-4 sm:p-8 overflow-hidden relative flex flex-col min-h-[300px]">
              <div className="flex-1 overflow-hidden relative rounded-xl border border-gray-800 bg-gray-950/50 shadow-inner">
                <HashCanvas 
                  buckets={buckets} 
                  method={method}
                  activeBucketIndex={activeBucketIndex}
                  collisionIndex={collisionIndex}
                />
              </div>
            </div>
          </div>
        </main>

        <Sidebar 
          itemsCount={itemsCount}
          tableSize={tableSize}
          loadFactor={loadFactor}
          onRehash={() => {}} // Rehash visualization is complex, keeping simple for now
          isBusy={isPlaying}
        />

        <ChatPanel 
          context={`Hash Table. Method: ${method === 'chaining' ? 'Chaining' : 'Linear Probing'}. Load Factor: ${loadFactor.toFixed(2)}. Hash function maps keys to indices. Collisions occur when two keys map to the same index.`} 
          onHighlightNode={() => {}} 
        />
      </div>
    </div>
  );
};
