import React from 'react';
import { OUR_APPROACH } from '../data/mockData';
import { Check } from 'lucide-react';

export const OurApproach: React.FC = () => {
  return (
    <section id="approach" className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 text-xs font-extrabold uppercase tracking-widest border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Our Proven Methodology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight text-balance">
            Simple. Structured.{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
              Effective.
            </span>
          </h2>
          <p className="pt-2 text-base sm:text-lg text-slate-600 leading-relaxed">
            We follow a transparent, four-phase engagement cycle that eliminates guesswork, minimizes hiring delays, and guarantees continuous workforce alignment.
          </p>
        </div>

        {/* 4 Steps Row / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {OUR_APPROACH.map((step) => (
            <div
              key={step.step}
              className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Step indicator */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-extrabold text-blue-600/80 font-mono">
                    {step.step}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {step.tagline}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                  {step.name}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {step.description}
                </p>

                <div className="space-y-2 pt-3 border-t border-slate-200/60">
                  {step.bullets.map((b, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 text-[11px] font-bold text-blue-600 flex items-center gap-1">
                <span>Phase {step.step} Milestone Delivery</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
