import { useState, useCallback, useRef, useEffect } from 'react';
import { Point, HullAlgorithm, HullStep } from '../types';
import { useSound } from '../../../shared/context/SoundContext';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;
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
  // returns positive for left turn, negative for right turn, 0 for collinear
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
      const cp = crossProduct(startPoint, a, b);
      if (Math.abs(cp) < 0.000001) {
        // Collinear: closer point first? typically keep farthest for hull if including collinear
        // Simplified: keep farthest
        return distSq(startPoint, a) - distSq(startPoint, b);
      }
      return cp > 0 ? -1 : 1; // Left turn first implies smaller angle?
      // Wait, standard polar sort: cross product > 0 means b is left of oa.
      // So if cp > 0, order is a then b? No.
      // Standard: sort by angle.
      // atan2 is easier to debug visually
    });
    
    // Sort logic fix using atan2 for robustness
    sortedPoints.sort((a, b) => {
       const angleA = Math.atan2(a.y - startPoint.y, a.x - startPoint.x);
       const angleB = Math.atan2(b.y - startPoint.y, b.x - startPoint.x);
       if (Math.abs(angleA - angleB) < 0.0001) return distSq(startPoint, a) - distSq(startPoint, b);
       return angleA - angleB; 
    });

    setMessage("Step 2: Sorting points by polar angle from Start Point.");
    // Visual flash of sorted order could be nice, but skipping for brevity
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
        setActivePoint(p); // The point being tested against current best 'endpoint'
        
        // We want to find the point that is "most left" relative to pointOnHull
        // If (pointOnHull -> endpoint -> p) is a LEFT turn, then p is better than endpoint
        // Wait, Jarvis finds point with smallest polar angle relative to current.
        // Equivalent to: for all other points x, (current, next, x) is NOT a left turn.
        // i.e., next is the most clockwise point? No, counter-clockwise wrapper.
        // We want the point that is most to the *right* relative to current heading if we are wrapping CCW?
        // Standard Jarvis: Next point is such that all other points lie to the left of line (curr, next).
        
        const turn = crossProduct(pointOnHull, endpoint, p);
        
        // Visualizing the scan is O(N) per hull point
        // Using wait(50) for fast scan
        // await wait(20); 

        // If p is to the right of (pointOnHull -> endpoint), update endpoint
        // Cross product: (b-a)x(c-a). Left turn is positive (in standard coord system? screen coords Y is down!)
        // In screen coords (Y down):
        // CP > 0 means Right Turn? 
        // Let's verify: O(0,0), A(10,0), B(10,10). 
        // OA = (10,0), OB = (10,10). Cross = 10*10 - 0*10 = 100 > 0.
        // Visually O->A is right, B is down (Y+). So A to B is a Right Turn visually.
        // Wait, standard hull is CCW.
        // In screen coords, CCW is "Right Turn" logic if we treat Y up. 
        // Let's stick to logic: We want to find point such that all others are on one side.
        
        // Logic: if (endpoint == pointOnHull) or (p is to the left of line pointOnHull->endpoint)
        if (endpoint.id === pointOnHull.id || turn > 0) { // Screen coords: turn > 0 is "Left" relative to vector? 
           // Actually in screen coords (y down):
           // (1,0) x (0,1) = 1*1 - 0 = 1. (1,0) is Right, (0,1) is Down. Right to Down is Clockwise (Right Turn).
           // So > 0 is Right Turn (CW).
           // < 0 is Left Turn (CCW).
           // We want hull CCW? Then we want most Right Turn (CW) points if we are wrapping?
           // Actually, Jarvis usually wraps "Left" (CCW).
           // Let's assume we want to turn Left as much as possible? No, we want the point that makes the "least left" turn (closest to straight) to keep everyone else on left?
           // No, we want the point that is most 'to the right' relative to current, such that everyone else is to the left.
           // i.e. find p such that (curr, p, x) is Left Turn for all x.
           // This means p maximizes the right-turn-ness?
           
           // Simpler: Find p such that crossProduct(curr, p, x) <= 0 for all x. (Screen coords: Left Turn is < 0)
           
           // Code adjustment:
           // If crossProduct(curr, endpoint, p) < 0, then p is "more left" than endpoint. 
           // We want the point that is "most right" (closest to previous vector).
           // Actually let's just find the point `q` such that `(p, q, r)` is Left Turn (Counter-Clockwise) for all r.
           // In Screen Coords: Left Turn is CP < 0.
           // So we want `q` such that CP(p, q, r) < 0 for all r.
           // This implies `q` is the most "Clockwise" relative to `p`? 
           // Let's try: endpoint = p; if CP(curr, endpoint, p) < 0 (Left), then update? No.
           
           // Correct logic for finding next hull point in CCW wrapping:
           // Select `q` such that for any other point `r`, `(p, q, r)` is a Right Turn (or straight).
           // In screen coords, Right Turn is CP > 0.
           // So if CP(curr, endpoint, p) < 0 (Left Turn), then `p` is "to the left" of `endpoint`. 
           // If we want to enclose points CCW, we want the point that is most "Right" (CW) relative to current? 
           // No, to wrap around the outside, we want the point that is most "Left" (CCW) relative to current facing?
           // Actually it's simple: pick a candidate. If `p` is to the right of `curr->candidate`, then `p` is outside the current selection, so update candidate to `p`.
           // In Screen Y-Down: "Right" is CP > 0.
           // So if CP(curr, endpoint, p) > 0, update endpoint = p.
           endpoint = p;
        }
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
        
        // We want Counter-Clockwise turns.
        // In screen (Y down), CP > 0 is CW (Right), CP < 0 is CCW (Left).
        // For lower hull (left to right), we want Right Turns (CP > 0) to "bulge out" downwards?
        // Actually lower hull in Y-down coords looks like "Upper" visually if Y was up.
        // Let's stick to standard: Lower hull needs CP <= 0 (CCW/Left)? No.
        // Standard Monotone:
        // Lower hull: cross(lower[-2], lower[-1], p) <= 0
        // Screen coords: <= 0 is Left Turn (CCW).
        // Since Y is down, "Left" goes "Up". So this builds the "Top" visual hull?
        // Let's test CP sign logic: (0,0) -> (1,1) -> (2,0). V shape.
        // (1,1)-(0,0) = (1,1). (2,0)-(0,0) = (2,0).
        // 1*0 - 1*2 = -2. CP < 0. Left Turn.
        // This V shape is consistent with "Lower" hull in standard math (y up), but "Upper" in screen (y down).
        
        // Let's simply remove points that make "concave" dent.
        // For Lower Hull (visual bottom), we are moving Right. We want to turn "Right" (CW) to wrap bottom?
        // CW is CP > 0.
        // If CP < 0 (Left Turn), we are turning "inwards/upwards", so remove last.
        
        const val = crossProduct(prev, last, p);
        if (val < 0) { // Left Turn (Visually Upwards)
           play('delete');
           lower.pop();
           setHull([...lower]); // Visualize intermediate
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
        
        // For upper hull (right to left), we also want to stay "outside".
        // Visual Top requires turning "Right" (CW) relative to travel direction (Leftwards)?
        // No, moving Right->Left. 
        // Let's use the same CP logic logic but reverse iteration.
        // If CP < 0 (Left Turn), remove.
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