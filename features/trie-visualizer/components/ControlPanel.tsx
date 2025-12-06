import React, { useState } from 'react';
import { Button } from '../../../shared/components/Button';
import { Plus, Search, Trash2, ListFilter, Play } from 'lucide-react';
import { TrieOperation } from '../types';

interface ControlPanelProps {
  onInsert: (word: string) => void;
  onSearch: (word: string) => void;
  onStartsWith: (prefix: string) => void;
  onReset: () => void;
  operation: TrieOperation;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onInsert,
  onSearch,
  onStartsWith,
  onReset,
  operation
}) => {
  const [input, setInput] = useState('');
  const isBusy = operation !== 'idle';

  const handleAction = (action: (val: string) => void) => {
    if (input.trim()) {
      action(input.trim());
      setInput('');
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-xl space-y-4">
      <div className="flex flex-col md:flex-row gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter word (e.g., 'code')"
          className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-primary-500 outline-none"
          disabled={isBusy}
          onKeyDown={(e) => e.key === 'Enter' && handleAction(onInsert)}
          maxLength={10} // Limit length for visualization sanity
        />
        
        <Button onClick={() => handleAction(onInsert)} disabled={isBusy || !input} size="sm">
          <Plus className="w-4 h-4 mr-1" /> Insert
        </Button>
        <Button onClick={() => handleAction(onSearch)} disabled={isBusy || !input} variant="secondary" size="sm">
          <Search className="w-4 h-4 mr-1" /> Search
        </Button>
      </div>

      <div className="flex gap-2 border-t border-gray-700 pt-3">
        <Button onClick={() => handleAction(onStartsWith)} disabled={isBusy || !input} variant="outline" size="sm" className="flex-1">
          <ListFilter className="w-4 h-4 mr-2" /> Find Prefix
        </Button>
        <Button onClick={onReset} disabled={isBusy} variant="outline" size="sm" className="text-red-400 hover:bg-red-900/20">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};