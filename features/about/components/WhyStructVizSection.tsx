import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Cpu, Heart } from 'lucide-react';

export const WhyStructVizSection: React.FC = () => {
  return (
    <section className="grid md:grid-cols-2 gap-12 mb-32">
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white mb-8">Why StructViz?</h2>
        {[
          { icon: Zap, title: "Visual Learning", desc: "Algorithms come to life with high-frame-rate animations." },
          { icon: Cpu, title: "AI-Powered", desc: "Built with Gemini 3 Pro to provide intelligent, context-aware explanations." },
          { icon: Heart, title: "Accessible", desc: "Designed for students, boot-campers, and life-long learners." }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-800/50 transition-colors"
          >
            <div className="p-3 bg-gray-800 rounded-lg text-primary-400">
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-gray-700 p-8 relative overflow-hidden flex flex-col justify-center"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-900/20 rounded-full blur-[80px]" />
        <h3 className="text-2xl font-bold text-white mb-6 relative z-10">Built for the Community</h3>
        <p className="text-gray-400 mb-8 relative z-10">
          Data structures are the building blocks of software. We believe learning them shouldn't be a struggle. StructViz is our contribution to the open-source education ecosystem.
        </p>
        <div className="flex flex-wrap gap-3 relative z-10">
          {['Students', 'Educators', 'Interviewees', 'Developers'].map(tag => (
            <span key={tag} className="px-3 py-1 bg-gray-700/50 rounded-full text-sm text-gray-300 border border-gray-600">
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
};