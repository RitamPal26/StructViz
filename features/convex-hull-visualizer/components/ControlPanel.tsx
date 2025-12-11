import React from 'react';
import { Button } from '../../../shared/components/Button';
import { Play, RotateCcw, Shuffle, Plus, Hexagon } from 'lucide-react';
import { HullAlgorithm } from '../types';

interface ControlPanelProps {
  onGenerate: () => void;
  onClear: () => void;
  onRun: () => void;
  algorithm: HullAlgorithm;
  setAlgorithm: (a: HullAlgorithm) => void;
  isRunning: boolean;
  message: string;
  speed: number;
  setSpeed: (s: number) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onGenerate,
  onClear,
  onRun,
  algorithm,
  setAlgorithm,
  isRunning,
  message,
  speed,
  setSpeed
}) => {
  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-xl space-y-4">
      
      {/* Algorithm Select */}
      <div className="flex bg-gray-900 rounded-lg p-1">
        {(['graham', 'jarvis', 'monotone'] as HullAlgorithm[]).map(alg => (
          <button
            key={alg}
            onClick={() => !isRunning && setAlgorithm(alg)}
            className={`flex-1 py-2 text-xs font-medium rounded-md uppercase transition-all ${
              algorithm === alg 
                ? 'bg-primary-600 text-white shadow' 
                : 'text-gray-500 hover:text-gray-300'
            } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isRunning}
          >
            {alg === 'graham' ? 'Graham Scan' : alg === 'jarvis' ? 'Jarvis March' : 'Monotone Chain'}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={onGenerate} disabled={isRunning} variant="secondary" size="sm">
          <Shuffle className="w-4 h-4 mr-2" /> Random
        </Button>
        <Button onClick={onRun} disabled={isRunning} size="sm">
          <Play className="w-4 h-4 mr-2" /> Visualize
        </Button>
      </div>

      <Button onClick={onClear} disabled={isRunning} variant="outline" size="sm" className="w-full text-red-400">
        <RotateCcw className="w-4 h-4 mr-2" /> Clear Canvas
      </Button>

      {/* Speed */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
        <span className="text-xs text-gray-500 font-bold uppercase">Speed</span>
        <input 
          type="range" min="1" max="10" step="1" 
          value={speed} onChange={(e) => setSpeed(Number(e.target.value))}
          className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
          disabled={isRunning}
        />
      </div>

      {/* Status */}
      <div className="bg-black/30 p-2 rounded text-center min-h-[40px] flex items-center justify-center">
        <p className="text-xs font-mono text-gray-300 animate-pulse">{message}</p>
      </div>
    </div>
  );
};