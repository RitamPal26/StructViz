import { useState, useRef, useEffect, useCallback } from 'react';
import { DPState, DPProblemType, CellState } from '../types';
import { sleep } from '../../../shared/utils/time';
import { useSound } from '../../../shared/context/SoundContext';

export const useDPAlgorithm = () => {
  const [problem, setProblem] = useState<DPProblemType>('lcs');
  const [inputs, setInputs] = useState<Record<string, any>>({ str1: 'ABC', str2: 'AC' });
  const [dpState, setDpState] = useState<DPState>({
    grid: [],
    rows: 0,
    cols: 0,
    rowLabels: [],
    colLabels: [],
    activeCell: null,
    message: 'Ready',
    result: null
  });
  
  const [playback, setPlayback] = useState({ isPlaying: false, speed: 1 });
  const isMounted = useRef(true);
  const { play } = useSound();

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const wait = async () => {
    await sleep(800 / playback.speed);
    if (!isMounted.current) throw new Error('Unmounted');
  };

  // --- ALGORITHMS ---

  const runLCS = async (s1: string, s2: string) => {
    const m = s1.length;
    const n = s2.length;
    
    // Initialize Grid
    const grid: CellState[][] = Array(m + 1).fill(null).map(() => 
      Array(n + 1).fill(null).map(() => ({ value: null, status: 'empty', dependencies: [] }))
    );

    const updateState = (msg: string, active: {r: number, c: number} | null) => {
      setDpState({
        grid: [...grid.map(row => [...row])],
        rows: m + 1,
        cols: n + 1,
        rowLabels: ['Ø', ...s1.split('')],
        colLabels: ['Ø', ...s2.split('')],
        activeCell: active,
        message: msg,
        result: null
      });
    };

    updateState("Initializing table...", null);
    await wait();

    // Fill
    for (let i = 0; i <= m; i++) {
      for (let j = 0; j <= n; j++) {
        if (!isMounted.current) return;

        let val = 0;
        let deps: {r:number, c:number}[] = [];
        let msg = "";

        if (i === 0 || j === 0) {
          val = 0;
          msg = `Base case: dp[${i}][${j}] = 0`;
        } else if (s1[i - 1] === s2[j - 1]) {
          val = (grid[i - 1][j - 1].value as number) + 1;
          deps = [{ r: i - 1, c: j - 1 }];
          msg = `'${s1[i - 1]}' == '${s2[j - 1]}': Match! 1 + diagonal`;
        } else {
          const top = grid[i - 1][j].value as number;
          const left = grid[i][j - 1].value as number;
          val = Math.max(top, left);
          deps = top > left ? [{ r: i - 1, c: j }] : [{ r: i, c: j - 1 }];
          msg = `No match. Max(top: ${top}, left: ${left})`;
        }

        grid[i][j] = { value: val, status: 'computing', dependencies: deps };
        updateState(msg, { r: i, c: j });
        play('click');
        await wait();

        grid[i][j].status = 'filled';
      }
    }

    // Backtrack
    updateState("Backtracking to find solution...", null);
    await wait();
    
    let i = m, j = n;
    let lcsStr = "";
    
    while (i > 0 && j > 0) {
      grid[i][j].status = 'path';
      updateState(`Checking dp[${i}][${j}]...`, {r:i, c:j});
      await wait();

      if (s1[i - 1] === s2[j - 1]) {
        lcsStr = s1[i - 1] + lcsStr;
        i--;
        j--;
        play('success');
      } else if ((grid[i - 1][j].value as number) > (grid[i][j - 1].value as number)) {
        i--;
      } else {
        j--;
      }
    }
    grid[i][j].status = 'path'; // Mark end
    
    updateState(`LCS Found: "${lcsStr}"`, null);
    setDpState(prev => ({ ...prev, result: lcsStr }));
    setPlayback(p => ({ ...p, isPlaying: false }));
  };

  const runKnapsack = async (capacity: number, items: {w: number, v: number}[]) => {
    const n = items.length;
    // Rows: 0 to n items
    // Cols: 0 to capacity
    const grid: CellState[][] = Array(n + 1).fill(null).map(() => 
      Array(capacity + 1).fill(null).map(() => ({ value: null, status: 'empty', dependencies: [] }))
    );

    const updateState = (msg: string, active: {r: number, c: number} | null) => {
      setDpState({
        grid: [...grid.map(row => [...row])],
        rows: n + 1,
        cols: capacity + 1,
        rowLabels: ['Ø', ...items.map((it, idx) => `Item ${idx+1} (w:${it.w}, v:${it.v})`)],
        colLabels: Array.from({length: capacity + 1}, (_, k) => `${k}`),
        activeCell: active,
        message: msg,
        result: null
      });
    };

    updateState("Initializing Knapsack table...", null);
    await wait();

    for (let i = 0; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        if (!isMounted.current) return;

        let val = 0;
        let deps: {r:number, c:number}[] = [];
        let msg = "";

        if (i === 0 || w === 0) {
          val = 0;
          msg = `Base case: 0`;
        } else {
          const item = items[i-1];
          if (item.w <= w) {
            const includeVal = item.v + (grid[i-1][w-item.w].value as number);
            const excludeVal = grid[i-1][w].value as number;
            
            if (includeVal > excludeVal) {
              val = includeVal;
              deps = [{ r: i-1, c: w-item.w }];
              msg = `Include Item ${i}: ${item.v} + dp[${i-1}][${w-item.w}] > Exclude`;
            } else {
              val = excludeVal;
              deps = [{ r: i-1, c: w }];
              msg = `Exclude Item ${i}: better to keep previous max`;
            }
          } else {
            val = grid[i-1][w].value as number;
            deps = [{ r: i-1, c: w }];
            msg = `Item ${i} weight (${item.w}) > capacity (${w}). Skip.`;
          }
        }

        grid[i][w] = { value: val, status: 'computing', dependencies: deps };
        updateState(msg, { r: i, c: w });
        play('click');
        await wait();
        grid[i][w].status = 'filled';
      }
    }

    // Backtrack logic omitted for brevity in demo, but highlights final
    const maxVal = grid[n][capacity].value;
    updateState(`Max Value possible: ${maxVal}`, null);
    setDpState(prev => ({ ...prev, result: `Max Value: ${maxVal}` }));
    setPlayback(p => ({ ...p, isPlaying: false }));
  };

  const runFibonacci = async (n: number) => {
    // 1D DP mapped to 2D for consistent visualizer: 1 Row, N+1 Cols
    const grid: CellState[][] = [Array(n + 1).fill(null).map(() => ({ value: null, status: 'empty', dependencies: [] }))];

    const updateState = (msg: string, active: {r: number, c: number} | null) => {
      setDpState({
        grid: [...grid.map(row => [...row])],
        rows: 1,
        cols: n + 1,
        rowLabels: ['Fib(n)'],
        colLabels: Array.from({length: n + 1}, (_, k) => `${k}`),
        activeCell: active,
        message: msg,
        result: null
      });
    };

    updateState("Calculating Fibonacci...", null);
    await wait();

    for(let i=0; i<=n; i++) {
        if (!isMounted.current) return;
        let val = 0;
        let deps = [];
        let msg = "";

        if (i <= 1) {
            val = i;
            msg = `Base case: Fib(${i}) = ${i}`;
        } else {
            const v1 = grid[0][i-1].value as number;
            const v2 = grid[0][i-2].value as number;
            val = v1 + v2;
            deps = [{r:0, c:i-1}, {r:0, c:i-2}];
            msg = `Fib(${i}) = Fib(${i-1}) + Fib(${i-2}) = ${v1} + ${v2}`;
        }

        grid[0][i] = { value: val, status: 'computing', dependencies: deps };
        updateState(msg, {r:0, c:i});
        play('click');
        await wait();
        grid[0][i].status = 'filled';
    }
    
    setDpState(prev => ({ ...prev, result: `Fib(${n}) = ${grid[0][n].value}` }));
    setPlayback(p => ({ ...p, isPlaying: false }));
  };

  // --- CONTROL ---

  const startVisualization = async () => {
    if (playback.isPlaying) return;
    setPlayback(p => ({ ...p, isPlaying: true }));
    
    try {
      if (problem === 'lcs') {
        await runLCS(inputs.str1 || 'ABC', inputs.str2 || 'AC');
      } else if (problem === 'knapsack') {
        // Default demo knapsack
        const demoItems = [{w: 1, v: 1}, {w: 3, v: 4}, {w: 4, v: 5}, {w: 5, v: 7}];
        await runKnapsack(inputs.capacity || 7, demoItems);
      } else if (problem === 'fibonacci') {
        await runFibonacci(inputs.n || 6);
      }
    } catch(e) {
      console.log("Stopped");
    }
  };

  const reset = () => {
    setPlayback({ isPlaying: false, speed: 1 });
    // This will trigger a re-render with clean slate in component based on key or manual set
    setDpState(prev => ({...prev, grid: [], message: 'Reset', result: null}));
  };

  return {
    dpState,
    playback,
    problem,
    inputs,
    setProblem: (p: DPProblemType) => { setProblem(p); reset(); },
    setInputs,
    setPlayback,
    startVisualization,
    reset
  };
};