import React from 'react';
import { motion } from 'framer-motion';
import { DataStructure } from '../../../shared/types';
import { Button } from '../../../shared/components/Button';
import { Play } from 'lucide-react';

interface StructureCardProps {
  structure: DataStructure;
  index: number;
}

export const StructureCard: React.FC<StructureCardProps> = ({ structure, index }) => {
  const Icon = structure.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
      className="group relative bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-primary-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-900/20 hover:-translate-y-1"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-6 border border-gray-700 group-hover:border-primary-500/30 group-hover:bg-primary-900/20 transition-colors">
          <Icon className="w-6 h-6 text-gray-300 group-hover:text-primary-400 transition-colors" />
        </div>

        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-200 transition-colors">
          {structure.title}
        </h3>
        
        <p className="text-gray-400 mb-6 leading-relaxed text-sm h-20">
          {structure.description}
        </p>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full group-hover:bg-primary-600 group-hover:border-primary-500 group-hover:text-white transition-all"
        >
          <Play className="w-4 h-4 mr-2" />
          Visualize
        </Button>
      </div>
    </motion.div>
  );
};