import React, { useState } from 'react';
import { INDUSTRIES } from '../data/mockData';
import {
  Laptop,
  Factory,
  HeartPulse,
  Truck,
  Store,
  Shield,
  Briefcase,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

interface IndustriesSectionProps {
  onSelectIndustryForStaffing: (industryTitle: string) => void;
}

export const IndustriesSection: React.FC<IndustriesSectionProps> = ({
  onSelectIndustryForStaffing,
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState(INDUSTRIES[0]);

  const getIndustryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Laptop':
        return <Laptop className="w-5 h-5 text-blue-600" />;
      case 'Factory':
        return <Factory className="w-5 h-5 text-blue-600" />;
      case 'HeartPulse':
        return <HeartPulse className="w-5 h-5 text-blue-600" />;
      case 'Truck':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'Store':
        return <Store className="w-5 h-5 text-blue-600" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-blue-600" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-blue-600" />;
      default:
        return <Briefcase className="w-5 h-5 text-blue-600" />;
    }
  };

  const getIndustryImage = (id: string) => {
    switch (id) {
      case 'it':
        return '/src/assets/images/it_corporate_hiring_1792995691499.jpg';
      case 'healthcare':
        return '/src/assets/images/healthcare_staffing_team_1792995692115.jpg';
      case 'manufacturing':
        return '/src/assets/images/service_staffing_1792993375982.jpg';
      case 'corporate':
        return '/src/assets/images/hero_workforce_team_1792993374261.jpg';
      default:
        return '/src/assets/images/service_recruitment_1792993375079.jpg';
    }
  };

  return (
    <section id="industries" className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with ample spacing */}
        <div className="max-w-3xl mb-14 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 text-xs font-extrabold uppercase tracking-widest border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Industries We Serve</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight text-balance">
            HR Solutions Across{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Diverse Industries
            </span>
          </h2>
          <p className="pt-2 text-base sm:text-lg text-slate-600 leading-relaxed">
            We understand that every industry has different workforce requirements. Our solutions can be tailored to support organizations across IT, heavy manufacturing, logistics corridors, healthcare networks, retail chains, and corporate offices.
          </p>
        </div>

        {/* Interactive Industry Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Industry Selection List */}
          <div className="lg:col-span-5 space-y-2">
            {INDUSTRIES.map((ind) => {
              const isSelected = selectedIndustry.id === ind.id;
              return (
                <button
                  key={ind.id}
                  onClick={() => setSelectedIndustry(ind)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-300 shadow-xs'
                      : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {getIndustryIcon(ind.icon)}
                    </div>
                    <div>
                      <h4
                        className={`text-sm font-bold transition-colors ${
                          isSelected ? 'text-blue-900' : 'text-slate-800 group-hover:text-slate-900'
                        }`}
                      >
                        {ind.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {ind.roles.join(', ')}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-blue-600 translate-x-1' : 'text-slate-300'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Industry Deep Dive Detail Card */}
          <div className="lg:col-span-7">
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  {getIndustryIcon(selectedIndustry.icon)}
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Sector Blueprint
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {selectedIndustry.title}
                  </h3>
                </div>
              </div>

              {/* Sector Real-world Field Photo */}
              <div className="relative h-48 sm:h-56 w-full rounded-xl overflow-hidden shadow-sm border border-slate-200 group">
                <img
                  src={getIndustryImage(selectedIndustry.id)}
                  alt={`${selectedIndustry.title} staffing and operations`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 text-white text-xs font-bold drop-shadow flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Verified On-ground Workforce Roster: {selectedIndustry.title}</span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {selectedIndustry.description}
              </p>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                  Frequently Deployed Roles & Profiles
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedIndustry.roles.map((role, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-200/80 text-xs sm:text-sm font-medium text-slate-800 shadow-2xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{role}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  Ready with pre-screened candidate pools and on-call staffing rosters.
                </div>
                <button
                  onClick={() => onSelectIndustryForStaffing(selectedIndustry.title)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  Hire in {selectedIndustry.title.split('&')[0]}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
