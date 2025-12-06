import { useCallback } from 'react';
import { SortStep, AlgorithmType } from '../types';

export const useSortingAlgorithms = () => {
  
  const generateSteps = useCallback((array: number[], type: AlgorithmType): SortStep[] => {
    const steps: SortStep[] = [];
    const arr = [...array]; // Work on a copy

    // Helper to record state
    const record = (
      comparing: number[] = [], 
      swapping: number[] = [], 
      sorted: number[] = [], 
      pivot?: number,
      desc: string = ''
    ) => {
      steps.push({
        array: [...arr],
        comparing,
        swapping,
        sorted: [...sorted], // Copy sorted array if managed externally, or passed in
        pivot,
        description: desc
      });
    };

    // --- ALGORITHMS ---

    const bubbleSort = () => {
      const n = arr.length;
      const sortedIndices: number[] = [];
      
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          record([j, j + 1], [], sortedIndices, undefined, `Comparing ${arr[j]} and ${arr[j+1]}`);
          
          if (arr[j] > arr[j + 1]) {
            // Swap
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            record([j, j + 1], [j, j + 1], sortedIndices, undefined, 'Swap!');
          }
        }
        sortedIndices.push(n - i - 1);
        record([], [], sortedIndices, undefined, `${arr[n-i-1]} is sorted`);
      }
      // Final state
      record([], [], Array.from({length: n}, (_, i) => i), undefined, 'Done');
    };

    const selectionSort = () => {
      const n = arr.length;
      const sortedIndices: number[] = [];

      for (let i = 0; i < n; i++) {
        let minIdx = i;
        record([i], [], sortedIndices, undefined, `Current minimum at index ${i}`);

        for (let j = i + 1; j < n; j++) {
          record([minIdx, j], [], sortedIndices, undefined, `Check if ${arr[j]} < ${arr[minIdx]}`);
          if (arr[j] < arr[minIdx]) {
            minIdx = j;
            record([minIdx], [], sortedIndices, undefined, `New minimum found: ${arr[minIdx]}`);
          }
        }

        if (minIdx !== i) {
          [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
          record([i, minIdx], [i, minIdx], sortedIndices, undefined, `Swap minimum to position ${i}`);
        }
        sortedIndices.push(i);
      }
      record([], [], Array.from({length: n}, (_, i) => i), undefined, 'Done');
    };

    const insertionSort = () => {
      const n = arr.length;
      // We consider index 0 sorted initially conceptually
      
      for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        
        record([i], [], Array.from({length: i}, (_, k) => k), undefined, `Selected key ${key}`);

        while (j >= 0 && arr[j] > key) {
          record([j, j+1], [], [], undefined, `${arr[j]} > ${key}, shifting right`);
          arr[j + 1] = arr[j];
          record([], [j+1], [], undefined, 'Shifted');
          j = j - 1;
        }
        arr[j + 1] = key;
        record([], [j+1], [], undefined, `Inserted ${key} at position ${j+1}`);
      }
      record([], [], Array.from({length: n}, (_, i) => i), undefined, 'Done');
    };

    const mergeSort = (start: number, end: number) => {
        if (start >= end) return;
        
        const mid = Math.floor((start + end) / 2);
        mergeSort(start, mid);
        mergeSort(mid + 1, end);
        merge(start, mid, end);
    };

    const merge = (start: number, mid: number, end: number) => {
        const leftArr = arr.slice(start, mid + 1);
        const rightArr = arr.slice(mid + 1, end + 1);
        let i = 0, j = 0, k = start;

        record([], [], [], undefined, `Merging range ${start}-${end}`);

        while (i < leftArr.length && j < rightArr.length) {
            record([start + i, mid + 1 + j], [], [], undefined, `Comparing ${leftArr[i]} and ${rightArr[j]}`);
            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i];
                record([], [k], [], undefined, `Overwrite index ${k} with ${leftArr[i]}`);
                i++;
            } else {
                arr[k] = rightArr[j];
                record([], [k], [], undefined, `Overwrite index ${k} with ${rightArr[j]}`);
                j++;
            }
            k++;
        }

        while (i < leftArr.length) {
            arr[k] = leftArr[i];
            record([], [k], [], undefined, `Flush remaining left: ${leftArr[i]}`);
            i++;
            k++;
        }
        while (j < rightArr.length) {
            arr[k] = rightArr[j];
            record([], [k], [], undefined, `Flush remaining right: ${rightArr[j]}`);
            j++;
            k++;
        }
    };

    const quickSort = (low: number, high: number) => {
      if (low < high) {
        const pi = partition(low, high);
        // We can consider pi sorted after partition
        quickSort(low, pi - 1);
        quickSort(pi + 1, high);
      } else if (low === high) {
         // Single element is sorted
      }
    };

    const partition = (low: number, high: number) => {
      const pivot = arr[high];
      let i = low - 1;
      
      record([high], [], [], high, `Partitioning around pivot ${pivot}`);

      for (let j = low; j < high; j++) {
        record([j, high], [], [], high, `Comparing ${arr[j]} with pivot`);
        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          record([i, j], [i, j], [], high, 'Swap smaller element to left');
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      record([i+1, high], [i+1, high], [], i+1, 'Place pivot in correct position');
      
      return i + 1;
    };

    const heapSort = () => {
        const n = arr.length;
        // Build heap
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            heapify(n, i);
        }

        const sortedIndices: number[] = [];
        // Extract
        for (let i = n - 1; i > 0; i--) {
            record([0, i], [0, i], sortedIndices, undefined, `Swap max (root) to end`);
            [arr[0], arr[i]] = [arr[i], arr[0]];
            sortedIndices.push(i);
            heapify(i, 0);
        }
        sortedIndices.push(0);
        record([], [], sortedIndices, undefined, 'Done');
    };

    const heapify = (n: number, i: number) => {
        let largest = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;

        if (l < n) {
            record([l, largest], [], [], undefined, 'Heapify: Check left child');
            if (arr[l] > arr[largest]) largest = l;
        }

        if (r < n) {
            record([r, largest], [], [], undefined, 'Heapify: Check right child');
            if (arr[r] > arr[largest]) largest = r;
        }

        if (largest !== i) {
            record([i, largest], [i, largest], [], undefined, 'Heapify: Swap parent with largest child');
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            heapify(n, largest);
        }
    };

    // --- EXECUTE ---
    switch (type) {
      case 'bubble': bubbleSort(); break;
      case 'selection': selectionSort(); break;
      case 'insertion': insertionSort(); break;
      case 'merge': 
        mergeSort(0, arr.length - 1); 
        record([], [], Array.from({length: arr.length}, (_, i) => i), undefined, 'Done');
        break;
      case 'quick': 
        quickSort(0, arr.length - 1); 
        record([], [], Array.from({length: arr.length}, (_, i) => i), undefined, 'Done');
        break;
      case 'heap': heapSort(); break;
    }

    return steps;
  }, []);

  return { generateSteps };
};