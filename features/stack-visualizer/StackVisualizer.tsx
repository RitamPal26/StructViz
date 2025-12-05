import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import { useStack } from './hooks/useStack';
import { StackBlock } from './components/StackBlock';
import { StackControls } from './components/StackControls';
import { StackSidebar } from './components/StackSidebar';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
import { ChatPanel } from '../ai-tutor/ChatPanel';

interface StackVisualizerProps {
  onBack: () => void;
}

export const StackVisualizer: React.FC<StackVisualizerProps> = ({ onBack }) => {
  const { 
    stack, 
    operation, 
    message, 
    peekIndex,
    push, 
    pop, 
    peek, 
    clear,
    scenarios 
  } = useStack();

  const isBusy = operation !== 'idle';

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      
      <div className="flex-1 flex flex-col lg:flex-row pt-16 overflow-hidden">
        
        {/* Main Canvas Area */}
        <main className="flex-1 flex flex-col relative h-[calc(100vh-4rem)] overflow-y-auto lg:overflow-hidden">
          
          {/* Header Bar */}
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800 bg-gray-900/50 backdrop-blur gap-4 shrink-0 z-10">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={onBack} className="rounded-full w-10 h-10 p-0 flex items-center justify-center shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl sm:text-2xl font-bold">Stack Operations</h1>
            </div>
            
            {/* Scenarios */}
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={scenarios.browser} disabled={isBusy}>
                <PlayCircle className="w-4 h-4 mr-2" /> Browser
              </Button>
              <Button size="sm" variant="secondary" onClick={scenarios.recursion} disabled={isBusy}>
                <PlayCircle className="w-4 h-4 mr-2" /> Recursion
              </Button>
              <Button size="sm" variant="secondary" onClick={scenarios.parentheses} disabled={isBusy}>
                <PlayCircle className="w-4 h-4 mr-2" /> ( ) Balance
              </Button>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-gray-900 relative">
            
            {/* Controls Overlay (Top Center) */}
            <div className="w-full max-w-2xl mx-auto p-4 z-20">
              <StackControls 
                onPush={push}
                onPop={pop}
                onPeek={peek}
                onClear={clear}
                operation={operation}
              />
            </div>

            {/* Canvas */}
            <div className="flex-1 flex items-end justify-center pb-8 overflow-hidden relative">
              
              {/* Message Toast */}
              <div className="absolute top-4 left-0 right-0 text-center pointer-events-none">
                <motion.div
                  key={message}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`
                    inline-block px-6 py-2 rounded-full border shadow-xl backdrop-blur font-medium text-sm
                    ${operation === 'overflow' ? 'bg-red-900/80 border-red-500 text-red-200 animate-shake' : ''}
                    ${operation === 'success' ? 'bg-green-900/80 border-green-500 text-green-200' : ''}
                    ${['idle', 'pushing', 'popping', 'peeking'].includes(operation) ? 'bg-gray-800/80 border-gray-600 text-gray-200' : ''}
                  `}
                >
                  {message}
                </motion.div>
              </div>

              {/* Stack Container */}
              <div className={`
                flex flex-col-reverse items-center gap-2 p-8 min-w-[300px] rounded-t-2xl border-x-2 border-t-0 border-gray-700 bg-gray-900/50 relative
                ${operation === 'overflow' ? 'animate-shake border-red-500/50' : ''}
              `}>
                 {/* Base of Stack */}
                <div className="absolute bottom-0 w-full h-1 bg-gray-700" />
                
                <AnimatePresence mode="popLayout">
                  {stack.map((item, index) => (
                    <StackBlock 
                      key={item.id}
                      item={item}
                      index={index}
                      isTop={index === stack.length - 1}
                      isPeeking={index === peekIndex}
                    />
                  ))}
                </AnimatePresence>

                {stack.length === 0 && (
                  <div className="h-32 flex items-center justify-center text-gray-600 font-mono text-sm italic">
                    Stack is empty
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <StackSidebar />

        <ChatPanel 
          context="Stack Data Structure (LIFO)" 
          onHighlightNode={(val) => push(val.toString())} 
        />
      </div>
    </div>
  );
};
