import React from 'react';
import { Target, Compass, Award, CheckCircle } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 text-xs font-extrabold uppercase tracking-widest border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>About Sivam Wings</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight text-balance">
            Your Trusted Partner for{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
              Complete HR Solutions
            </span>
          </h2>
          <p className="pt-2 text-base sm:text-lg text-slate-600 leading-relaxed">
            Sivam Wings is committed to helping organizations build productive teams and manage their human resources with confidence. We understand that people are the foundation of every successful business. Our approach combines industry knowledge, efficient recruitment practices, professional workforce management, and dependable HR support to meet the unique needs of every client.
          </p>
          <p className="pt-1 text-base text-slate-600 leading-relaxed">
            Whether you are a growing startup, an established enterprise, or a large organization, we work to deliver flexible, cost-effective, and dependable HR solutions tailored to your operational goals.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {/* Mission Card */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-100/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-5 shadow-sm">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Our Mission</h3>
            <p className="text-slate-700 leading-relaxed">
              To connect businesses with the right people and provide dependable HR solutions that create long-term value.
            </p>
            <div className="mt-6 pt-5 border-t border-blue-100/80 flex items-center gap-2 text-xs font-semibold text-blue-800">
              <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Right Candidate Match · Ethical Sourcing · Sustainable Value</span>
            </div>
          </div>

          {/* Vision Card */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50/70 to-orange-50/40 border border-amber-100/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-5 shadow-sm">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Our Vision</h3>
            <p className="text-slate-700 leading-relaxed">
              To become a trusted HR and workforce solutions partner, recognized for professionalism, integrity, quality, and service excellence.
            </p>
            <div className="mt-6 pt-5 border-t border-amber-100/80 flex items-center gap-2 text-xs font-semibold text-amber-900">
              <Award className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Professionalism · Integrity · Service Excellence</span>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
};
