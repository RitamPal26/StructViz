import React from 'react';
import { CellType } from '../types';
import { MapPin, Navigation } from 'lucide-react';

interface GridCellProps {
  row: number;
  col: number;
  type: CellType;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

export const GridCell: React.FC<GridCellProps> = React.memo(({
  row,
  col,
  type,
  onMouseDown,
  onMouseEnter,
  onMouseUp
}) => {
  const getStyles = () => {
    switch (type) {
      case 'start': return 'bg-green-500 border-green-600 z-10 scale-110 shadow-lg';
      case 'finish': return 'bg-red-500 border-red-600 z-10 scale-110 shadow-lg';
      case 'wall': return 'bg-gray-800 border-gray-700 animate-pop';
      case 'visited': return 'bg-sky-400 border-sky-300 animate-visit';
      case 'path': return 'bg-yellow-400 border-yellow-300 animate-path shadow-md z-10';
      default: return 'bg-white border-gray-200 hover:bg-gray-50'; // Empty
    }
  };

  return (
    <div
      data-row={row}
      data-col={col}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={onMouseUp}
      // Added touch-none to prevent scrolling while drawing
      className={`
        w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7
        border border-opacity-20 flex items-center justify-center cursor-pointer transition-colors duration-200 select-none touch-none
        ${getStyles()}
      `}
    >
      {type === 'start' && <Navigation className="w-3 h-3 sm:w-4 sm:h-4 text-white fill-current transform rotate-90" />}
      {type === 'finish' && <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-white fill-current" />}
    </div>
  );
}, (prev, next) => prev.type === next.type);

GridCell.displayName = 'GridCell';