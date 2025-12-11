import React from 'react';
import { ArrowLeft, Table2 } from 'lucide-react';
import { useDPAlgorithm } from './hooks/useDPAlgorithm';
import { DPTable } from './components/DPTable';
import { ControlPanel } from './components/ControlPanel';
import { ProblemInfo } from './components/ProblemInfo';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
import { ChatPanel } from '../ai-tutor/ChatPanel';
import { MobileLandscapeAlert } from '../../shared/components/MobileLandscapeAlert';

interface DPVisualizerProps {
  onBack: () => void;
}

export const DPVisualizer: React.FC<DPVisualizerProps> = ({ onBack }) => {
  const { 
    dpState,
    playback,
    problem,
    inputs,
    setProblem,
    setInputs,
    setPlayback,
    startVisualization,
    reset
  } = useDPAlgorithm();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      <MobileLandscapeAlert />
      
      <div className="flex-1 flex flex-col lg:flex-row pt-16 lg:h-screen lg:overflow-hidden">
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col relative min-h-[calc(100vh-4rem)] lg:min-h-0 lg:h-auto overflow-y-auto lg:overflow-hidden">
          
          {/* Top Bar */}
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800 bg-gray-900/50 backdrop-blur gap-4 shrink-0 z-10">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={onBack} className="rounded-full w-10 h-10 p-0 flex items-center justify-center shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <Table2 className="w-6 h-6 text-primary-400" />
                <h1 className="text-xl sm:text-2xl font-bold">Dynamic Programming</h1>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row bg-gray-900 relative h-full">
            
            {/* Sidebar Controls (Desktop: Left, Mobile: Top) */}
            <div className="w-full lg:w-80 p-4 border-r border-gray-800 bg-gray-900 shrink-0 overflow-y-auto">
              <ControlPanel 
                problem={problem}
                onProblemChange={setProblem}
                inputs={inputs}
                onInputChange={(k, v) => setInputs(prev => ({...prev, [k]: v}))}
                onStart={startVisualization}
                onReset={reset}
                isPlaying={playback.isPlaying}
                message={dpState.message}
                result={dpState.result}
                speed={playback.speed}
                onSpeedChange={(s) => setPlayback(p => ({...p, speed: s}))}
              />
              <ProblemInfo problem={problem} />
            </div>

            {/* Table Canvas */}
            <div className="flex-1 p-4 bg-gray-950/50 overflow-hidden relative flex flex-col">
              <div className="flex-1 border border-gray-800 rounded-xl bg-gray-900 shadow-inner overflow-hidden relative">
                 <DPTable state={dpState} />
              </div>
              
              {/* Legend */}
              <div className="mt-4 flex gap-4 text-xs text-gray-500 justify-center">
                <span className="flex items-center"><div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div> Computing</span>
                <span className="flex items-center"><div className="w-3 h-3 bg-orange-500 rounded mr-2"></div> Dependency</span>
                <span className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded mr-2"></div> Solution Path</span>
              </div>
            </div>

          </div>
        </main>

        <ChatPanel 
          context={`Dynamic Programming: ${problem.toUpperCase()}. 
          We use a table (memoization/tabulation) to store results of subproblems to avoid redundant calculations.
          Complexity: O(N*M) typically for 2D DP.`}
          onHighlightNode={() => {}} 
        />
      </div>
    </div>
  );
};