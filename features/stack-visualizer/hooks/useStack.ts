import { useState, useRef, useEffect } from 'react';
import { StackItem, StackOperation } from '../types';

const MAX_SIZE = 10;
const SLEEP_TIME = 800;

export const useStack = () => {
  const [stack, setStack] = useState<StackItem[]>([]);
  const [operation, setOperation] = useState<StackOperation>('idle');
  const [message, setMessage] = useState('Ready to Stack');
  const [peekIndex, setPeekIndex] = useState<number | null>(null);

  const stackRef = useRef(stack);
  stackRef.current = stack;

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const sleep = async (ms: number) => {
    await new Promise(resolve => setTimeout(resolve, ms));
    if (!isMounted.current) throw new Error('Unmounted');
  };

  const safeSetMessage = (msg: string) => {
    if (isMounted.current) setMessage(msg);
  };

  const safeSetOperation = (op: StackOperation) => {
    if (isMounted.current) setOperation(op);
  };

  const push = async (value: string | number, type: StackItem['type'] = 'default') => {
    if (stackRef.current.length >= MAX_SIZE) {
      safeSetOperation('overflow');
      safeSetMessage('Stack Overflow! Maximum capacity reached.');
      try { await sleep(1000); } catch(e) { return false; }
      safeSetOperation('idle');
      return false;
    }

    try {
      safeSetOperation('pushing');
      safeSetMessage(`Pushing "${value}" to stack...`);
      
      const newItem: StackItem = {
        id: Math.random().toString(36).substr(2, 9),
        value,
        type
      };

      if(isMounted.current) setStack(prev => [...prev, newItem]);
      await sleep(SLEEP_TIME / 2);
      
      safeSetMessage(`Item pushed to index ${stackRef.current.length}`); // Using ref which is updated on render, but here we can trust it approximates
      safeSetOperation('idle');
      return true;
    } catch (e) {
      return false;
    }
  };

  const pop = async () => {
    if (stackRef.current.length === 0) {
      safeSetMessage('Stack Underflow! Cannot pop from empty stack.');
      try { await sleep(1000); } catch(e) { return null; }
      return null;
    }

    try {
      safeSetOperation('popping');
      const item = stackRef.current[stackRef.current.length - 1];
      safeSetMessage(`Popping "${item.value}"...`);

      // Visual delay before removal
      await sleep(SLEEP_TIME / 2);
      if(isMounted.current) setStack(prev => prev.slice(0, -1));
      
      await sleep(SLEEP_TIME / 2);
      safeSetMessage(`Popped "${item.value}"`);
      safeSetOperation('idle');
      return item;
    } catch (e) {
      return null;
    }
  };

  const peek = async () => {
    if (stackRef.current.length === 0) {
      safeSetMessage('Stack is empty.');
      return;
    }

    try {
      safeSetOperation('peeking');
      const index = stackRef.current.length - 1;
      if(isMounted.current) setPeekIndex(index);
      safeSetMessage(`Peeking at top: "${stackRef.current[index].value}"`);
      
      await sleep(1500);
      if(isMounted.current) setPeekIndex(null);
      safeSetOperation('idle');
    } catch (e) {
      // Unmounted
    }
  };

  const clear = () => {
    setStack([]);
    setMessage('Stack cleared.');
    setOperation('idle');
  };

  // --- SCENARIOS ---

  const runBrowserScenario = async () => {
    clear();
    try {
      await sleep(500);
      
      const sites = ['google.com', 'github.com', 'stackoverflow.com', 'react.dev'];
      
      for (const site of sites) {
        const success = await push(site, 'url');
        if (!success) break;
        await sleep(300);
      }
      
      await sleep(1000);
      safeSetMessage("User clicks Back button...");
      await sleep(1000);
      await pop();
      
      await sleep(500);
      safeSetMessage("User clicks Back button...");
      await sleep(1000);
      await pop();
    } catch(e) {}
  };

  const runRecursionScenario = async () => {
    clear();
    try {
      await sleep(500);
      
      const n = 5;
      safeSetMessage(`Calculating factorial(${n})...`);
      await sleep(1000);

      for (let i = n; i >= 1; i--) {
        await push(`factorial(${i})`, 'code');
        await sleep(500);
      }

      safeSetMessage("Base case reached. Unwinding stack...");
      await sleep(1000);

      while (stackRef.current.length > 0) {
        if (!isMounted.current) break;
        await pop();
        await sleep(300);
      }
      
      safeSetMessage("Calculation complete: 120");
      safeSetOperation('success');
      await sleep(2000);
      safeSetOperation('idle');
    } catch(e) {}
  };

  const runParenthesesScenario = async () => {
    clear();
    try {
      await sleep(500);
      
      const expression = "(()())";
      safeSetMessage(`Checking balance for: ${expression}`);
      await sleep(1000);

      for (const char of expression) {
        if (!isMounted.current) return;
        if (char === '(') {
          await push(char, 'paren');
        } else if (char === ')') {
          if (stackRef.current.length === 0) {
            safeSetMessage("Error: Unbalanced closing parenthesis!");
            safeSetOperation('overflow'); // shake effect
            return;
          }
          safeSetMessage("Found matching pair '()'");
          await pop();
        }
        await sleep(500);
      }

      if (stackRef.current.length === 0) {
        safeSetMessage("Success: Parentheses are balanced!");
        safeSetOperation('success');
      } else {
        safeSetMessage("Error: Unclosed parentheses remaining!");
        safeSetOperation('overflow');
      }
      await sleep(2000);
      safeSetOperation('idle');
    } catch(e) {}
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
