import React from 'react';
import { StructureCard } from './StructureCard';
import { DATA_STRUCTURES } from '../../../shared/constants';
import { ViewType } from '../../../shared/types';

interface DataStructuresShowcaseProps {
  onNavigate: (view: ViewType) => void;
}

export const DataStructuresShowcase: React.FC<DataStructuresShowcaseProps> = ({ onNavigate }) => {
  return (
    <section className="py-32 bg-gray-900" id="visualizers">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Interactive Library</h2>
            <p className="text-gray-400 text-lg">
              Select a data structure to start visualizing its operations. Our library covers all fundamental structures required for technical interviews.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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