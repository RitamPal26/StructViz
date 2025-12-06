import React from 'react';
import { Button } from '../../../shared/components/Button';
import { Play, Pause, RotateCcw, FastForward, SkipBack, Shuffle } from 'lucide-react';

interface ControlPanelProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onGenerate: (type: 'random' | 'nearly' | 'reversed') => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  arraySize: number;
  onSizeChange: (size: number) => void;
  isSorting: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isPlaying,
  onPlayPause,
  onReset,
  onStepForward,
  onStepBackward,
  onGenerate,
  speed,
  onSpeedChange,
  arraySize,
  onSizeChange,
  isSorting
}) => {
  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-xl space-y-4">
      
      {/* Array Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-700 pb-4">
        <div className="space-y-2">
          <label className="text-xs text-gray-400 font-bold uppercase">Array Generation</label>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => onGenerate('random')} disabled={isSorting}>
              <Shuffle className="w-3 h-3 mr-1" /> Random
            </Button>
            <Button size="sm" variant="outline" onClick={() => onGenerate('nearly')} disabled={isSorting}>
              Nearly Sorted
            </Button>
            <Button size="sm" variant="outline" onClick={() => onGenerate('reversed')} disabled={isSorting}>
              Reversed
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-gray-400 font-bold uppercase flex justify-between">
            <span>Size</span>
            <span>{arraySize}</span>
          </label>
          <input 
            type="range" 
            min="10" 
            max="100" 
            value={arraySize} 
            onChange={(e) => onSizeChange(Number(e.target.value))}
            disabled={isSorting}
            className="w-full accent-primary-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <button onClick={onStepBackward} disabled={isPlaying} className="p-2 hover:bg-gray-700 rounded-full text-gray-400 disabled:opacity-30">
            <SkipBack className="w-5 h-5" />
          </button>
          
          <Button 
            onClick={onPlayPause}
            className={`w-12 h-12 rounded-full p-0 flex items-center justify-center ${isPlaying ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-white text-white" /> : <Play className="w-6 h-6 fill-white text-white ml-1" />}
          </Button>

          <button onClick={onStepForward} disabled={isPlaying} className="p-2 hover:bg-gray-700 rounded-full text-gray-400 disabled:opacity-30">
            <FastForward className="w-5 h-5" />
          </button>

          <button onClick={onReset} className="p-2 hover:bg-red-900/30 text-red-400 rounded-full ml-4">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-4 w-full md:w-auto">
          <span className="text-xs text-gray-500 uppercase font-bold">Speed</span>
          <div className="flex bg-gray-900 rounded-lg p-1">
            {[1, 5, 10, 20].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  speed === s 
                    ? 'bg-gray-700 text-white shadow' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};