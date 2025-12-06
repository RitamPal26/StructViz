import React from 'react';
import { motion } from 'framer-motion';

export const MissionSection: React.FC = () => {
  return (
    <section className="text-center mb-32 max-w-4xl mx-auto">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-6xl font-extrabold text-white mb-8"
      >
        Our Mission
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl md:text-2xl text-gray-400 leading-relaxed font-light"
      >
        To democratize computer science education by making abstract concepts tangible, interactive, and accessible to everyone through the power of visualization and AI.
      </motion.p>
    </section>
  );
};