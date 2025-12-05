import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bucket, CollisionMethod } from '../types';
import { ArrowRight } from 'lucide-react';

interface HashBucketProps {
  bucket: Bucket;
  method: CollisionMethod;
}

export const HashBucket: React.FC<HashBucketProps> = ({ bucket, method }) => {
  const getBgColor = () => {
    switch (bucket.state) {
      case 'active': return 'bg-primary-900/50 border-primary-500';
      case 'collision': return 'bg-red-900/50 border-red-500';
      case 'found': return 'bg-green-900/50 border-green-500';
      default: return 'bg-gray-800 border-gray-700';
    }
  };

  return (
    <div className="flex items-start gap-2 h-14">
      {/* Index Label */}
      <div className="w-8 py-4 text-xs font-mono text-gray-500 text-right pt-2">
        {bucket.index}
      </div>

      {/* Bucket Slot */}
      <motion.div
        layout
        className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors duration-300 relative ${getBgColor()}`}
      >
        {/* For Probing, item sits inside here. For Chaining, it's just the head anchor unless we want to put first item here. 
            Common visualization: Bucket is an array cell. Pointers go out.
            Let's put first item in bucket for visual compactness if probing, 
            or just render the pointer for chaining if we strictly follow "Array of Pointers" model.
            But to look nice: 
            Chaining: [ Index | • ] -> [Item] -> [Item]
            Probing:  [ Index | Item ]
        */}
        
        {method === 'linearProbing' ? (
           <AnimatePresence>
             {bucket.items[0] && (
               <motion.div 
                 initial={{ scale: 0 }} 
                 animate={{ scale: 1 }} 
                 exit={{ scale: 0 }}
                 className="text-sm font-bold text-white truncate px-1"
               >
                 {bucket.items[0].value}
               </motion.div>
             )}
           </AnimatePresence>
        ) : (
           // Chaining Anchor
           <div className={`w-2 h-2 rounded-full ${bucket.items.length > 0 ? 'bg-primary-400' : 'bg-gray-600'}`} />
        )}
      </motion.div>

      {/* Chain (Only for Chaining mode) */}
      {method === 'chaining' && (
        <div className="flex items-center gap-2 flex-1 overflow-hidden">
          <AnimatePresence>
            {bucket.items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4 text-gray-600" />
                <div className="px-3 py-2 bg-gray-700 rounded border border-gray-600 min-w-[60px] text-center shadow-sm">
                   <div className="text-[10px] text-gray-400">{item.key}</div>
                   <div className="text-xs font-bold text-white">{item.value}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
