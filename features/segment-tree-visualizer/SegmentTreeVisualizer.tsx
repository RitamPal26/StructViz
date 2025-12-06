import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useSegmentTree } from './hooks/useSegmentTree';
import { SegmentTreeCanvas } from './components/SegmentTreeCanvas';
import { ControlPanel } from './components/ControlPanel';
import { ArrayDisplay } from './components/ArrayDisplay';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
import { ChatPanel } from '../ai-tutor/ChatPanel';
import { MobileLandscapeAlert } from '../../shared/components/MobileLandscapeAlert';

interface SegmentTreeVisualizerProps {
  onBack: () => void;
}

export const SegmentTreeVisualizer: React.FC<SegmentTreeVisualizerProps> = ({ onBack }) => {
  const { 
    nodes, 
    array, 
    queryType, 
    setQueryType, 
    operation, 
    message, 
    speed, 
    setSpeed, 
    generateArray, 
    query, 
    updateRange,
    lastQueryResult
  } = useSegmentTree();

  useEffect(() => {
    generateArray(8);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              <h1 className="text-xl sm:text-2xl font-bold">Segment Tree</h1>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-gray-900 relative">
            
            {/* Controls Overlay */}
            <div className="w-full max-w-2xl mx-auto p-4 z-20 shrink-0">
              <ControlPanel 
                onGenerate={generateArray}
                onQuery={query}
                onUpdate={updateRange}
                queryType={queryType}
                onTypeChange={setQueryType}
                operation={operation}
                message={message}
                result={lastQueryResult}
                speed={speed}
                setSpeed={setSpeed}
                arraySize={array.length}
              />
            </div>

            {/* Canvas */}
            <div className="flex-1 overflow-hidden relative flex flex-col">
              <div className="flex-1 p-4 overflow-auto">
                 <SegmentTreeCanvas nodes={nodes} />
              </div>
              <ArrayDisplay array={array} />
            </div>

          </div>
        </main>

        <ChatPanel 
          context={`Segment Tree. Type: ${queryType.toUpperCase()}. Operations: Range Query O(log n), Range Update O(log n) using Lazy Propagation. Structure: Complete Binary Tree. Leaves = Array Elements.`}
          onHighlightNode={(val) => {}} 
        />
      </div>
    </div>
  );
};