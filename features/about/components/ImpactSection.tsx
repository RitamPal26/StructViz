import React from 'react';
import { motion } from 'framer-motion';

export const ImpactSection: React.FC = () => {
  return (
    <section className="mb-32 text-center">
      <h2 className="text-3xl font-bold text-white mb-12">Who We Help</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { title: "Students", text: "Struggling with abstract concepts in CS classes." },
          { title: "Job Seekers", text: "Preparing for technical interviews at top tech companies." },
          { title: "Educators", text: "Looking for interactive tools to demonstrate algorithms." }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-800/30 p-8 rounded-2xl border border-gray-800"
          >
            <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
            <p className="text-gray-400">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};