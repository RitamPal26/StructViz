import React, { useState } from 'react';
import { Button } from '../../../shared/components/Button';
import { RefreshCw, Play, Search, RotateCw, Ban, Grid } from 'lucide-react';
import { MatrixOperation, GenerationMode } from '../types';

interface ControlPanelProps {
  onGenerate: (r: number, c: number, mode: GenerationMode) => void;
  rows: number;
  cols: number;
  setRows: (v: number) => void;
  setCols: (v: number) => void;
  
  onSpiral: () => void;
  onRotate: () => void;
  onSearch: (t: number) => void;
  onSetZeroes: () => void;
  
  operation: MatrixOperation;
  message: string;
  speed: number;
  setSpeed: (v: number) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onGenerate,
  rows,
  cols,
  setRows,
  setCols,
  onSpiral,
  onRotate,
  onSearch,
  onSetZeroes,
  operation,
  message,
  speed,
  setSpeed
}) => {
  const [target, setTarget] = useState<string>('');
  const isBusy = operation !== 'idle';

  const handleGenerate = (mode: GenerationMode) => {
    onGenerate(rows, cols, mode);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-xl space-y-4">
      {/* Grid Settings */}
      <div className="flex flex-col sm:flex-row gap-4 border-b border-gray-700 pb-4">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400 uppercase font-bold">Size:</label>
          <input 
            type="number" min="2" max="10" value={rows} onChange={e => setRows(Number(e.target.value))}
            className="w-12 bg-gray-900 border border-gray-600 rounded px-1 text-center"
            disabled={isBusy}
          />
          <span className="text-gray-500">x</span>
          <input 
            type="number" min="2" max="10" value={cols} onChange={e => setCols(Number(e.target.value))}
            className="w-12 bg-gray-900 border border-gray-600 rounded px-1 text-center"
            disabled={isBusy}
          />
        </div>
        
        <div className="flex gap-2 flex-1 justify-end">
          <Button size="sm" variant="outline" onClick={() => handleGenerate('random')} disabled={isBusy}>
            <RefreshCw className="w-3 h-3 mr-1" /> Random
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleGenerate('sorted')} disabled={isBusy}>
            Sorted
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleGenerate('zeroes')} disabled={isBusy}>
            Zeros
          </Button>
        </div>
      </div>

      {/* Operations */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={onSpiral} disabled={isBusy} className="flex-1">
          <Grid className="w-4 h-4 mr-2" /> Spiral
        </Button>
        <Button size="sm" onClick={onRotate} disabled={isBusy} className="flex-1">
          <RotateCw className="w-4 h-4 mr-2" /> Rotate
        </Button>
        <Button size="sm" onClick={onSetZeroes} disabled={isBusy} className="flex-1">
          <Ban className="w-4 h-4 mr-2" /> Set Zeros
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <input 
          type="number" 
          value={target} 
          onChange={e => setTarget(e.target.value)} 
          placeholder="Search Value"
          className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-3 text-sm"
          disabled={isBusy}
        />
        <Button 
          size="sm" 
          variant="secondary" 
          onClick={() => target && onSearch(parseInt(target))}
          disabled={isBusy || !target}
        >
          <Search className="w-4 h-4 mr-1" /> Staircase Search
        </Button>
      </div>

      {/* Speed */}
      <div className="flex items-center gap-3 pt-2">
        <span className="text-xs font-bold text-gray-500">Speed:</span>
        <input 
          type="range" min="0.5" max="3" step="0.5" 
          value={speed} onChange={e => setSpeed(Number(e.target.value))}
          className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
        />
        <span className="text-xs text-gray-400 w-8">{speed}x</span>
      </div>
    </div>
  );
};