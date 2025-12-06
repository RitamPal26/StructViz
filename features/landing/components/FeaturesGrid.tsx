import React from 'react';
import { motion } from 'framer-motion';
import { FEATURES } from '../../../shared/constants';

export const FeaturesGrid: React.FC = () => {
  return (
    <section className="py-24 bg-gray-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-primary-500/50 hover:bg-gray-800 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-6 border border-gray-700 group-hover:border-primary-500/30 group-hover:bg-primary-900/20 transition-colors">
                <feature.icon className="w-6 h-6 text-gray-400 group-hover:text-primary-400 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};