import React, { useState } from 'react';
import { CORE_SERVICES } from '../data/mockData';
import { ServiceDetail } from '../types';
import {
  UserCheck,
  Users,
  Calculator,
  Briefcase,
  ShieldCheck,
  Building2,
  ArrowRight,
  Check,
  X,
  FileCheck2,
} from 'lucide-react';

interface ServicesSectionProps {
  onSelectServiceForInquiry: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceForInquiry,
}) => {
  const [activeModalService, setActiveModalService] = useState<ServiceDetail | null>(null);

  const getIcon = (name: string) => {
    switch (name) {
      case 'UserCheck':
        return <UserCheck className="w-6 h-6 text-blue-600" />;
      case 'Users':
        return <Users className="w-6 h-6 text-blue-600" />;
      case 'Calculator':
        return <Calculator className="w-6 h-6 text-blue-600" />;
      case 'Briefcase':
        return <Briefcase className="w-6 h-6 text-blue-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-blue-600" />;
      case 'Building2':
        return <Building2 className="w-6 h-6 text-blue-600" />;
      default:
        return <Briefcase className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <section id="services" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with generous breathing space */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 sm:mb-16 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 text-xs font-extrabold uppercase tracking-widest border border-blue-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>Our Core Services</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight text-balance">
              Tailored HR & Workforce Solutions{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
                for Every Stage of Business
              </span>
            </h2>
            <p className="pt-2 text-base sm:text-lg text-slate-600 leading-relaxed">
              We deliver comprehensive workforce strategies designed to simplify recruitment, ensure airtight statutory compliance, and streamline day-to-day employee administration.
            </p>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>6 High-Impact Service Verticals</span>
            </span>
          </div>
        </div>

        {/* Feature Cards Grid (Asymmetric Bento style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {CORE_SERVICES.map((service, index) => {
            const isFeaturedRecruitment = service.id === 'recruitment';
            const isFeaturedStaffing = service.id === 'staffing';
            const isFeaturedHR = service.id === 'hr-management';
            const isFeaturedCompliance = service.id === 'statutory-compliance';

            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-blue-400 hover:-translate-y-1"
              >
                {/* Relevant service photography */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={(
                      {
                        recruitment: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85',
                        staffing: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=85',
                        payroll: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=85',
                        'hr-management': 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85',
                        compliance: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1000&q=85',
                        'labour-contract': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1000&q=85',
                      } as Record<string, string>
                    )[service.id] || 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85'}
                    alt={`${service.title} professional service`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-blue-700/95 text-white text-xs font-extrabold px-3 py-1 rounded-md shadow-md">
                    {service.title}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Editorial Number & Icon Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                        {getIcon(service.iconName)}
                      </div>
                      <span className="text-xl font-extrabold text-slate-300 tabular-nums font-mono">
                        {service.number}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {service.title}
                    </h3>

                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                      {service.shortDesc}
                    </p>

                    {/* Quick highlights */}
                    <ul className="mt-4 space-y-2 text-xs text-slate-700">
                      {service.keyFeatures.slice(0, 3).map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Actions */}
                  <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setActiveModalService(service)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>View Scope & Deliverables</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onSelectServiceForInquiry(service.title)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors cursor-pointer"
                    >
                      Inquire
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Detail Modal */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveModalService(null)}
              className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-100 text-blue-800 font-mono">
                Vertical {activeModalService.number}
              </span>
              <span className="text-xs text-slate-500">Sivam Wings</span>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {activeModalService.title}
            </h3>

            <p className="mt-4 text-sm sm:text-base text-slate-700 leading-relaxed">
              {activeModalService.fullDesc}
            </p>

            {/* Key Features */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-blue-600" />
                Key Operational Capabilities
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeModalService.keyFeatures.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Guaranteed Deliverables */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                Agreed Client Deliverables
              </h4>
              <div className="space-y-2">
                {activeModalService.deliverables.map((deliv, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span>{deliv}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal CTA */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 text-center sm:text-left">
                Tailored service agreements customized to your exact operational requirements.
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setActiveModalService(null)}
                  className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const title = activeModalService.title;
                    setActiveModalService(null);
                    onSelectServiceForInquiry(title);
                  }}
                  className="w-1/2 sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Request Proposal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
