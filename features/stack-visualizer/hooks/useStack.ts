import { useState, useRef, useCallback } from 'react';
import { StackItem, StackOperation } from '../types';

const MAX_SIZE = 10;
const SLEEP_TIME = 800;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useStack = () => {
  const [stack, setStack] = useState<StackItem[]>([]);
  const [operation, setOperation] = useState<StackOperation>('idle');
  const [message, setMessage] = useState('Ready to Stack');
  const [peekIndex, setPeekIndex] = useState<number | null>(null);

  const stackRef = useRef(stack);
  stackRef.current = stack;

  const push = async (value: string | number, type: StackItem['type'] = 'default') => {
    if (stackRef.current.length >= MAX_SIZE) {
      setOperation('overflow');
      setMessage('Stack Overflow! Maximum capacity reached.');
      await sleep(1000);
      setOperation('idle');
      return false;
    }

    setOperation('pushing');
    setMessage(`Pushing "${value}" to stack...`);
    
    const newItem: StackItem = {
      id: Math.random().toString(36).substr(2, 9),
      value,
      type
    };

    setStack(prev => [...prev, newItem]);
    await sleep(SLEEP_TIME / 2);
    setMessage(`Item pushed to index ${stackRef.current.length}`);
    setOperation('idle');
    return true;
  };

  const pop = async () => {
    if (stackRef.current.length === 0) {
      setMessage('Stack Underflow! Cannot pop from empty stack.');
      await sleep(1000);
      return null;
    }

    setOperation('popping');
    const item = stackRef.current[stackRef.current.length - 1];
    setMessage(`Popping "${item.value}"...`);

    // Visual delay before removal
    await sleep(SLEEP_TIME / 2);
    setStack(prev => prev.slice(0, -1));
    
    await sleep(SLEEP_TIME / 2);
    setMessage(`Popped "${item.value}"`);
    setOperation('idle');
    return item;
  };

  const peek = async () => {
    if (stackRef.current.length === 0) {
      setMessage('Stack is empty.');
      return;
    }

    setOperation('peeking');
    const index = stackRef.current.length - 1;
    setPeekIndex(index);
    setMessage(`Peeking at top: "${stackRef.current[index].value}"`);
    
    await sleep(1500);
    setPeekIndex(null);
    setOperation('idle');
  };

  const clear = () => {
    setStack([]);
    setMessage('Stack cleared.');
    setOperation('idle');
  };

  // --- SCENARIOS ---

  const runBrowserScenario = async () => {
    clear();
    await sleep(500);
    
    const sites = ['google.com', 'github.com', 'stackoverflow.com', 'react.dev'];
    
    for (const site of sites) {
      const success = await push(site, 'url');
      if (!success) break;
      await sleep(300);
    }
    
    await sleep(1000);
    setMessage("User clicks Back button...");
    await sleep(1000);
    await pop();
    
    await sleep(500);
    setMessage("User clicks Back button...");
    await sleep(1000);
    await pop();
  };

  const runRecursionScenario = async () => {
    clear();
    await sleep(500);
    
    const n = 5;
    setMessage(`Calculating factorial(${n})...`);
    await sleep(1000);

    for (let i = n; i >= 1; i--) {
      await push(`factorial(${i})`, 'code');
      await sleep(500);
    }

    setMessage("Base case reached. Unwinding stack...");
    await sleep(1000);

    while (stackRef.current.length > 0) {
      await pop();
      await sleep(300);
    }
    
    setMessage("Calculation complete: 120");
    setOperation('success');
    await sleep(2000);
    setOperation('idle');
  };

  const runParenthesesScenario = async () => {
    clear();
    await sleep(500);
    
    const expression = "(()())";
    setMessage(`Checking balance for: ${expression}`);
    await sleep(1000);

    for (const char of expression) {
      if (char === '(') {
        await push(char, 'paren');
      } else if (char === ')') {
        if (stackRef.current.length === 0) {
          setMessage("Error: Unbalanced closing parenthesis!");
          setOperation('overflow'); // shake effect
          return;
        }
        setMessage("Found matching pair '()'");
        await pop();
      }
      await sleep(500);
    }

    if (stackRef.current.length === 0) {
      setMessage("Success: Parentheses are balanced!");
      setOperation('success');
    } else {
      setMessage("Error: Unclosed parentheses remaining!");
      setOperation('overflow');
    }
    await sleep(2000);
    setOperation('idle');
  };

  return {
    stack,
    operation,
    message,
    peekIndex,
    push,
    pop,
    peek,
    clear,
    scenarios: {
      browser: runBrowserScenario,
      recursion: runRecursionScenario,
      parentheses: runParenthesesScenario
    }
  };
};
