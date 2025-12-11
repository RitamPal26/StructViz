import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DPState } from '../types';

interface DPTableProps {
  state: DPState;
}

export const DPTable: React.FC<DPTableProps> = ({ state }) => {
  const { grid, rows, cols, rowLabels, colLabels, activeCell } = state;

  if (!grid || grid.length === 0) return (
    <div className="flex items-center justify-center h-full text-gray-500 italic">
      Press Start to build the DP Table
    </div>
  );

  return (
    <div className="overflow-auto max-w-full max-h-full p-4 custom-scrollbar">
      <div 
        className="grid gap-1"
        style={{ 
          gridTemplateColumns: `auto repeat(${cols}, minmax(50px, 1fr))`
        }}
      >
        {/* Header Row */}
        <div className="bg-gray-900/50"></div> {/* Corner */}
        {colLabels.map((label, i) => (
          <div key={`col-${i}`} className="p-2 text-center text-xs font-bold text-gray-400 border-b border-gray-700 bg-gray-900/80 sticky top-0 z-10">
            {label}
            <div className="text-[9px] text-gray-600 font-mono mt-1">{i}</div>
          </div>
        ))}

        {/* Data Rows */}
        {grid.map((row, rIdx) => (
          <React.Fragment key={`row-${rIdx}`}>
            {/* Row Label */}
            <div className="p-2 flex flex-col justify-center items-center text-xs font-bold text-gray-400 border-r border-gray-700 bg-gray-900/80 sticky left-0 z-10">
              <span>{rowLabels[rIdx]}</span>
              <span className="text-[9px] text-gray-600 font-mono mt-1">{rIdx}</span>
            </div>

            {/* Cells */}
            {row.map((cell, cIdx) => {
              const isActive = activeCell?.r === rIdx && activeCell?.c === cIdx;
              const isPath = cell.status === 'path';
              const isFilled = cell.status === 'filled';
              
              // Check if this cell is a dependency for the active cell
              let isDependency = false;
              if (activeCell && grid[activeCell.r]?.[activeCell.c]?.dependencies) {
                 isDependency = grid[activeCell.r][activeCell.c].dependencies.some(d => d.r === rIdx && d.c === cIdx);
              }

              return (
                <motion.div
                  key={`${rIdx}-${cIdx}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isActive ? '#eab308' : isPath ? '#22c55e' : isDependency ? '#f97316' : isFilled ? '#1f2937' : '#111827',
                    borderColor: isActive ? '#fef08a' : '#374151'
                  }}
                  transition={{ duration: 0.2 }}
                  className={`
                    relative h-12 min-w-[50px] flex items-center justify-center border rounded font-mono text-sm shadow-sm
                    ${isActive ? 'text-black font-bold z-20' : 'text-gray-200'}
                    ${isDependency ? 'text-white' : ''}
                  `}
                >
                  {cell.value !== null ? cell.value : ''}
                  
                  {/* Coordinate tooltip on hover */}
                  <div className="opacity-0 hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] px-1 rounded pointer-events-none whitespace-nowrap z-50">
                    [{rIdx}, {cIdx}]
                  </div>
                </motion.div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};