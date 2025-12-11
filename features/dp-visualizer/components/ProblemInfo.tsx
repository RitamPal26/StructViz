import React from 'react';
import { DPProblemType } from '../types';

interface ProblemInfoProps {
  problem: DPProblemType;
}

export const ProblemInfo: React.FC<ProblemInfoProps> = ({ problem }) => {
  const info = {
    lcs: {
      title: "Longest Common Subsequence",
      recurrence: "if s1[i] == s2[j]: dp[i][j] = 1 + dp[i-1][j-1]\nelse: dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
      desc: "Finds the longest sequence of characters that appear in the same relative order in both strings."
    },
    knapsack: {
      title: "0/1 Knapsack",
      recurrence: "dp[i][w] = max(val[i] + dp[i-1][w-wt[i]], dp[i-1][w])",
      desc: "Maximize total value of items in a knapsack of capacity W."
    },
    fibonacci: {
      title: "Fibonacci Sequence",
      recurrence: "dp[i] = dp[i-1] + dp[i-2]",
      desc: "Classic 1D DP example. Each number is the sum of the two preceding ones."
    },
    edit_distance: { title: "Edit Distance", recurrence: "", desc: "" } // Placeholder
  }[problem];

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mt-4">
      <h3 className="text-sm font-bold text-white mb-2">{info.title}</h3>
      <div className="bg-gray-950 p-2 rounded border border-gray-900 mb-3 font-mono text-xs text-yellow-400 whitespace-pre-wrap">
        {info.recurrence}
      </div>
      <p className="text-xs text-gray-400 leading-relaxed">
        {info.desc}
      </p>
    </div>
  );
};