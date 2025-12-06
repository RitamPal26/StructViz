import React from 'react';
import { User, CheckCircle2 } from 'lucide-react';

export const HackathonBadge: React.FC = () => {
  return (
    <section className="text-center max-w-3xl mx-auto">
      <div className="inline-flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-full mb-8">
        <User className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-300">Creator</span>
      </div>
      <h2 className="text-3xl font-bold text-white mb-6">Gemini 3 Pro Hackathon 2025</h2>
      <p className="text-gray-400 mb-8">
        This project was built in 7 days to showcase the advanced reasoning and multimodal capabilities of Google's Gemini 3 Pro model. It serves as a proof-of-concept for the future of AI-assisted education.
      </p>
      <div className="flex justify-center space-x-8">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-primary-900/30 rounded-full flex items-center justify-center mb-3 text-primary-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium text-gray-300">Multimodal Vision</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-primary-900/30 rounded-full flex items-center justify-center mb-3 text-primary-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium text-gray-300">Function Calling</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-primary-900/30 rounded-full flex items-center justify-center mb-3 text-primary-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium text-gray-300">Reasoning</span>
        </div>
      </div>
    </section>
  );
};