import React from 'react';
import { PageTransition } from '../../shared/components/PageTransition';
import { Header } from '../../shared/components/Header';
import { MissionSection } from './components/MissionSection';
import { WhyStructVizSection } from './components/WhyStructVizSection';
import { TechStackGrid } from './components/TechStackGrid';
import { ImpactSection } from './components/ImpactSection';
import { HackathonBadge } from './components/HackathonBadge';
import { ViewType } from '../../shared/types';

interface AboutPageProps {
  onNavigate: (view: ViewType) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-900 text-gray-100 overflow-x-hidden">
        <Header onNavigate={onNavigate} />
        <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <MissionSection />
          <WhyStructVizSection />
          <TechStackGrid />
          <ImpactSection />
          <HackathonBadge />
        </main>
      </div>
    </PageTransition>
  );
};
export default AboutPage;
