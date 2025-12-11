import React from 'react';
import { Button } from '../../../shared/components/Button';
import { Play, RotateCcw, Trash2, Grid } from 'lucide-react';
import { AlgorithmType } from '../types';

interface ControlPanelProps {
  algorithm: AlgorithmType;
  setAlgorithm: (a: AlgorithmType) => void;
  isRunning: boolean;
  onVisualize: () => void;
  onReset: () => void;
  onClearWalls: () => void;
  onGenerateMaze: () => void;
  speed: number;
  setSpeed: (s: number) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  algorithm,
  setAlgorithm,
  isRunning,
  onVisualize,
  onReset,
  onClearWalls,
  onGenerateMaze,
  speed,
  setSpeed
}) => {
  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-xl space-y-4">
      {/* Algorithm Select */}
      <div className="flex bg-gray-900 rounded-lg p-1 overflow-x-auto">
        {(['dijkstra', 'astar', 'bfs', 'dfs'] as AlgorithmType[]).map(algo => (
          <button
            key={algo}
            onClick={() => !isRunning && setAlgorithm(algo)}
            disabled={isRunning}
            className={`flex-1 min-w-[80px] px-3 py-1.5 text-xs font-medium rounded-md uppercase transition-all ${
              algorithm === algo ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-gray-200'
            } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {algo === 'astar' ? 'A*' : algo}
          </button>
        ))}
      </div>

      {/* Main Actions */}
      <div className="flex gap-2">
        <Button onClick={onVisualize} disabled={isRunning} className="flex-1">
          <Play className="w-4 h-4 mr-2" /> Visualize
        </Button>
        <Button onClick={onGenerateMaze} disabled={isRunning} variant="secondary">
          <Grid className="w-4 h-4 mr-2" /> Maze
        </Button>
      </div>

      {/* Utilities */}
      <div className="flex gap-2 border-t border-gray-700 pt-3">
        <Button onClick={onReset} disabled={isRunning} variant="outline" size="sm" className="flex-1">
          <RotateCcw className="w-3 h-3 mr-1" /> Clear Path
        </Button>
        <Button onClick={onClearWalls} disabled={isRunning} variant="outline" size="sm" className="flex-1 text-red-400 hover:text-red-300">
          <Trash2 className="w-3 h-3 mr-1" /> Clear Board
        </Button>
      </div>

      {/* Speed */}
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-500 uppercase font-bold">Speed</span>
        <input 
          type="range" min="5" max="50" step="5"
          value={55 - speed} // Invert so right is faster
          onChange={(e) => setSpeed(55 - Number(e.target.value))}
          disabled={isRunning}
          className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
        />
        <span className="text-xs text-gray-400 w-10 text-right">{speed < 10 ? 'Fast' : 'Slow'}</span>
      </div>
    </div>
  );
};