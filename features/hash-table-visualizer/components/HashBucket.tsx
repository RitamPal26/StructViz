import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bucket, CollisionMethod } from '../types';
import { ArrowRight, AlertCircle, Search } from 'lucide-react';

interface HashBucketProps {
  bucket: Bucket;
  method: CollisionMethod;
  isCollision: boolean;
  isActive: boolean;
}

export const HashBucket: React.FC<HashBucketProps> = ({ bucket, method, isCollision, isActive }) => {
  const getBgColor = () => {
    if (isCollision) return 'bg-red-900/40 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]';
    if (bucket.state === 'found') return 'bg-green-900/40 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]';
    if (bucket.state === 'probing') return 'bg-yellow-900/20 border-yellow-600/50';
    if (isActive) return 'bg-primary-900/40 border-primary-500 shadow-[0_0_15px_rgba(56,189,248,0.3)]';
    return 'bg-gray-800 border-gray-700';
  };

  return (
    <motion.div 
      layout
      className={`flex items-start gap-3 p-2 rounded-lg transition-all duration-300 ${isActive || isCollision ? 'bg-gray-800/80' : ''}`}
    >
      {/* Index Label */}
      <div className="flex flex-col items-center justify-center pt-2 gap-1 w-10">
        <span className={`font-mono text-sm font-bold ${isActive ? 'text-primary-400' : 'text-gray-500'}`}>
          {bucket.index}
        </span>
        {isActive && !isCollision && <Search className="w-3 h-3 text-primary-400 animate-bounce" />}
        {isCollision && <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />}
      </div>

      {/* Bucket Container */}
      <motion.div
        animate={{ 
          scale: isCollision ? [1, 1.1, 1] : 1,
          borderColor: isCollision ? '#ef4444' : isActive ? '#38bdf8' : '#374151'
        }}
        transition={{ duration: 0.3 }}
        className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center shrink-0 relative ${getBgColor()}`}
      >
        {/* Visual Content inside Bucket */}
        {method === 'linearProbing' ? (
           <AnimatePresence mode="wait">
             {bucket.items[0] ? (
               <motion.div 
                 key={bucket.items[0].id}
                 initial={{ scale: 0 }} 
                 animate={{ scale: 1 }} 
                 exit={{ scale: 0 }}
                 className="flex flex-col items-center max-w-full px-1"
               >
                 <span className="text-[10px] text-gray-400 truncate w-full text-center">{bucket.items[0].key}</span>
                 <span className="text-sm font-bold text-white truncate w-full text-center">{bucket.items[0].value}</span>
               </motion.div>
             ) : (
               <span className="text-gray-700 text-xs">Empty</span>
             )}
           </AnimatePresence>
        ) : (
           // Chaining Anchor Point
           <div className="flex flex-col items-center">
             <div className={`w-3 h-3 rounded-full mb-1 ${bucket.items.length > 0 ? 'bg-primary-500 shadow-glow' : 'bg-gray-600'}`} />
             <span className="text-[10px] text-gray-500">Head</span>
           </div>
        )}

        {/* Collision Label Overlay */}
        <AnimatePresence>
          {isCollision && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: -35 }}
              exit={{ opacity: 0 }}
              className="absolute whitespace-nowrap bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg z-20"
            >
              Collision!
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chain (Linked List Visualization) */}
      {method === 'chaining' && (
        <div className="flex items-center gap-1 flex-1 overflow-hidden h-16">
          <AnimatePresence>
            {bucket.items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center"
              >
                <div className="w-8 h-[2px] bg-gray-600 shrink-0 relative">
                    <ArrowRight className="absolute -right-1 -top-2 w-4 h-4 text-gray-600" />
                </div>
                
                <div className="px-3 py-2 bg-gray-800 rounded-lg border border-gray-600 min-w-[70px] text-center shadow-lg group hover:border-primary-500 transition-colors">
                   <div className="text-[10px] text-gray-400 group-hover:text-primary-300">{item.key}</div>
                   <div className="text-sm font-bold text-gray-200">{item.value}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};
