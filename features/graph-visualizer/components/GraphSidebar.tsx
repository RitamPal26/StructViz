import React from 'react';
import { Share2, Map, GitBranch, Play, RotateCcw, FastForward, Rewind } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import { AlgorithmType } from '../types';

interface GraphSidebarProps {
  onAlgorithm: (type: AlgorithmType) => void;
  onReset: () => void;
  onPreset: (type: 'social' | 'map' | 'tree') => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  speed: number;
  onSpeedChange: (s: number) => void;
  message?: string;
}

export const GraphSidebar: React.FC<GraphSidebarProps> = ({
  onAlgorithm,
  onReset,
  onPreset,
  isPlaying,
  onPlayPause,
  onStepForward,
  onStepBackward,
  speed,
  onSpeedChange,
  message
}) => {
  return (
    // Fix: Removed fixed height on mobile (h-[calc...]), added lg:h-full or lg:h-[calc...] to ensure it only applies on desktop flex row.
    <div className="w-full lg:w-80 bg-gray-800 border-l border-gray-700 flex flex-col h-auto lg:h-[calc(100vh-4rem)]">
      
      {/* Algorithms */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Algorithms</h3>
        <div className="grid grid-cols-1 gap-2">
          <Button size="sm" onClick={() => onAlgorithm('bfs')}>BFS (Breadth-First)</Button>
          <Button size="sm" onClick={() => onAlgorithm('dfs')}>DFS (Depth-First)</Button>
          <Button size="sm" onClick={() => onAlgorithm('dijkstra')}>Dijkstra (Shortest Path)</Button>
        </div>
      </div>

      {/* Playback Controls (Active only during animation) */}
      <div className="p-4 border-b border-gray-700 bg-gray-900/50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Playback</h3>
          <span className="text-xs text-primary-400 font-mono">{speed}x</span>
        </div>
        
        <div className="flex items-center justify-center space-x-2 mb-3">
          <button onClick={onStepBackward} className="p-1 hover:bg-gray-700 rounded"><Rewind className="w-5 h-5" /></button>
          <button onClick={onPlayPause} className="p-2 bg-primary-600 rounded-full hover:bg-primary-500"><Play className={`w-4 h-4 ${isPlaying ? 'fill-white' : ''}`} /></button>
          <button onClick={onStepForward} className="p-1 hover:bg-gray-700 rounded"><FastForward className="w-5 h-5" /></button>
        </div>

        <input 
          type="range" min="0.5" max="3" step="0.5" 
          value={speed} onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-full accent-primary-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Current Status Message */}
      <div className="p-4 bg-gray-950 border-b border-gray-800 min-h-[80px]">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</h3>
        <p className="text-sm text-gray-200 leading-relaxed animate-pulse">
          {message || "Ready. Click canvas to add nodes, drag to move."}
        </p>
      </div>

      {/* Presets */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Presets</h3>
        <div className="space-y-2">
          <button onClick={() => onPreset('social')} className="w-full flex items-center p-2 rounded hover:bg-gray-700 text-left text-sm text-gray-300">
            <Share2 className="w-4 h-4 mr-3 text-blue-400" /> Social Network
          </button>
          <button onClick={() => onPreset('map')} className="w-full flex items-center p-2 rounded hover:bg-gray-700 text-left text-sm text-gray-300">
            <Map className="w-4 h-4 mr-3 text-green-400" /> City Map
          </button>
          <button onClick={() => onPreset('tree')} className="w-full flex items-center p-2 rounded hover:bg-gray-700 text-left text-sm text-gray-300">
            <GitBranch className="w-4 h-4 mr-3 text-yellow-400" /> Tree Structure
          </button>
        </div>
      </div>

      <div className="p-4 mt-auto">
        <Button variant="outline" className="w-full text-red-400 hover:text-red-300" onClick={onReset}>
          <RotateCcw className="w-4 h-4 mr-2" /> Reset Graph
        </Button>
      </div>
    </div>
  );
};
