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
  return (
    <div 
      className="bg-gray-900 p-4 rounded-xl border border-gray-800 shadow-2xl overflow-auto custom-scrollbar flex items-center justify-center"
      onMouseLeave={onMouseUp} // Stop dragging if mouse leaves board
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