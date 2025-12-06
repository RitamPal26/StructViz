import React, { useState } from 'react';
import { Button } from '../../../shared/components/Button';
import { Plus, ArrowUp, Eye, Trash2 } from 'lucide-react';
import { StackOperation } from '../types';

interface StackControlsProps {
  onPush: (val: string) => void;
  onPop: () => void;
  onPeek: () => void;
  onClear: () => void;
  operation: StackOperation;
}

export const StackControls: React.FC<StackControlsProps> = ({
  onPush,
  onPop,
  onPeek,
  onClear,
  operation
}) => {
  const [inputValue, setInputValue] = useState('');
  const isBusy = operation !== 'idle';

  const handlePush = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      if (trimmed.length > 20) {
        alert("Please enter a shorter value (max 20 chars)");
        return;
      }
      onPush(trimmed);
      setInputValue('');
    } else {
      onPush(Math.floor(Math.random() * 100).toString());
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Value (or random)"
            className="flex-1 min-w-0 bg-gray-900 border border-gray-600 rounded-lg px-3 text-sm text-white focus:ring-2 focus:ring-primary-500 outline-none"
            disabled={isBusy}
            onKeyDown={(e) => e.key === 'Enter' && handlePush()}
          />
          <Button 
            onClick={handlePush} 
            disabled={isBusy}
            size="sm"
            className="shrink-0"
          >
            <Plus className="w-4 h-4 mr-1" /> Push
          </Button>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={onPop} 
            disabled={isBusy}
            variant="secondary"
            size="sm"
          >
            <ArrowUp className="w-4 h-4 mr-1" /> Pop
          </Button>
          <Button 
            onClick={onPeek} 
            disabled={isBusy}
            variant="outline"
            size="sm"
          >
            <Eye className="w-4 h-4 mr-1" /> Peek
          </Button>
          <Button 
            onClick={onClear} 
            disabled={isBusy}
            variant="outline"
            size="sm"
            className="text-red-400 hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
