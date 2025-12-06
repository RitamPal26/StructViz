import React, { useState } from 'react';
import { Button } from '../../../shared/components/Button';
import { Plus, Search, Trash2, RotateCcw, Play, Pause, ChevronRight, ChevronLeft } from 'lucide-react';
import { CollisionMethod } from '../types';

interface ControlPanelProps {
  onInsert: (k: string, v: string) => void;
  onSearch: (k: string) => void;
  onReset: () => void;
  method: CollisionMethod;
  onMethodChange: (m: CollisionMethod) => void;
  
  // Playback Props
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onSpeedChange: (s: number) => void;
  message: string;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onInsert,
  onSearch,
  onReset,
  method,
  onMethodChange,
  isPlaying,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  currentStep,
  totalSteps,
  speed,
  onSpeedChange,
  message
}) => {
  const [keyInput, setKeyInput] = useState('');
  const [valInput, setValInput] = useState('');
  
  const hasSteps = totalSteps > 0;
  const progress = hasSteps ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Main Controls Card */}
      <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-xl space-y-4">
        {/* Method Toggle */}
        <div className="flex bg-gray-900 rounded-lg p-1">
          <button
            onClick={() => onMethodChange('chaining')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
              method === 'chaining' ? 'bg-gray-700 text-white shadow' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Chaining (Linked List)
          </button>
          <button
            onClick={() => onMethodChange('linearProbing')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
              method === 'linearProbing' ? 'bg-gray-700 text-white shadow' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Open Addressing (Probing)
          </button>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="text"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="Key (e.g. 'cat', '15')"
            className="bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-primary-500 outline-none"
          />
          <input
            type="text"
            value={valInput}
            onChange={(e) => setValInput(e.target.value)}
            placeholder="Value (e.g. 'feline')"
            className="bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Button 
            onClick={() => { if(keyInput && valInput) { onInsert(keyInput, valInput); setKeyInput(''); setValInput(''); } }} 
            disabled={!keyInput || !valInput}
            size="sm"
          >
            <Plus className="w-3 h-3 mr-1" /> Insert
          </Button>
          <Button 
            onClick={() => { if(keyInput) onSearch(keyInput); }} 
            disabled={!keyInput}
            variant="secondary"
            size="sm"
          >
            <Search className="w-3 h-3 mr-1" /> Search
          </Button>
          <Button 
            onClick={onReset} 
            variant="outline"
            size="sm"
            className="text-red-400 col-span-2 sm:col-span-1"
          >
            <RotateCcw className="w-3 h-3 mr-1" /> Reset
          </Button>
        </div>
      </div>

      {/* Playback & Narration Card */}
      <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-xl space-y-3">
        {/* Narration Box */}
        <div className="bg-black/30 rounded-lg p-3 border border-gray-700 min-h-[60px] flex items-center justify-center text-center">
           <p className="text-sm font-mono text-primary-200 animate-pulse-fast">
             {hasSteps ? message : "Ready. Enter a key/value pair to visualize."}
           </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between gap-4">
           {/* Step Controls */}
           <div className="flex items-center gap-2">
              <button onClick={onStepBackward} disabled={!hasSteps} className="p-2 rounded-full hover:bg-gray-700 text-gray-400 disabled:opacity-30">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={isPlaying ? onPause : onPlay} disabled={!hasSteps} className="p-3 bg-primary-600 rounded-full hover:bg-primary-500 text-white shadow-lg disabled:opacity-30 disabled:bg-gray-700">
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
              <button onClick={onStepForward} disabled={!hasSteps} className="p-2 rounded-full hover:bg-gray-700 text-gray-400 disabled:opacity-30">
                <ChevronRight className="w-5 h-5" />
              </button>
           </div>

           {/* Speed */}
           <div className="flex bg-gray-900 rounded-lg p-1">
              {[0.5, 1, 2].map(s => (
                <button 
                  key={s} 
                  onClick={() => onSpeedChange(s)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${speed === s ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  {s}x
                </button>
              ))}
           </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
          <div className="h-full bg-primary-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-[10px] text-gray-500 text-right">
          Step {currentStep + 1} of {totalSteps}
        </div>
      </div>
    </div>
  );
};
