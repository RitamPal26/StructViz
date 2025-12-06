import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMatrix } from './hooks/useMatrix';
import { MatrixGrid } from './components/MatrixGrid';
import { ControlPanel } from './components/ControlPanel';
import { Sidebar } from './components/Sidebar';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
import { ChatPanel } from '../ai-tutor/ChatPanel';
import { MobileLandscapeAlert } from '../../shared/components/MobileLandscapeAlert';

interface MatrixVisualizerProps {
  onBack: () => void;
}

export const MatrixVisualizer: React.FC<MatrixVisualizerProps> = ({ onBack }) => {
  const { 
    grid, 
    rows, 
    cols,
    operation, 
    message, 
    speed,
    setSpeed,
    setRows,
    setCols,
    generateGrid,
    runSpiral,
    runRotate,
    runSearch,
    runSetZeroes,
    resetStates
  } = useMatrix();

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
              <h1 className="text-xl sm:text-2xl font-bold">Matrix Operations</h1>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-gray-900 relative p-4 sm:p-8 overflow-y-auto">
            
            {/* Controls */}
            <div className="w-full max-w-2xl mx-auto mb-6 shrink-0">
              <ControlPanel 
                rows={rows}
                cols={cols}
                setRows={setRows}
                setCols={setCols}
                onGenerate={generateGrid}
                onSpiral={runSpiral}
                onRotate={runRotate}
                onSearch={runSearch}
                onSetZeroes={runSetZeroes}
                operation={operation}
                message={message}
                speed={speed}
                setSpeed={setSpeed}
              />
            </div>

            {/* Message Toast */}
            <div className="text-center mb-6 h-8 shrink-0">
              <motion.div
                key={message}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block px-4 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-sm font-medium text-primary-300"
              >
                {message}
              </motion.div>
            </div>

            {/* Matrix Grid */}
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
              <MatrixGrid grid={grid} rows={rows} cols={cols} />
            </div>

          </div>
        </main>

        <Sidebar />

        <ChatPanel 
          context="Matrix (2D Array). Operations: Spiral Traversal (Layer by layer), Rotate 90 (Transpose + Reverse), Search Sorted (Staircase from top-right), Set Zeroes (Using first row/col as markers)."
          onHighlightNode={() => {}} // Could implement cell highlighting later
        />
      </div>
    </div>
  );
};