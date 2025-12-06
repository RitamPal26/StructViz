import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../shared/components/Button';
import { ArrowRight, Sparkles, Play } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const scrollToGrid = () => {
    document.getElementById('visualizers')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gray-900">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-gray-800/50 rounded-full px-4 py-1.5 mb-8 border border-gray-700/50 backdrop-blur-sm shadow-xl"
          >
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium text-primary-300">Powered by Gemini 3 Pro AI</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight"
          >
            Master Data Structures with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-sky-400 to-indigo-400 mt-2 pb-2">
              Interactive Visualization
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto"
          >
            Unlock the power of algorithms through immersive animations and real-time AI explanations. 
            Bridge the gap between theory and code.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="w-full sm:w-auto group min-w-[180px]" onClick={scrollToGrid}>
              Start Learning
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[180px] bg-gray-900/50 backdrop-blur">
              <Play className="mr-2 w-5 h-5" /> View Demo
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};