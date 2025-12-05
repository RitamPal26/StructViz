import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { QueueItem } from './QueueItem';
import { QueueItem as IQueueItem, QueueMode } from '../types';

interface QueueCanvasProps {
  items: IQueueItem[];
  circularBuffer: (IQueueItem | null)[];
  head: number;
  tail: number;
  mode: QueueMode;
  peekIndex: number | null;
}

export const QueueCanvas: React.FC<QueueCanvasProps> = ({
  items,
  circularBuffer,
  head,
  tail,
  mode,
  peekIndex
}) => {
  // --- LINEAR MODE (Simple & Priority) ---
  if (mode !== 'circular') {
    return (
      <div className="w-full h-64 sm:h-80 bg-gray-900 rounded-xl border border-gray-800 relative overflow-hidden flex items-center justify-center">
        {/* Conveyor Belt Background Animation */}
        <div className="absolute inset-0 opacity-20"
             style={{
               backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, #4b5563 40px, #4b5563 41px)',
               animation: 'conveyor 2s linear infinite'
             }}
        />
        <style>{`
          @keyframes conveyor {
            from { background-position: 0 0; }
            to { background-position: 41px 0; }
          }
        `}</style>
        
        {/* Shadow under belt */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-24 bg-gray-950/50 border-y border-gray-800" />

        {/* Items */}
        <div className="flex items-center space-x-4 z-10 px-8 overflow-x-auto max-w-full">
          <AnimatePresence mode='popLayout'>
            {items.map((item, index) => (
              <QueueItem
                key={item.id}
                item={item}
                index={index}
                isHead={index === 0}
                isTail={index === items.length - 1}
                mode={mode}
                isPeeking={index === peekIndex}
              />
            ))}
          </AnimatePresence>
          
          {items.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-gray-500 font-mono text-sm"
            >
              Queue is empty
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // --- CIRCULAR MODE ---
  // Using a circular arrangement
  const RADIUS = 140; // px
  // CENTER_X/Y are relative to the container size below
  
  return (
    <div className="w-full h-[400px] bg-gray-900 rounded-xl border border-gray-800 relative overflow-hidden flex items-center justify-center">
      {/* 
        Fix: Added scale-75 sm:scale-100 to fit 500px width on small mobile screens.
        origin-center keeps it centered when scaled.
      */}
      <div className="relative w-[500px] h-[400px] flex items-center justify-center scale-75 sm:scale-100 origin-center transition-transform">
        
        {/* Connection Ring */}
        <div className="absolute w-[280px] h-[280px] rounded-full border-2 border-dashed border-gray-700 opacity-50" />
        
        {/* Arrow for wrap-around indication */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
             <path d="M 400,200 A 150,150 0 1,1 400,199" fill="none" stroke="white" strokeWidth="2" strokeDasharray="10,10" />
        </svg>

        {circularBuffer.map((item, index) => {
          const angle = (index / circularBuffer.length) * 2 * Math.PI - Math.PI / 2; // Start at top
          const x = Math.cos(angle) * RADIUS;
          const y = Math.sin(angle) * RADIUS;

          return (
            <div 
              key={index}
              className="absolute"
              style={{ transform: `translate(${x}px, ${y}px)` }}
            >
              {/* Empty Slot Placeholder */}
              <div className="absolute inset-0 w-20 h-24 sm:w-24 sm:h-32 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-dashed border-gray-700 flex items-center justify-center z-0">
                <span className="text-gray-700 text-xs font-mono">{index}</span>
              </div>

              {/* Actual Item */}
              <div className="-translate-x-1/2 -translate-y-1/2 relative z-10">
                <AnimatePresence mode="wait">
                  {item && (
                    <QueueItem
                      key={item.id}
                      item={item}
                      index={index}
                      circularIndex={index}
                      isHead={index === head}
                      isTail={index === tail}
                      mode="circular"
                      isPeeking={index === peekIndex}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
        
        {/* Center Label */}
        <div className="absolute z-0 text-center">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-widest">Circular<br/>Buffer</h3>
          <div className="text-xs text-gray-600 mt-1">Size: {circularBuffer.length}</div>
        </div>
      </div>
    </div>
  );
};
