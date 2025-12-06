import React, { useState } from 'react';
import { Button } from '../../../shared/components/Button';
import { Plus, LogOut, Eye, Trash2 } from 'lucide-react';
import { QueueMode, QueueOperation } from '../types';

interface QueueControlsProps {
  onEnqueue: (val: string) => void;
  onDequeue: () => void;
  onPeek: () => void;
  onClear: () => void;
  mode: QueueMode;
  onModeChange: (m: QueueMode) => void;
  operation: QueueOperation;
}

export const QueueControls: React.FC<QueueControlsProps> = ({
  onEnqueue,
  onDequeue,
  onPeek,
  onClear,
  mode,
  onModeChange,
  operation
}) => {
  const [inputValue, setInputValue] = useState('');
  const isBusy = operation !== 'idle';

  const handleEnqueue = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      if (trimmed.length > 15) {
        alert("Please enter a shorter value (max 15 chars)");
        return;
      }
      onEnqueue(trimmed);
      setInputValue('');
    } else {
      // Random value logic inside hook or here? Hook handles random if undefined, 
      // but UI handles specific input. Let's send random if empty is meant to be random, 
      // or block empty. Hook handles it, so we'll just block empty spaces.
      onEnqueue(Math.floor(Math.random() * 100).toString());
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl space-y-6">
      
      {/* Mode Tabs */}
      <div className="flex p-1 bg-gray-900 rounded-lg">
        {(['simple', 'circular', 'priority'] as QueueMode[]).map((m) => (
          <button
            key={m}
            onClick={() => !isBusy && onModeChange(m)}
            disabled={isBusy}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all capitalize
              ${mode === m ? 'bg-gray-700 text-white shadow' : 'text-gray-500 hover:text-gray-300'}
              ${isBusy ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {m} Queue
          </button>
        ))}
      </div>

      {/* Inputs & Actions */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Value"
            className="flex-1 min-w-0 bg-gray-900 border border-gray-600 rounded-lg px-3 text-sm text-white focus:ring-2 focus:ring-primary-500 outline-none"
            disabled={isBusy}
            onKeyDown={(e) => e.key === 'Enter' && handleEnqueue()}
          />
          <Button 
            onClick={handleEnqueue} 
            disabled={isBusy}
            className="shrink-0"
          >
            <Plus className="w-4 h-4 mr-1" /> Enqueue
          </Button>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={onDequeue} 
            disabled={isBusy}
            variant="secondary"
          >
            <LogOut className="w-4 h-4 mr-1" /> Dequeue
          </Button>
          <Button 
            onClick={onPeek} 
            disabled={isBusy}
            variant="outline"
          >
            <Eye className="w-4 h-4 mr-1" /> Peek
          </Button>
          <Button 
            onClick={onClear} 
            disabled={isBusy}
            variant="outline"
            className="text-red-400 hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
