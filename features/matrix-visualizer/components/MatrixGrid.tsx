import React from 'react';
import { MatrixCell as IMatrixCell } from '../types';
import { MatrixCell } from './MatrixCell';

interface MatrixGridProps {
  grid: IMatrixCell[][];
  rows: number;
  cols: number;
}

export const MatrixGrid: React.FC<MatrixGridProps> = ({ grid, rows, cols }) => {
  return (
    <div 
      className="grid gap-2 mx-auto p-4 bg-gray-900/50 rounded-xl border border-gray-800 shadow-inner"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(40px, 64px))`,
        maxWidth: 'fit-content'
      }}
    >
      {grid.map((row, rIndex) => (
        <React.Fragment key={rIndex}>
          {row.map((cell) => (
            <MatrixCell key={cell.id} cell={cell} />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};