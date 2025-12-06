import React, { useState } from 'react';
import { Button } from '../../../shared/components/Button';
import { Play, RotateCcw, Search, Plus, List } from 'lucide-react';
import { QueryType, Operation } from '../types';

interface ControlPanelProps {
  onGenerate: (size: number) => void;
  onQuery: (l: number, r: number) => void;
  onUpdate: (l: number, r: number, val: number) => void;
  queryType: QueryType;
  onTypeChange: (t: QueryType) => void;
  operation: Operation;
  message: string;
  result: number | null;
  speed: number;
  setSpeed: (s: number) => void;
  arraySize: number;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onGenerate,
  onQuery,
  onUpdate,
  queryType,
  onTypeChange,
  operation,
  message,
  result,
  speed,
  setSpeed,
  arraySize
}) => {
  const [qL, setQL] = useState(0);
  const [qR, setQR] = useState(arraySize - 1);
  const [uL, setUL] = useState(0);
  const [uR, setUR] = useState(0);
  const [uVal, setUVal] = useState(5);

  const isBusy = operation !== 'idle';

  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-xl space-y-4">
      
      {/* Type & Generation */}
      <div className="flex flex-col sm:flex-row gap-2 justify-between">
        <div className="flex bg-gray-900 rounded-lg p-1">
          {(['sum', 'min', 'max'] as QueryType[]).map(t => (
            <button
              key={t}
              onClick={() => !isBusy && onTypeChange(t)}
              className={`px-3 py-1 text-xs font-medium rounded-md uppercase ${queryType === t ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
              disabled={isBusy}
            >
              {t}
            </button>
          ))}
        </div>
        <Button size="sm" variant="outline" onClick={() => onGenerate(8)} disabled={isBusy}>
          <RotateCcw className="w-3 h-3 mr-1" /> Reset (N=8)
        </Button>
      </div>

      {/* Query Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-700 pt-3">
        <div className="space-y-2">
          <label className="text-xs text-gray-400 font-bold uppercase">Range Query</label>
          <div className="flex gap-2 items-center">
            <input 
              type="number" className="w-16 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-center" 
              value={qL} onChange={e => setQL(Number(e.target.value))} placeholder="L"
            />
            <span className="text-gray-500">-</span>
            <input 
              type="number" className="w-16 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-center" 
              value={qR} onChange={e => setQR(Number(e.target.value))} placeholder="R"
            />
            <Button size="sm" onClick={() => onQuery(qL, qR)} disabled={isBusy}>
              <Search className="w-3 h-3 mr-1" /> Run
            </Button>
          </div>
          {result !== null && (
            <div className="text-sm text-green-400 font-mono mt-1">Result: {result}</div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs text-gray-400 font-bold uppercase">Range Update (Lazy)</label>
          <div className="flex gap-2 items-center">
            <input 
              type="number" className="w-12 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-center" 
              value={uL} onChange={e => setUL(Number(e.target.value))} placeholder="L"
            />
            <span className="text-gray-500">-</span>
            <input 
              type="number" className="w-12 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-center" 
              value={uR} onChange={e => setUR(Number(e.target.value))} placeholder="R"
            />
            <span className="text-gray-500">+</span>
            <input 
              type="number" className="w-12 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-center" 
              value={uVal} onChange={e => setUVal(Number(e.target.value))} placeholder="Val"
            />
            <Button size="sm" variant="secondary" onClick={() => onUpdate(uL, uR, uVal)} disabled={isBusy}>
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Speed */}
      <div className="flex justify-between items-center pt-2">
        <span className="text-xs text-gray-500 animate-pulse">{message}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Speed</span>
          <input 
            type="range" min="0.5" max="3" step="0.5" value={speed} 
            onChange={e => setSpeed(Number(e.target.value))}
            className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
        </div>
      </div>
    </div>
  );
};