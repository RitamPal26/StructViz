import React from 'react';
import { Play, Pause, ChevronRight, ChevronLeft } from 'lucide-react';
import { PlaybackSpeed } from '../types';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  currentStep: number;
  totalSteps: number;
  speed: PlaybackSpeed;
  onSpeedChange: (s: PlaybackSpeed) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  currentStep,
  totalSteps,
  speed,
  onSpeedChange
}) => {
  const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0;
  const hasSteps = totalSteps > 0;

  return (
    <div className="bg-gray-800 border-t border-gray-700 p-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Progress Bar */}
        <div className="w-full md:w-1/3 flex items-center space-x-3 order-2 md:order-1">
          <span className="text-xs font-mono text-gray-500 w-12 text-right">
            {hasSteps ? currentStep + 1 : 0} / {Math.max(0, totalSteps)}
          </span>
          <div className="flex-1 h-2 bg-gray-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center space-x-2 order-1 md:order-2">
          <button 
            onClick={onStepBackward}
            disabled={!hasSteps}
            className={`p-2 rounded-full transition-colors ${!hasSteps ? 'text-gray-600 cursor-not-allowed' : 'hover:bg-gray-700 text-gray-400 hover:text-white'}`}
            title="Step Backward (Left Arrow)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={isPlaying ? onPause : onPlay}
            disabled={!hasSteps}
            className={`p-3 rounded-full shadow-lg transition-all ${
              !hasSteps 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-primary-600 hover:bg-primary-500 text-white shadow-primary-900/30 hover:scale-105'
            }`}
            title={!hasSteps ? "No steps to play" : isPlaying ? "Pause (Space)" : "Play (Space)"}
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
          </button>
          
          <button 
            onClick={onStepForward}
            disabled={!hasSteps}
            className={`p-2 rounded-full transition-colors ${!hasSteps ? 'text-gray-600 cursor-not-allowed' : 'hover:bg-gray-700 text-gray-400 hover:text-white'}`}
            title="Step Forward (Right Arrow)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center space-x-2 order-3">
          <span className="text-xs text-gray-500 uppercase font-bold">Speed</span>
          <div className="flex bg-gray-900 rounded-lg p-1">
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s as PlaybackSpeed)}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${
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
