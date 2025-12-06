import React from 'react';
import { motion } from 'framer-motion';
import { MatrixCell as IMatrixCell } from '../types';

interface MatrixCellProps {
  cell: IMatrixCell;
}

export const MatrixCell: React.FC<MatrixCellProps> = React.memo(({ cell }) => {
  const getStyles = () => {
    switch (cell.state) {
      case 'active': return 'bg-yellow-500/20 border-yellow-500 text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.3)] z-10';
      case 'visited': return 'bg-blue-900/30 border-blue-500/50 text-blue-200';
      case 'target': return 'bg-red-500/20 border-red-500 text-red-200 animate-pulse';
      case 'found': return 'bg-green-500/20 border-green-500 text-green-200 shadow-[0_0_15px_rgba(34,197,94,0.3)] z-10';
      case 'zero': return 'bg-red-900/40 border-red-800 text-red-400';
      default: return 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500';
    }
  };

  return (
    <motion.div
      layoutId={cell.id}
      layout
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`
        aspect-square flex items-center justify-center rounded-lg border-2 text-sm sm:text-base font-bold relative
        transition-colors duration-300
        ${getStyles()}
      `}
    >
      {cell.value}
      
      {cell.visitOrder && (
        <motion.span 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-0.5 right-1 text-[9px] text-gray-400 font-mono"
        >
          {cell.visitOrder}
        </motion.span>
      )}
    </motion.div>
  );
});

MatrixCell.displayName = 'MatrixCell';