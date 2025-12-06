import { useState, useCallback, useRef, useEffect } from 'react';
import { MatrixCell, MatrixOperation, MatrixStep, GenerationMode } from '../types';
import { sleep } from '../../../shared/utils/time';
import { useSound } from '../../../shared/context/SoundContext';

const DEFAULT_ROWS = 5;
const DEFAULT_COLS = 5;

export const useMatrix = () => {
  const [grid, setGrid] = useState<MatrixCell[][]>([]);
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [operation, setOperation] = useState<MatrixOperation>('idle');
  const [message, setMessage] = useState('Ready');
  const [speed, setSpeed] = useState<number>(1); // Speed multiplier
  
  const isMounted = useRef(true);
  const { play } = useSound();

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const wait = async (baseMs: number = 300) => {
    await sleep(baseMs / speed);
    if (!isMounted.current) throw new Error('Unmounted');
  };

  // --- GENERATION ---

  const generateGrid = useCallback((r: number, c: number, mode: GenerationMode = 'random') => {
    const newGrid: MatrixCell[][] = [];
    let counter = 1;

    for (let i = 0; i < r; i++) {
      const row: MatrixCell[] = [];
      for (let j = 0; j < c; j++) {
        let val = 0;
        if (mode === 'sorted') val = counter++;
        else if (mode === 'zeroes') val = Math.random() > 0.8 ? 0 : Math.floor(Math.random() * 9) + 1;
        else val = Math.floor(Math.random() * 99) + 1;

        row.push({
          id: `cell-${i}-${j}-${Date.now()}`,
          row: i,
          col: j,
          value: val,
          state: 'default'
        });
      }
      newGrid.push(row);
    }
    setRows(r);
    setCols(c);
    setGrid(newGrid);
    setOperation('idle');
    setMessage(`Generated ${r}x${c} Matrix (${mode})`);
  }, []);

  // Initialize
  useEffect(() => {
    generateGrid(DEFAULT_ROWS, DEFAULT_COLS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- UTILS ---
  
  const resetStates = () => {
    setGrid(prev => prev.map(row => row.map(cell => ({ ...cell, state: 'default', visitOrder: undefined }))));
  };

  const updateCell = (r: number, c: number, updates: Partial<MatrixCell>) => {
    setGrid(prev => {
      const newGrid = [...prev];
      const newRow = [...newGrid[r]];
      newRow[c] = { ...newRow[c], ...updates };
      newGrid[r] = newRow;
      return newGrid;
    });
  };

  // --- ALGORITHMS ---

  const runSpiral = async () => {
    if (operation !== 'idle') return;
    try {
      setOperation('spiral');
      resetStates();
      await wait();

      let top = 0, bottom = rows - 1, left = 0, right = cols - 1;
      let count = 1;

      while (top <= bottom && left <= right) {
        // Right
        for (let i = left; i <= right; i++) {
          updateCell(top, i, { state: 'active', visitOrder: count++ });
          setMessage(`Traversing Right: [${top}, ${i}]`);
          play('click');
          await wait();
          updateCell(top, i, { state: 'visited' });
        }
        top++;

        // Down
        for (let i = top; i <= bottom; i++) {
          updateCell(i, right, { state: 'active', visitOrder: count++ });
          setMessage(`Traversing Down: [${i}, ${right}]`);
          play('click');
          await wait();
          updateCell(i, right, { state: 'visited' });
        }
        right--;

        // Left
        if (top <= bottom) {
          for (let i = right; i >= left; i--) {
            updateCell(bottom, i, { state: 'active', visitOrder: count++ });
            setMessage(`Traversing Left: [${bottom}, ${i}]`);
            play('click');
            await wait();
            updateCell(bottom, i, { state: 'visited' });
          }
          bottom--;
        }

        // Up
        if (left <= right) {
          for (let i = bottom; i >= top; i--) {
            updateCell(i, left, { state: 'active', visitOrder: count++ });
            setMessage(`Traversing Up: [${i}, ${left}]`);
            play('click');
            await wait();
            updateCell(i, left, { state: 'visited' });
          }
          left++;
        }
      }
      
      setMessage('Spiral Traversal Complete');
      play('success');
      setOperation('idle');
    } catch (e) {}
  };

  const runRotate = async () => {
    if (operation !== 'idle') return;
    try {
      setOperation('rotate');
      resetStates();
      setMessage("Rotating 90° Clockwise (Layer by Layer)...");
      await wait(800);

      // Deep copy logic for visual transition is tricky. 
      // We will perform swaps and let React key-based layout animation handle movement.
      
      let n = rows; // Assuming square for clean rotation, but code handles NxN
      // If rectangle, transpose + reverse row is easier, but standard rotation is usually NxN
      if (rows !== cols) {
        setMessage("Rotation requires a square matrix for in-place demo. Resizing...");
        generateGrid(Math.max(rows, cols), Math.max(rows, cols), 'random');
        n = Math.max(rows, cols);
        await wait(1000);
      }

      // Transpose
      setMessage("Step 1: Transpose (Swap A[i][j] with A[j][i])");
      for(let i=0; i<n; i++) {
        for(let j=i; j<n; j++) {
          if (i !== j) {
            updateCell(i, j, { state: 'active' });
            updateCell(j, i, { state: 'active' });
            await wait(400);
            
            setGrid(prev => {
              const newG = prev.map(r => r.map(c => ({...c})));
              const temp = newG[i][j].value;
              const tempId = newG[i][j].id; // Keep ID for layout animation? Or swap IDs?
              // Actually, swapping values but keeping IDs fixed in position breaks 'layout' animation of movement.
              // To animate movement, we must swap the objects themselves in the array.
              
              const tempCell = newG[i][j];
              newG[i][j] = newG[j][i];
              newG[j][i] = tempCell;
              
              // Fix coordinates in cell data
              newG[i][j].row = i; newG[i][j].col = j;
              newG[j][i].row = j; newG[j][i].col = i;
              
              return newG;
            });
            play('pop');
            await wait(400);
            
            updateCell(i, j, { state: 'default' });
            updateCell(j, i, { state: 'default' });
          }
        }
      }

      await wait(500);
      setMessage("Step 2: Reverse each row");
      
      // Reverse Rows
      for(let i=0; i<n; i++) {
        let left = 0, right = n-1;
        while(left < right) {
          updateCell(i, left, { state: 'active' });
          updateCell(i, right, { state: 'active' });
          await wait(300);

          setGrid(prev => {
            const newG = prev.map(r => r.map(c => ({...c})));
            const temp = newG[i][left];
            newG[i][left] = newG[i][right];
            newG[i][right] = temp;
            
            newG[i][left].col = left;
            newG[i][right].col = right;
            
            return newG;
          });
          play('pop');
          await wait(300);
          
          updateCell(i, left, { state: 'default' });
          updateCell(i, right, { state: 'default' });
          left++;
          right--;
        }
      }

      setMessage("Rotation Complete");
      play('success');
      setOperation('idle');
    } catch (e) {}
  };

  const runSearch = async (target: number) => {
    if (operation !== 'idle') return;
    try {
      setOperation('search');
      resetStates();
      setMessage(`Searching for ${target} (Staircase Search)...`);
      await wait();

      // Ensure sorted for this demo or just warn?
      // Best to let it try or check sorted property.
      // We'll assume visually "sorted" implies row/col sorted.
      
      let r = 0;
      let c = cols - 1;
      let found = false;

      while (r < rows && c >= 0) {
        updateCell(r, c, { state: 'active' });
        const val = grid[r][c].value;
        setMessage(`Checking [${r}, ${c}]: ${val}`);
        play('click');
        await wait(600);

        if (val === target) {
          updateCell(r, c, { state: 'found' });
          setMessage(`Found ${target} at [${r}, ${c}]!`);
          play('success');
          found = true;
          break;
        } else if (val > target) {
          setMessage(`${val} > ${target}. Move Left.`);
          updateCell(r, c, { state: 'visited' }); // eliminated column
          c--;
        } else {
          setMessage(`${val} < ${target}. Move Down.`);
          updateCell(r, c, { state: 'visited' }); // eliminated row
          r++;
        }
        await wait();
      }

      if (!found) {
        setMessage(`${target} not found in matrix.`);
        play('error');
      }
      setOperation('idle');
    } catch (e) {}
  };

  const runSetZeroes = async () => {
    if (operation !== 'idle') return;
    try {
      setOperation('set-zeroes');
      resetStates();
      setMessage("Step 1: Mark rows and columns containing zeros");
      await wait();

      const zeroRows = new Set<number>();
      const zeroCols = new Set<number>();

      // Find zeros
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          updateCell(i, j, { state: 'active' });
          await wait(50); // fast scan
          if (grid[i][j].value === 0) {
            updateCell(i, j, { state: 'zero' });
            zeroRows.add(i);
            zeroCols.add(j);
            play('error'); // distinct sound for finding zero
            setMessage(`Found 0 at [${i}, ${j}]. Marking row ${i} and col ${j}.`);
            await wait(500);
          } else {
            updateCell(i, j, { state: 'default' });
          }
        }
      }

      setMessage("Step 2: Update marked rows and columns to 0");
      await wait(1000);

      // Animate update
      for (let r of Array.from(zeroRows)) {
        for (let c = 0; c < cols; c++) {
          if (grid[r][c].value !== 0) {
             updateCell(r, c, { state: 'active' });
             await wait(100);
             setGrid(prev => {
                const g = [...prev];
                g[r][c] = { ...g[r][c], value: 0, state: 'zero' };
                return g;
             });
             play('delete');
          }
        }
      }

      for (let c of Array.from(zeroCols)) {
        for (let r = 0; r < rows; r++) {
          if (grid[r][c].value !== 0) { // check if not already set by row pass
             updateCell(r, c, { state: 'active' });
             await wait(100);
             setGrid(prev => {
                const g = [...prev];
                g[r][c] = { ...g[r][c], value: 0, state: 'zero' };
                return g;
             });
             play('delete');
          }
        }
      }

      setMessage("Matrix updated.");
      play('success');
      setOperation('idle');
    } catch (e) {}
  };

  return {
    grid,
    rows,
    cols,
    operation,
    message,
    speed,
    setSpeed,
    setRows,
    setCols,
    generateGrid,
    runSpiral,
    runRotate,
    runSearch,
    runSetZeroes,
    resetStates
  };
};