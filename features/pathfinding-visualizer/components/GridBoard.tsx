import React from 'react';
import { GridCell } from './GridCell';
import { GridCell as IGridCell } from '../types';

interface GridBoardProps {
  grid: IGridCell[][];
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

export const GridBoard: React.FC<GridBoardProps> = ({
  grid,
  onMouseDown,
  onMouseEnter,
  onMouseUp
}) => {
  // Touch Handlers to support dragging on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;
    if (element && element.dataset.row) {
      onMouseDown(parseInt(element.dataset.row), parseInt(element.dataset.col || '0'));
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Prevent scrolling while drawing
    // Note: 'touch-action: none' CSS on cells handles default prevention mostly, but explicit here helps
    // e.preventDefault(); 
    
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;
    if (element && element.dataset.row) {
      onMouseEnter(parseInt(element.dataset.row), parseInt(element.dataset.col || '0'));
    }
  };

  return (
    <div 
      className="bg-gray-900 p-2 sm:p-4 rounded-xl border border-gray-800 shadow-2xl overflow-auto custom-scrollbar flex items-center justify-center max-w-full"
      onMouseLeave={onMouseUp}
      onTouchEnd={onMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div className="grid gap-[1px] bg-gray-300">
        {grid.map((row, rIdx) => (
          <div key={rIdx} className="flex">
            {row.map((cell, cIdx) => (
              <GridCell
                key={`${rIdx}-${cIdx}`}
                row={rIdx}
                col={cIdx}
                type={cell.type}
                onMouseDown={onMouseDown}
                onMouseEnter={onMouseEnter}
                onMouseUp={onMouseUp}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};