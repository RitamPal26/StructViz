import React from 'react';
import { StructureCard } from './StructureCard';
import { DATA_STRUCTURES } from '../../../shared/constants';
import { ViewType } from '../../../shared/types';

interface StructureGridProps {
  onNavigate: (view: ViewType) => void;
}

export const StructureGrid: React.FC<StructureGridProps> = ({ onNavigate }) => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Available Structures</h2>
            <p className="text-gray-400 max-w-xl">
              Select a data structure to start visualizing its operations and algorithms interactively.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DATA_STRUCTURES.map((structure, index) => (
            <StructureCard 
              key={structure.id} 
              structure={structure} 
              index={index}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
