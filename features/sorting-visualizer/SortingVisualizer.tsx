import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../../shared/components/Header';
import { Button } from '../../shared/components/Button';
import { MobileLandscapeAlert } from '../../shared/components/MobileLandscapeAlert';
import { ChatPanel } from '../ai-tutor/ChatPanel';
import { AlgorithmType, SortStep, SortMode } from './types';
import { useSortingAlgorithms } from './hooks/useSortingAlgorithms';
import { useSortingAudio } from './hooks/useSortingAudio';
import { SortingBars } from './components/SortingBars';
import { ControlPanel } from './components/ControlPanel';
import { AlgorithmSelector } from './components/AlgorithmSelector';
import { RaceMode } from './components/RaceMode';

interface SortingVisualizerProps {
  onBack: () => void;
}

export const SortingVisualizer: React.FC<SortingVisualizerProps> = ({ onBack }) => {
  const [arraySize, setArraySize] = useState(30);
  const [initialArray, setInitialArray] = useState<number[]>([]);
  const [mode, setMode] = useState<SortMode>('single');
  
  // Single Mode State
  const [selectedAlg, setSelectedAlg] = useState<AlgorithmType>('bubble');
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Race Mode State
  const [raceAlgos, setRaceAlgos] = useState<AlgorithmType[]>(['bubble', 'quick', 'merge']);
  const [raceSteps, setRaceSteps] = useState<Record<AlgorithmType, SortStep[]>>({} as any);
  const [raceIndices, setRaceIndices] = useState<Record<AlgorithmType, number>>({} as any);

  // Playback
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef<number | null>(null);

  const { generateSteps } = useSortingAlgorithms();
  const { playTone, playCompletion } = useSortingAudio();

  // Initialize Array
  useEffect(() => {
    generateArray('random');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-generate steps when dependencies change
  useEffect(() => {
    if (initialArray.length === 0) return;

    if (mode === 'single') {
      const newSteps = generateSteps(initialArray, selectedAlg);
      setSteps(newSteps);
      setCurrentStepIndex(0);
    } else {
      const newRaceSteps: any = {};
      const newIndices: any = {};
      raceAlgos.forEach(alg => {
        newRaceSteps[alg] = generateSteps(initialArray, alg);
        newIndices[alg] = 0;
      });
      setRaceSteps(newRaceSteps);
      setRaceIndices(newIndices);
    }
    setIsPlaying(false);
  }, [initialArray, selectedAlg, mode, raceAlgos, generateSteps]);

  const generateArray = (type: 'random' | 'nearly' | 'reversed') => {
    let arr: number[] = [];
    if (type === 'random') {
      arr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 5);
    } else if (type === 'reversed') {
      arr = Array.from({ length: arraySize }, (_, i) => arraySize - i);
    } else {
      // Nearly sorted
      arr = Array.from({ length: arraySize }, (_, i) => i + 1);
      // Swap a few
      for(let i=0; i<Math.floor(arraySize/5); i++) {
        const idx1 = Math.floor(Math.random() * arraySize);
        const idx2 = Math.floor(Math.random() * arraySize);
        [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
      }
    }
    setInitialArray(arr);
  };

  const handleResize = (size: number) => {
    setArraySize(size);
    // Debounce generation or just regenerate on release? 
    // For now simple regen next effect cycle implies tracking dependency on size?
    // Let's manually trigger regen to avoid effect loop or complex deps.
    // Actually `generateArray` depends on arraySize state which is updated. 
    // We'll add an effect on arraySize.
  };

  useEffect(() => {
    generateArray('random');
  }, [arraySize]);

  // Audio Effect
  useEffect(() => {
    if (isPlaying && mode === 'single' && steps[currentStepIndex]) {
      const step = steps[currentStepIndex];
      // Play tone for comparison
      if (step.comparing.length > 0) {
        playTone(step.array[step.comparing[0]], 100);
      }
    }
  }, [currentStepIndex, isPlaying, mode, steps, playTone]);

  // Playback Loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        if (mode === 'single') {
          setCurrentStepIndex(prev => {
            if (prev >= steps.length - 1) {
              setIsPlaying(false);
              playCompletion(steps[0].array.length);
              return prev;
            }
            return prev + 1;
          });
        } else {
          // Race Mode
          setRaceIndices(prev => {
            const next = { ...prev };
            let allFinished = true;
            let anyMoved = false;

            raceAlgos.forEach(alg => {
              if (next[alg] < (raceSteps[alg]?.length || 0) - 1) {
                next[alg]++;
                allFinished = false;
                anyMoved = true;
              }
            });

            if (allFinished) {
              setIsPlaying(false);
              playCompletion(initialArray.length);
            }
            return anyMoved ? next : prev;
          });
        }
      }, 200 / speed); // Base 200ms
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length, speed, mode, raceAlgos, raceSteps, playCompletion, initialArray.length]);

  const toggleRaceAlg = (alg: AlgorithmType) => {
    if (raceAlgos.includes(alg)) {
      if (raceAlgos.length > 1) setRaceAlgos(prev => prev.filter(a => a !== alg));
    } else {
      if (raceAlgos.length < 4) setRaceAlgos(prev => [...prev, alg]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      <MobileLandscapeAlert />

      <div className="flex-1 flex flex-col lg:flex-row pt-16 lg:h-screen lg:overflow-hidden">
        <main className="flex-1 flex flex-col relative min-h-[calc(100vh-4rem)] lg:min-h-0 lg:h-auto overflow-y-auto lg:overflow-hidden">
          
          {/* Top Bar */}
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800 bg-gray-900/50 backdrop-blur gap-4 shrink-0 z-10">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={onBack} className="rounded-full w-10 h-10 p-0 flex items-center justify-center shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl sm:text-2xl font-bold">Sorting Visualizer</h1>
            </div>

            <div className="flex bg-gray-800 rounded-lg p-1">
              <button 
                onClick={() => { setMode('single'); setIsPlaying(false); }}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${mode === 'single' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Standard
              </button>
              <button 
                onClick={() => { setMode('race'); setIsPlaying(false); }}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${mode === 'race' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <div className="flex items-center space-x-2">
                  <Flag className="w-4 h-4" />
                  <span>Race Mode</span>
                </div>
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-gray-900 relative">
            
            {/* Algorithm Selector */}
            <div className="px-4 py-2 border-b border-gray-800 bg-gray-950/50">
              <AlgorithmSelector 
                selected={selectedAlg} 
                onChange={setSelectedAlg}
                isRaceMode={mode === 'race'}
                raceAlgorithms={raceAlgos}
                onToggleRaceAlg={toggleRaceAlg}
              />
            </div>

            {/* Main Canvas */}
            <div className="flex-1 p-4 overflow-hidden relative flex flex-col">
              {mode === 'single' ? (
                <div className="flex-1 bg-gray-950/50 rounded-xl border border-gray-800 relative p-4 flex flex-col">
                  {steps[currentStepIndex] ? (
                    <>
                      <div className="absolute top-4 left-0 right-0 text-center z-10 pointer-events-none">
                        <span className="bg-gray-900/80 text-primary-300 px-4 py-1 rounded-full text-sm font-mono border border-gray-700">
                          {steps[currentStepIndex].description}
                        </span>
                      </div>
                      <SortingBars step={steps[currentStepIndex]} maxValue={Math.max(...initialArray, 100)} />
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">Loading...</div>
                  )}
                </div>
              ) : (
                <RaceMode 
                  algorithms={raceAlgos}
                  steps={raceSteps}
                  currentIndices={raceIndices}
                  maxValue={Math.max(...initialArray, 100)}
                />
              )}
            </div>

            {/* Controls */}
            <div className="p-4 bg-gray-900 border-t border-gray-800 shrink-0">
              <div className="max-w-4xl mx-auto">
                <ControlPanel 
                  isPlaying={isPlaying}
                  onPlayPause={() => setIsPlaying(!isPlaying)}
                  onReset={() => {
                    setIsPlaying(false);
                    setCurrentStepIndex(0);
                    if (mode === 'race') {
                      const resetIndices: any = {};
                      raceAlgos.forEach(a => resetIndices[a] = 0);
                      setRaceIndices(resetIndices);
                    }
                  }}
                  onStepForward={() => setCurrentStepIndex(p => Math.min(p + 1, steps.length - 1))}
                  onStepBackward={() => setCurrentStepIndex(p => Math.max(p - 1, 0))}
                  onGenerate={generateArray}
                  speed={speed}
                  onSpeedChange={setSpeed}
                  arraySize={arraySize}
                  onSizeChange={handleResize}
                  isSorting={isPlaying}
                />
              </div>
            </div>

          </div>
        </main>

        <ChatPanel 
          context={`Sorting Visualizer. Current Mode: ${mode === 'single' ? selectedAlg + ' Sort' : 'Race Mode'}. 
          Explaining logic: 
          - Bubble Sort: O(n^2), bubbles max to end.
          - Selection Sort: O(n^2), selects min.
          - Insertion Sort: O(n^2), shifts elements.
          - Merge Sort: O(n log n), divide and conquer.
          - Quick Sort: O(n log n), partitioning.
          - Heap Sort: O(n log n), using binary heap.
          `}
        />
      </div>
    </div>
  );
};