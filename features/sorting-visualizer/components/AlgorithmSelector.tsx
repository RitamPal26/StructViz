import React from 'react';
import { AlgorithmType } from '../types';
import { Check } from 'lucide-react';

interface AlgorithmSelectorProps {
  selected: AlgorithmType;
  onChange: (alg: AlgorithmType) => void;
  isRaceMode: boolean;
  raceAlgorithms: AlgorithmType[];
  onToggleRaceAlg: (alg: AlgorithmType) => void;
}

const ALGORITHMS: { id: AlgorithmType; label: string }[] = [
  { id: 'bubble', label: 'Bubble Sort' },
  { id: 'selection', label: 'Selection Sort' },
  { id: 'insertion', label: 'Insertion Sort' },
  { id: 'merge', label: 'Merge Sort' },
  { id: 'quick', label: 'Quick Sort' },
  { id: 'heap', label: 'Heap Sort' },
];

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  selected,
  onChange,
  isRaceMode,
  raceAlgorithms,
  onToggleRaceAlg
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {ALGORITHMS.map((alg) => {
        const isActive = isRaceMode ? raceAlgorithms.includes(alg.id) : selected === alg.id;
        
        return (
          <button
            key={alg.id}
            onClick={() => isRaceMode ? onToggleRaceAlg(alg.id) : onChange(alg.id)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all border
              ${isActive 
                ? 'bg-primary-600 border-primary-500 text-white shadow-lg' 
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200'
              }
            `}
          >
            <div className="flex items-center space-x-2">
              <span>{alg.label}</span>
              {isActive && isRaceMode && <Check className="w-3 h-3" />}
            </div>
          </button>
        );
      })}
    </div>
  );
};