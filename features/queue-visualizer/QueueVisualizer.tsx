import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import { useQueue } from './hooks/useQueue';
import { QueueCanvas } from './components/QueueCanvas';
import { QueueControls } from './components/QueueControls';
import { QueueSidebar } from './components/QueueSidebar';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
import { ChatPanel } from '../ai-tutor/ChatPanel';

interface QueueVisualizerProps {
  onBack: () => void;
}

export const QueueVisualizer: React.FC<QueueVisualizerProps> = ({ onBack }) => {
  const { 
    items,
    circularBuffer,
    head,
    tail,
    mode,
    changeMode,
    operation,
    message,
    peekIndex,
    enqueue,
    dequeue,
    peek,
    clear,
    scenarios
  } = useQueue();

  const isBusy = operation !== 'idle';

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      
      {/* 
        Layout Fix: 
        - Remove overflow-hidden on mobile to allow window scrolling to reach sidebar.
        - lg:h-screen lg:overflow-hidden locks layout on desktop for 'app' feel.
      */}
      <div className="flex-1 flex flex-col lg:flex-row pt-16 lg:h-screen lg:overflow-hidden">
        
        {/* Main Area */}
        <main className="flex-1 flex flex-col relative min-h-[calc(100vh-4rem)] lg:min-h-0 lg:h-auto overflow-y-auto lg:overflow-hidden">
          
          {/* Top Bar */}
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800 bg-gray-900/50 backdrop-blur gap-4 shrink-0 z-10">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={onBack} className="rounded-full w-10 h-10 p-0 flex items-center justify-center shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Queue Operations</h1>
              </div>
            </div>
            
            {/* Scenarios */}
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={scenarios.print} disabled={isBusy}>
                <PlayCircle className="w-4 h-4 mr-2" /> Print Jobs
              </Button>
              <Button size="sm" variant="secondary" onClick={scenarios.restaurant} disabled={isBusy}>
                <PlayCircle className="w-4 h-4 mr-2" /> Restaurant
              </Button>
              <Button size="sm" variant="secondary" onClick={scenarios.bfs} disabled={isBusy}>
                <PlayCircle className="w-4 h-4 mr-2" /> BFS Preview
              </Button>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-gray-900 relative">
            
            {/* Controls Overlay */}
            <div className="w-full max-w-3xl mx-auto p-4 z-20 shrink-0">
              <QueueControls 
                onEnqueue={enqueue}
                onDequeue={dequeue}
                onPeek={peek}
                onClear={clear}
                mode={mode}
                onModeChange={changeMode}
                operation={operation}
              />
            </div>

            {/* Canvas Area */}
            {/* overflow-auto ensures content can be scrolled if it exceeds view on small screens */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-auto relative min-h-[300px]">
              
              {/* Message Toast */}
              <div className="absolute top-4 left-0 right-0 text-center pointer-events-none z-30">
                <motion.div
                  key={message}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`
                    inline-block px-6 py-2 rounded-full border shadow-xl backdrop-blur font-medium text-sm
                    ${message.includes("Overflow") || message.includes("Underflow") ? 'bg-red-900/80 border-red-500 text-red-200 animate-shake' : 'bg-gray-800/80 border-gray-600 text-gray-200'}
                  `}
                >
                  {message}
                </motion.div>
              </div>

              <div className="w-full max-w-4xl flex justify-center">
                <QueueCanvas 
                  items={items}
                  circularBuffer={circularBuffer}
                  head={head}
                  tail={tail}
                  mode={mode}
                  peekIndex={peekIndex}
                />
              </div>
            </div>
          </div>
        </main>

        <QueueSidebar mode={mode} />

        <ChatPanel 
          context={`Queue Data Structure. Current Mode: ${mode}. FIFO (First In, First Out). Operations: Enqueue (add to back), Dequeue (remove from front), Peek. Circular queues reuse empty slots. Priority queues order by importance.`} 
          onHighlightNode={(val) => enqueue(val.toString())} 
        />
      </div>
    </div>
  );
};