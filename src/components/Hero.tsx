import React from 'react';
import { ArrowRight, Star, CheckCircle2, Users, Briefcase, ShieldCheck, Clock } from 'lucide-react';
import { FOUNDER_INFO } from '../data/mockData';
import heroWorkforceImage from '../assets/images/hero_workforce_team_1792993374261.jpg';

interface HeroProps {
  onOpenContact: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenContact }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-slate-50 pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-100">
      {/* Background ambient lighting - bright & vibrant */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 -z-10 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tagline pill */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-800 text-sm sm:text-base font-bold tracking-wide border border-sky-200 shadow-md">
            <img
              src="/assets/sivamwings-logo.png"
              alt="Sivam Wings"
              className="h-24 sm:h-32 md:h-40 w-auto max-w-[460px] object-contain"
            />
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-semibold text-slate-700">Your People. Our Priority. Your Success.</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-fuchsia-700 italic font-medium hidden sm:inline">Skilled People | Stronger Businesses</span>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headline and Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-slate-900 leading-[1.15] tracking-tight text-balance">
              Building Stronger Teams.{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
                Empowering Better Businesses.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              At Sivam Wings, we help businesses find the right talent, manage their workforce efficiently, and simplify complex HR operations. From recruitment and staffing to payroll, statutory compliance, and labour contract management, we deliver reliable, customized HR solutions that support your business growth.
            </p>

            {/* Core Kicker */}
            <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-800 pt-1">
              <span className="text-blue-600">Our People.</span>
              <span className="text-indigo-600">Your Progress.</span>
              <span className="text-amber-600">One Trusted Partner.</span>
            </div>

            {/* Capabilities Pill Strip */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-semibold text-slate-600 pt-1">
              <span className="flex items-center gap-1 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Recruitment
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Manpower Staffing
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Payroll Management
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Statutory Compliance
              </span>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onOpenContact}
                className="px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore Our Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#openings"
                className="px-6 py-3.5 rounded-xl text-sm font-bold text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 transition-colors flex items-center justify-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span>Browse Current Openings</span>
              </a>

              <a
                href="#contact"
                className="px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center justify-center text-center"
              >
                Contact Us
              </a>
            </div>

            {/* Quick Assurance */}
            <div className="pt-2 flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                PF & ESIC Statutory Audited
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Users className="w-4 h-4 text-blue-600" />
                Pan-India Manpower Readiness
              </span>
            </div>
          </div>

          {/* Right Column: High-Impact Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Decorative radiant border frame */}
              <div className="relative rounded-2xl p-2 bg-gradient-to-tr from-blue-500 via-indigo-500 to-amber-400 shadow-xl">
                <div className="relative rounded-xl overflow-hidden bg-white aspect-[4/3] sm:aspect-[16/11]">
                  <img
                    src={heroWorkforceImage}
                    alt="Sivam Wings workforce and recruitment team collaborating in a bright modern office"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

                  {/* Overlay Trust Pill */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Workforce Deployed & Managed</div>
                        <div className="text-[11px] text-slate-500">Across 7 Core Indian Industries</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-blue-700 tabular-nums">24 - 72h</div>
                      <div className="text-[10px] font-medium text-slate-500">Fast Deployment</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Quick Response Badge */}
              <div className="absolute -top-3 -right-3 hidden sm:flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl shadow-md border border-slate-200 text-xs font-bold text-slate-800">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Direct Founder Consultation: {FOUNDER_INFO.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Metric Strip below the hero split */}
        <div className="mt-14 pt-8 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 tabular-nums">100%</div>
            <div className="text-xs sm:text-sm font-bold text-slate-800">Statutory Compliance</div>
            <div className="text-xs text-slate-500">Strict EPF, ESIC & Labour laws</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-700 tabular-nums">24-72h</div>
            <div className="text-xs sm:text-sm font-bold text-slate-800">Turnaround Window</div>
            <div className="text-xs text-slate-500">Fast talent sourcing & dispatch</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 tabular-nums">6 Core</div>
            <div className="text-xs sm:text-sm font-bold text-slate-800">HR Verticals</div>
            <div className="text-xs text-slate-500">Recruitment to labour contracts</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 tabular-nums">1:1</div>
            <div className="text-xs sm:text-sm font-bold text-slate-800">Founder Led Focus</div>
            <div className="text-xs text-slate-500">Direct leadership by Vinay Jalan</div>
          </div>
        </div>
      </div>
    </section>
  );
};
