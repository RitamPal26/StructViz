import React from 'react';
import { Smartphone, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MobileLandscapeAlert: React.FC = () => {
  return (
    <div className="md:hidden fixed bottom-20 left-4 right-4 z-40 pointer-events-none flex justify-center">
      <div className="bg-gray-900/90 backdrop-blur border border-primary-500/30 rounded-full px-6 py-3 shadow-2xl flex items-center space-x-3 animate-pulse portrait:flex hidden">
        <RotateCw className="w-5 h-5 text-primary-400 animate-spin-slow" />
        <span className="text-xs font-medium text-gray-200">
          Rotate for better view
        </span>
      </div>
    </div>
  );
};
