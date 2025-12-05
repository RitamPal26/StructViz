import React, { useState } from 'react';
import { Button } from '../../../shared/components/Button';
import { Plus, Search, Trash2, RotateCcw, Settings } from 'lucide-react';
import { CollisionMethod, Operation } from '../types';

interface ControlPanelProps {
  onInsert: (k: string, v: string) => void;
  onSearch: (k: string) => void;
  onDelete: (k: string) => void;
  onReset: () => void;
  method: CollisionMethod;
  onMethodChange: (m: CollisionMethod) => void;
  operation: Operation;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onInsert,
  onSearch,
  onDelete,
  onReset,
  method,
  onMethodChange,
  operation
}) => {
  const [keyInput, setKeyInput] = useState('');
  const [valInput, setValInput] = useState('');
  
  const isBusy = operation !== 'idle';

  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-xl space-y-4">
      {/* Collision Method Toggle */}
      <div className="flex bg-gray-900 rounded-lg p-1">
        <button
          onClick={() => !isBusy && onMethodChange('chaining')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
            method === 'chaining' ? 'bg-gray-700 text-white shadow' : 'text-gray-500 hover:text-gray-300'
          }`}
          disabled={isBusy}
        >
          Chaining (Linked List)
        </button>
        <button
          onClick={() => !isBusy && onMethodChange('linearProbing')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
            method === 'linearProbing' ? 'bg-gray-700 text-white shadow' : 'text-gray-500 hover:text-gray-300'
          }`}
          disabled={isBusy}
        >
          Open Addressing (Probing)
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input
          type="text"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          placeholder="Key (e.g. 'cat')"
          className="bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-primary-500 outline-none"
          disabled={isBusy}
        />
        <input
          type="text"
          value={valInput}
          onChange={(e) => setValInput(e.target.value)}
          placeholder="Value (e.g. 'feline')"
          className="bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-primary-500 outline-none"
          disabled={isBusy}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Button 
          onClick={() => { if(keyInput && valInput) onInsert(keyInput, valInput); setKeyInput(''); setValInput(''); }} 
          disabled={isBusy || !keyInput || !valInput}
          size="sm"
        >
          <Plus className="w-3 h-3 mr-1" /> Insert
        </Button>
        <Button 
          onClick={() => { if(keyInput) onSearch(keyInput); }} 
          disabled={isBusy || !keyInput}
          variant="secondary"
          size="sm"
        >
          <Search className="w-3 h-3 mr-1" /> Search
        </Button>
        <Button 
          onClick={() => { if(keyInput) onDelete(keyInput); }} 
          disabled={isBusy || !keyInput}
          variant="outline"
          size="sm"
        >
          <Trash2 className="w-3 h-3 mr-1" /> Delete
        </Button>
        <Button 
          onClick={onReset} 
          disabled={isBusy}
          variant="outline"
          size="sm"
          className="text-red-400"
        >
          <RotateCcw className="w-3 h-3 mr-1" /> Reset
        </Button>
      </div>
    </div>
  );
};
