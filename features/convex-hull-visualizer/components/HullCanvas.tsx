import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Point } from '../types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../hooks/useConvexHull';

interface HullCanvasProps {
  points: Point[];
  hull: Point[];
  candidateLine: { p1: Point; p2: Point } | null;
  activePoint: Point | null;
  onCanvasClick: (x: number, y: number) => void;
}

export const HullCanvas: React.FC<HullCanvasProps> = ({
  points,
  hull,
  candidateLine,
  activePoint,
  onCanvasClick
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      // Map screen coordinates to viewBox coordinates
      const scaleX = CANVAS_WIDTH / rect.width;
      const scaleY = CANVAS_HEIGHT / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      onCanvasClick(x, y);
    }
  };

  // Create SVG path d string for hull
  const hullPath = hull.length > 0
    ? `M ${hull.map(p => `${p.x} ${p.y}`).join(' L ')}`
    : '';

  return (
    <div className="w-full h-full bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-inner relative cursor-crosshair">
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', 
             backgroundSize: '20px 20px' 
           }} 
      />
      
      <svg 
        ref={svgRef}
        viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        width="100%" 
        height="100%" 
        onClick={handleClick}
        className="block"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Candidate Line (Scanning) */}
        <AnimatePresence>
          {candidateLine && (
            <motion.line
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x1: candidateLine.p1.x, y1: candidateLine.p1.y, x2: candidateLine.p2.x, y2: candidateLine.p2.y }}
              exit={{ opacity: 0 }}
              stroke="#fbbf24" // Amber
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}
        </AnimatePresence>

        {/* Current Hull Polygon */}
        <motion.path
          d={hullPath}
          fill="rgba(34, 197, 94, 0.1)" // Green tint
          stroke="#22c55e" // Green
          strokeWidth="3"
          strokeLinejoin="round"
          initial={false}
          animate={{ d: hullPath }}
          transition={{ type: "tween", duration: 0.1 }}
        />

        {/* Points */}
        {points.map(p => {
          const isHullNode = hull.find(h => h.id === p.id);
          const isActive = activePoint?.id === p.id;
          
          return (
            <motion.g 
              key={p.id}
              initial={{ scale: 0 }}
              animate={{ scale: isActive ? 1.5 : 1 }}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={isHullNode ? 8 : 6}
                fill={isActive ? '#fbbf24' : isHullNode ? '#22c55e' : '#3b82f6'} // Amber / Green / Blue
                stroke={isHullNode ? '#14532d' : '#1e3a8a'}
                strokeWidth="2"
              />
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
};