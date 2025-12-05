import React from 'react';
import { Hero } from './components/Hero';
import { StructureGrid } from './components/StructureGrid';
import { Header } from '../../shared/components/Header';
import { ViewType } from '../../shared/types';

interface LandingPageProps {
  onNavigate: (view: ViewType) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 selection:bg-primary-500/30">
      <Header />
      <main>
        <Hero />
        <StructureGrid onNavigate={onNavigate} />
      </main>
      
      <footer className="bg-gray-900 border-t border-gray-800 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} StructViz AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
