import { useState, useCallback, useRef, useEffect } from 'react';
import { Point, HullAlgorithm, HullStep } from '../types';
import { useSound } from '../../../shared/context/SoundContext';

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 500;
const PADDING = 50;

export const useConvexHull = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [hull, setHull] = useState<Point[]>([]);
  const [candidateLine, setCandidateLine] = useState<{p1: Point, p2: Point} | null>(null);
  const [activePoint, setActivePoint] = useState<Point | null>(null);
  
  const [algorithm, setAlgorithm] = useState<HullAlgorithm>('graham');
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [message, setMessage] = useState('Ready. Add points or generate random set.');
  const [speed, setSpeed] = useState(1); // 1 = Normal, 2 = Fast

  const isMounted = useRef(true);
  const { play } = useSound();

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const generatePoints = useCallback((count = 20) => {
    const newPoints: Point[] = [];
    for (let i = 0; i < count; i++) {
      newPoints.push({
        id: `p-${Date.now()}-${i}`,
        x: PADDING + Math.random() * (CANVAS_WIDTH - 2 * PADDING),
        y: PADDING + Math.random() * (CANVAS_HEIGHT - 2 * PADDING),
        state: 'default'
      });
    }
    setPoints(newPoints);
    setHull([]);
    setCandidateLine(null);
    setActivePoint(null);
    setIsFinished(false);
    setMessage(`Generated ${count} random points.`);
  }, []);

  const clearPoints = () => {
    setPoints([]);
    setHull([]);
    setCandidateLine(null);
    setActivePoint(null);
    setIsFinished(false);
    setMessage('Canvas cleared.');
  };

  const addPoint = (x: number, y: number) => {
    if (isRunning) return;
    const newPoint: Point = {
      id: `p-${Date.now()}`,
      x,
      y,
      state: 'default'
    };
    setPoints(prev => [...prev, newPoint]);
    // Clear hull if we modify points
    if (hull.length > 0) {
      setHull([]);
      setIsFinished(false);
      setMessage('Point added. Re-run algorithm.');
    }
  };

  // --- MATH HELPERS ---
  
  // Cross product of vectors OA and OB
  const crossProduct = (o: Point, a: Point, b: Point) => {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  };

  const distSq = (p1: Point, p2: Point) => {
    return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
  };

  // --- ALGORITHMS ---

  const runAlgorithm = async () => {
    if (points.length < 3) {
      setMessage("Need at least 3 points to form a hull.");
      return;
    }
    setIsRunning(true);
    setHull([]);
    setIsFinished(false);

    if (algorithm === 'graham') await runGrahamScan();
    else if (algorithm === 'jarvis') await runJarvisMarch();
    else if (algorithm === 'monotone') await runMonotoneChain();

    setIsRunning(false);
    setIsFinished(true);
    setCandidateLine(null);
    setActivePoint(null);
    setMessage("Convex Hull Complete.");
    play('success');
  };

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms / speed));

  const runGrahamScan = async () => {
    // 1. Find bottom-most point (or left-most if tie)
    let startPoint = points[0];
    for (const p of points) {
      if (p.y > startPoint.y || (p.y === startPoint.y && p.x < startPoint.x)) {
        startPoint = p;
      }
    }

    setMessage("Step 1: Finding the lowest Y-coordinate point (Start Point).");
    setActivePoint(startPoint);
    await wait(800);

    // 2. Sort by polar angle
    const sortedPoints = [...points].filter(p => p.id !== startPoint.id).sort((a, b) => {
       const angleA = Math.atan2(a.y - startPoint.y, a.x - startPoint.x);
       const angleB = Math.atan2(b.y - startPoint.y, b.x - startPoint.x);
       if (Math.abs(angleA - angleB) < 0.0001) return distSq(startPoint, a) - distSq(startPoint, b);
       return angleA - angleB; 
    });

    setMessage("Step 2: Sorting points by polar angle from Start Point.");
    await wait(500);

    const stack: Point[] = [startPoint];
    setHull([...stack]);
    
    for (const p of sortedPoints) {
      if (!isMounted.current) return;
      
      setActivePoint(p);
      setMessage(`Considering point ${Math.round(p.x)},${Math.round(p.y)}`);
      
      while (stack.length >= 2) {
        const top = stack[stack.length - 1];
        const nextToTop = stack[stack.length - 2];
        
        setCandidateLine({ p1: nextToTop, p2: top });
        await wait(300);

        // Check turn
        const cp = crossProduct(nextToTop, top, p);
        if (cp <= 0) {
          // Right turn or collinear -> Pop
          setMessage("Right Turn (or collinear). Removing last point from hull.");
          play('delete');
          stack.pop();
          setHull([...stack]);
          await wait(400);
        } else {
          setMessage("Left Turn. Valid extension.");
          break;
        }
      }
      stack.push(p);
      setHull([...stack]);
      play('click');
      await wait(300);
    }
    
    // Close the loop visually
    setHull([...stack, startPoint]); 
  };

  const runJarvisMarch = async () => {
    // 1. Leftmost point
    let pointOnHull = points[0];
    for (const p of points) {
      if (p.x < pointOnHull.x) pointOnHull = p;
    }

    const hullPoints = [];
    let endpoint: Point;
    
    setMessage("Starting at Leftmost Point.");
    setActivePoint(pointOnHull);
    await wait(500);

    let i = 0;
    do {
      hullPoints.push(pointOnHull);
      setHull([...hullPoints]);
      endpoint = points[0];
      
      for (const p of points) {
        if (!isMounted.current) return;
        if (p.id === pointOnHull.id) continue;

        setCandidateLine({ p1: pointOnHull, p2: endpoint });
        setActivePoint(p); 
        
        const turn = crossProduct(pointOnHull, endpoint, p);
        
        // Find point most to the "right" (CW) in screen coordinates
        if (endpoint.id === pointOnHull.id || turn > 0) { 
           endpoint = p;
        }
        await wait(20);
      }
      
      setMessage(`Found hull edge to ${Math.round(endpoint.x)},${Math.round(endpoint.y)}`);
      play('click');
      pointOnHull = endpoint;
      await wait(400);
      
      i++;
      if (i > points.length + 1) break; // Safety break
    } while (endpoint.id !== hullPoints[0].id);

    setHull([...hullPoints, hullPoints[0]]); // Close loop
  };

  const runMonotoneChain = async () => {
    // 1. Sort by X
    const sorted = [...points].sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);
    
    setMessage("Step 1: Sort by X-coordinate.");
    await wait(500);

    const lower: Point[] = [];
    setMessage("Step 2: Build Lower Hull.");
    
    for (const p of sorted) {
      if (!isMounted.current) return;
      setActivePoint(p);
      
      while (lower.length >= 2) {
        const last = lower[lower.length - 1];
        const prev = lower[lower.length - 2];
        setCandidateLine({ p1: prev, p2: last });
        
        const val = crossProduct(prev, last, p);
        if (val < 0) { // Left Turn 
           play('delete');
           lower.pop();
           setHull([...lower]); 
           await wait(100);
        } else {
          break;
        }
      }
      lower.push(p);
      setHull([...lower]);
      play('click');
      await wait(100);
    }

    const upper: Point[] = [];
    setMessage("Step 3: Build Upper Hull.");
    
    for (let i = sorted.length - 1; i >= 0; i--) {
      const p = sorted[i];
      if (!isMounted.current) return;
      setActivePoint(p);

      while (upper.length >= 2) {
        const last = upper[upper.length - 1];
        const prev = upper[upper.length - 2];
        setCandidateLine({ p1: prev, p2: last });
        
        const val = crossProduct(prev, last, p);
        if (val < 0) {
           play('delete');
           upper.pop();
           setHull([...lower, ...upper]); 
           await wait(100);
        } else {
          break;
        }
      }
      upper.push(p);
      setHull([...lower, ...upper]);
      play('click');
      await wait(100);
    }

    // Concatenate
    lower.pop();
    upper.pop();
    setHull([...lower, ...upper, lower[0]]);
  };

  return {
    points,
    hull,
    candidateLine,
    activePoint,
    algorithm,
    setAlgorithm,
    generatePoints,
    clearPoints,
    addPoint,
    runAlgorithm,
    isRunning,
    message,
    speed,
    setSpeed
  };
};