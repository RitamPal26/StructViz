import React from 'react';
import { Database, Key, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

interface SidebarProps {
  itemsCount: number;
  tableSize: number;
  loadFactor: number;
  onRehash: () => void;
  isBusy: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  itemsCount, 
  tableSize, 
  loadFactor,
  onRehash,
  isBusy
}) => {
  const getLoadColor = () => {
    if (loadFactor < 0.5) return 'text-green-400';
    if (loadFactor < 0.75) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="w-full lg:w-80 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto lg:h-[calc(100vh-4rem)]">
      <div className="space-y-8">
        
        {/* Statistics Card */}
        <section className="bg-gray-900 rounded-xl p-4 border border-gray-700 shadow-inner">
           <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
             <Database className="w-4 h-4 mr-2" /> Live Stats
           </h3>
           
           <div className="grid grid-cols-2 gap-4 mb-4">
             <div>
               <div className="text-gray-400 text-xs mb-1">Items</div>
               <div className="text-xl font-mono text-white">{itemsCount}</div>
             </div>
             <div>
               <div className="text-gray-400 text-xs mb-1">Buckets</div>
               <div className="text-xl font-mono text-white">{tableSize}</div>
             </div>
           </div>

           <div className="mb-4">
             <div className="flex justify-between text-xs mb-1">
               <span className="text-gray-400">Load Factor (α)</span>
               <span className={`font-mono font-bold ${getLoadColor()}`}>{loadFactor.toFixed(2)}</span>
             </div>
             <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
               <div 
                 className={`h-full transition-all duration-500 ${loadFactor > 0.7 ? 'bg-red-500' : loadFactor > 0.4 ? 'bg-yellow-500' : 'bg-green-500'}`}
                 style={{ width: `${Math.min(loadFactor * 100, 100)}%` }}
               />
             </div>
             {loadFactor > 0.7 && (
               <div className="flex items-center mt-2 text-xs text-red-400">
                 <AlertTriangle className="w-3 h-3 mr-1" />
                 <span>High collision risk!</span>
               </div>
             )}
           </div>

           <Button 
             size="sm" 
             variant="outline" 
             onClick={onRehash} 
             disabled={isBusy}
             className="w-full text-xs"
           >
             <RefreshCw className="w-3 h-3 mr-2" /> Force Rehash
           </Button>
        </section>

        {/* Info */}
        <section>
          <div className="flex items-center space-x-2 text-primary-400 mb-4">
            <Key className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Hash Function</h3>
          </div>
          <div className="bg-gray-950 p-3 rounded-lg border border-gray-900 text-xs font-mono text-gray-300">
            index = hash(key) % table_size
          </div>
          <p className="text-gray-400 text-sm mt-4 leading-relaxed">
            A hash table maps keys to values for efficient lookup. 
            The <strong>Load Factor</strong> (items / buckets) determines performance. 
            Keep it under 0.7 to maintain O(1) average time complexity.
          </p>
        </section>

      </div>
    </div>
  );
};
