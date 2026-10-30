import React from 'react';
import { WHY_CHOOSE_US } from '../data/mockData';
import { ShieldCheck, UserCheck, Shuffle, Zap, HeartHandshake, Award } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return <UserCheck className="w-5 h-5 text-blue-600" />;
      case 1:
        return <Shuffle className="w-5 h-5 text-blue-600" />;
      case 2:
        return <Zap className="w-5 h-5 text-blue-600" />;
      case 3:
        return <ShieldCheck className="w-5 h-5 text-blue-600" />;
      case 4:
        return <HeartHandshake className="w-5 h-5 text-blue-600" />;
      case 5:
        return <Award className="w-5 h-5 text-blue-600" />;
      default:
        return <Award className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 text-xs font-extrabold uppercase tracking-widest border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Why Choose Sivam Wings?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight text-balance">
            Reliable People Solutions.{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-600 bg-clip-text text-transparent">
              Professional HR Support.
            </span>
          </h2>
          <p className="pt-2 text-base sm:text-lg text-slate-600 leading-relaxed">
            We operate as a committed extension of your leadership team. Here is why established enterprises and growing organizations entrust their workforce management to Sivam Wings.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {WHY_CHOOSE_US.map((item, idx) => (
            <div
              key={idx}
              className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {getIcon(idx)}
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-blue-700 tabular-nums">
                      {item.stat}
                    </span>
                    <span className="block text-[10px] font-medium text-slate-400">
                      {item.statLabel}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>Seven Star Standard</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
