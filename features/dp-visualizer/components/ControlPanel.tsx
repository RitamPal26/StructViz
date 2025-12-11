import React from 'react';
import { Button } from '../../../shared/components/Button';
import { Play, RotateCcw, FastForward } from 'lucide-react';
import { DPProblemType } from '../types';

interface ControlPanelProps {
  problem: DPProblemType;
  onProblemChange: (p: DPProblemType) => void;
  inputs: Record<string, any>;
  onInputChange: (key: string, val: any) => void;
  onStart: () => void;
  onReset: () => void;
  isPlaying: boolean;
  message: string;
  result: string | null;
  speed: number;
  onSpeedChange: (s: number) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  problem,
  onProblemChange,
  inputs,
  onInputChange,
  onStart,
  onReset,
  isPlaying,
  message,
  result,
  speed,
  onSpeedChange
}) => {
  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-xl space-y-4">
      {/* Problem Select */}
      <div className="flex bg-gray-900 rounded-lg p-1 overflow-x-auto">
        {(['lcs', 'knapsack', 'fibonacci'] as DPProblemType[]).map(p => (
          <button
            key={p}
            onClick={() => !isPlaying && onProblemChange(p)}
            className={`flex-1 min-w-[80px] px-3 py-1.5 text-xs font-medium rounded-md uppercase transition-all ${
              problem === p ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-gray-200'
            } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isPlaying}
          >
            {p === 'lcs' ? 'LCS' : p}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-2">
        {problem === 'lcs' && (
          <>
            <input 
              className="bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-white"
              value={inputs.str1 || ''}
              onChange={(e) => onInputChange('str1', e.target.value)}
              placeholder="String 1"
              maxLength={8}
              disabled={isPlaying}
            />
            <input 
              className="bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-white"
              value={inputs.str2 || ''}
              onChange={(e) => onInputChange('str2', e.target.value)}
              placeholder="String 2"
              maxLength={8}
              disabled={isPlaying}
            />
          </>
        )}
        {problem === 'fibonacci' && (
          <input 
            type="number"
            className="bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-white w-full"
            value={inputs.n || ''}
            onChange={(e) => onInputChange('n', parseInt(e.target.value))}
            placeholder="N (max 20)"
            max={20}
            disabled={isPlaying}
          />
        )}
        {problem === 'knapsack' && (
          <div className="col-span-2 text-xs text-gray-500 italic">
            Using preset demo items for Knapsack visual.
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <Button onClick={onStart} disabled={isPlaying} className="flex-1" size="sm">
          <Play className="w-3 h-3 mr-2" /> Start
        </Button>
        <Button onClick={onReset} variant="outline" size="sm" className="text-red-400">
          <RotateCcw className="w-3 h-3" />
        </Button>
      </div>

      {/* Status */}
      <div className="bg-black/30 rounded p-3 text-center min-h-[60px] flex items-center justify-center">
        <p className={`text-sm font-mono ${result ? 'text-green-400 font-bold' : 'text-gray-300'}`}>
          {result || message}
        </p>
      </div>

      {/* Speed */}
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-500 uppercase">Speed</span>
        <input 
          type="range" min="0.5" max="3" step="0.5"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
        />
      </div>
    </div>
  );
};