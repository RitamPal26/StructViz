import React, { useState } from 'react';
import { Button } from '../../../shared/components/Button';
import { Play, Search, Trash2, Plus, RotateCcw } from 'lucide-react';
import { TreeOperation } from '../types';

interface ControlPanelProps {
  onInsert: (val: number) => void;
  onDelete: (val: number) => void;
  onSearch: (val: number) => void;
  onClear: () => void;
  onSpeedChange: (speed: number) => void;
  speed: number;
  operation: TreeOperation;
  message: string;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onInsert,
  onDelete,
  onSearch,
  onClear,
  onSpeedChange,
  speed,
  operation,
  message
}) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleAction = (action: (val: number) => void) => {
    const val = parseInt(inputValue);
    if (!isNaN(val)) {
      if (val > 999 || val < -999) {
        alert("Please enter a value between -999 and 999");
        return;
      }
      action(val);
      setInputValue('');
    }
  };

  const isBusy = operation !== 'idle';

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl space-y-6">
      {/* Status Bar */}
      <div className="flex items-center justify-between bg-gray-900/50 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center space-x-3">
          <div className={`w-2 h-2 rounded-full ${isBusy ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
          <span className="text-gray-300 font-mono text-sm">{message}</span>
        </div>
        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
          {isBusy ? operation : 'Ready'}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-1">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value"
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            disabled={isBusy}
            onKeyDown={(e) => e.key === 'Enter' && handleAction(onInsert)}
          />
        </div>
        
        <Button 
          onClick={() => handleAction(onInsert)} 
          disabled={isBusy || !inputValue}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Insert
        </Button>
        
        <Button 
          variant="secondary"
          onClick={() => handleAction(onSearch)}
          disabled={isBusy || !inputValue}
          className="w-full"
        >
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => handleAction(onDelete)}
          disabled={isBusy || !inputValue}
          className="w-full hover:bg-red-900/20 hover:border-red-500 hover:text-red-400"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>

        <Button 
          variant="outline"
          onClick={onClear}
          disabled={isBusy}
          className="w-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>

      {/* Settings */}
      <div className="pt-4 border-t border-gray-700">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400 font-medium">Animation Speed</span>
          <input
            type="range"
            min="100"
            max="1500"
            step="100"
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
            disabled={isBusy}
          />
          <span className="text-xs text-gray-500 w-16 text-right">{speed}ms</span>
        </div>
      </div>
    </div>
  );
};
