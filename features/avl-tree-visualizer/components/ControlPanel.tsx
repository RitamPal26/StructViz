import React, { useState } from 'react';
import { Button } from '../../../shared/components/Button';
import { Plus, Trash2, ArrowUpRight, PlayCircle } from 'lucide-react';
import { AVLOperation } from '../types';

interface ControlPanelProps {
  onInsert: (val: number) => void;
  onReset: () => void;
  onWorstCase: () => void;
  onRandom: () => void;
  operation: AVLOperation;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onInsert,
  onReset,
  onWorstCase,
  onRandom,
  operation
}) => {
  const [input, setInput] = useState('');
  const isBusy = operation !== 'idle';

  const handleInsert = () => {
    const val = parseInt(input);
    if (!isNaN(val)) {
      onInsert(val);
      setInput('');
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-xl space-y-4">
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
        
        <Button onClick={onReset} disabled={isBusy} variant="outline" size="sm" className="text-red-400">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-2 border-t border-gray-700 pt-3">
        <Button onClick={onWorstCase} disabled={isBusy} variant="secondary" size="sm" className="flex-1">
          <ArrowUpRight className="w-4 h-4 mr-2" /> Sorted (Worst Case)
        </Button>
        <Button onClick={onRandom} disabled={isBusy} variant="secondary" size="sm" className="flex-1">
          <PlayCircle className="w-4 h-4 mr-2" /> Random
        </Button>
      </div>
    </div>
  );
};