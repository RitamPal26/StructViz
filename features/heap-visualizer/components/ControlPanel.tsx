import React, { useState } from 'react';
import { Button } from '../../../shared/components/Button';
import { Plus, ArrowDownUp, RefreshCw, Trash2, Play } from 'lucide-react';
import { HeapType, HeapOperation } from '../types';

interface ControlPanelProps {
  onInsert: (val: number) => void;
  onExtract: () => void;
  onSort: () => void;
  onReset: () => void;
  onToggleType: () => void;
  heapType: HeapType;
  operation: HeapOperation;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onInsert,
  onExtract,
  onSort,
  onReset,
  onToggleType,
  heapType,
  operation
}) => {
  const [input, setInput] = useState('');
  const isBusy = operation !== 'idle';

  const handleInsert = () => {
    const val = parseInt(input);
    if (!isNaN(val)) {
      onInsert(val);
      setInput('');
    } else {
      // Random
      onInsert(Math.floor(Math.random() * 99) + 1);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-xl space-y-4">
      {/* Mode Toggle */}
      <div className="flex justify-center">
        <button
          onClick={() => !isBusy && onToggleType()}
          disabled={isBusy}
          className={`
            px-4 py-2 rounded-full font-bold text-sm transition-all flex items-center
            ${heapType === 'min' ? 'bg-blue-600 text-white' : 'bg-orange-600 text-white'}
          `}
        >
          <ArrowDownUp className="w-4 h-4 mr-2" />
          {heapType === 'min' ? 'Min Heap' : 'Max Heap'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Value"
            className="flex-1 min-w-0 bg-gray-900 border border-gray-600 rounded-lg px-3 text-sm text-white focus:ring-2 focus:ring-primary-500 outline-none"
            disabled={isBusy}
            onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
          />
          <Button onClick={handleInsert} disabled={isBusy} size="sm">
            <Plus className="w-4 h-4 mr-1" /> Insert
          </Button>
        </div>

        <Button onClick={onExtract} disabled={isBusy} variant="secondary" size="sm">
          <ArrowDownUp className="w-4 h-4 mr-1" /> Extract {heapType === 'min' ? 'Min' : 'Max'}
        </Button>
      </div>

      <div className="flex gap-2 border-t border-gray-700 pt-3">
        <Button onClick={onSort} disabled={isBusy} variant="outline" size="sm" className="flex-1 text-green-400 border-green-900/50 hover:bg-green-900/20">
          <Play className="w-4 h-4 mr-2" /> Heap Sort
        </Button>
        <Button onClick={onReset} disabled={isBusy} variant="outline" size="sm" className="text-red-400 hover:bg-red-900/20">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
