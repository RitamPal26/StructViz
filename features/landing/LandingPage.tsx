import React from 'react';
import { HeroSection } from './components/HeroSection';
import { FeaturesGrid } from './components/FeaturesGrid';
import { DataStructuresShowcase } from './components/DataStructuresShowcase';
import { StatsSection } from './components/StatsSection';
import { CTASection } from './components/CTASection';
import { Header } from '../../shared/components/Header';
import { ViewType } from '../../shared/types';
import { PageTransition } from '../../shared/components/PageTransition';

interface LandingPageProps {
  onNavigate: (view: ViewType) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-900 text-gray-100 selection:bg-primary-500/30 overflow-x-hidden">
        <Header onNavigate={onNavigate} />
        <main>
          <HeroSection />
          <FeaturesGrid />
          <DataStructuresShowcase onNavigate={onNavigate} />
          <StatsSection />
          <CTASection />
        </main>
        
        <footer className="bg-gray-900 border-t border-gray-800 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} StructViz AI. Open Source Education.</p>
            <div className="flex space-x-6">
              <button className="text-gray-500 hover:text-white transition-colors text-sm">Privacy</button>
              <button className="text-gray-500 hover:text-white transition-colors text-sm">Terms</button>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors text-sm">GitHub</a>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};
export default LandingPage;
