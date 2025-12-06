import React from 'react';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import { TECH_STACK } from '../../../shared/constants';

export const TechStackGrid: React.FC = () => {
  return (
    <section className="bg-gray-900 border border-gray-800 rounded-3xl p-8 md:p-12 mb-32">
      <div className="flex items-center space-x-3 mb-10 justify-center">
        <Code2 className="w-8 h-8 text-primary-400" />
        <h2 className="text-3xl font-bold text-white">Technology Stack</h2>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {TECH_STACK.map((tech, i) => (
          <motion.div 
            key={tech.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.05, backgroundColor: '#1f2937' }}
            className="bg-gray-800 px-6 py-3 rounded-full text-base font-medium text-gray-300 border border-gray-700 cursor-default"
          >
            {tech.name}
          </motion.div>
        ))}
      </div>
    </section>
  );
};