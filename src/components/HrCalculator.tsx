import React, { useState } from 'react';
import { Calculator, ArrowRight, ShieldCheck, Check, Sparkles } from 'lucide-react';

interface HrCalculatorProps {
  onEstimateSubmit: (data: {
    service: string;
    industry: string;
    headcount: number;
    timeline: string;
  }) => void;
}

export const HrCalculator: React.FC<HrCalculatorProps> = ({ onEstimateSubmit }) => {
  const [service, setService] = useState('Recruitment & Talent Acquisition');
  const [industry, setIndustry] = useState('Manufacturing & Industrial');
  const [headcount, setHeadcount] = useState(15);
  const [urgency, setUrgency] = useState<'Standard' | 'Urgent' | 'Next Month'>('Urgent');

  // Interactive estimates calculation
  const getEstimatedTurnaround = () => {
    if (urgency === 'Urgent') return '24 to 48 Hours';
    if (urgency === 'Standard') return '3 to 7 Days';
    return 'Scheduled Batch Deployment';
  };

  const getDedicatedPersonnel = () => {
    if (headcount > 50) return '2 Dedicated Account Leads + On-site Supervisor';
    if (headcount > 20) return '1 Dedicated HR Account Lead + Field Coordinator';
    return '1 Dedicated Senior HR Recruiter';
  };

  const getSavingsPercentage = () => {
    if (headcount >= 50) return '35% to 42%';
    if (headcount >= 20) return '28% to 34%';
    return '20% to 25%';
  };

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle luminous ambient accents */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Inputs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 text-amber-300 text-xs font-bold border border-blue-700/60">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Workforce Planner</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Estimate Your Workforce & HR Staffing Requirements
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  Configure your team requirements below for tailored SLAs, deployment speed, and custom proposal readiness.
                </p>
              </div>

              {/* Form Controls */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Primary Service Needed
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="Recruitment & Talent Acquisition">Recruitment & Talent Acquisition</option>
                    <option value="Manpower Supply & Staffing Solutions">Manpower Supply & Staffing Solutions</option>
                    <option value="Payroll Management">Payroll Management & EPF/ESIC</option>
                    <option value="HR Management & Employee Support">HR Operations & Onboarding</option>
                    <option value="Statutory Compliance Support">Statutory Labour Compliance</option>
                    <option value="Labour Contract & Workforce Management">Labour Contract Management</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Target Industry
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      <option value="Manufacturing & Industrial">Manufacturing & Industrial</option>
                      <option value="Logistics & Warehousing">Logistics & Warehousing</option>
                      <option value="Information Technology (IT)">Information Technology (IT/ITeS)</option>
                      <option value="Healthcare & Hospitals">Healthcare & Hospitals</option>
                      <option value="Retail & Commercial">Retail & Commercial</option>
                      <option value="Corporate & Professional">Corporate & Professional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Timeline Urgency
                    </label>
                    <div className="grid grid-cols-3 gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
                      {(['Urgent', 'Standard', 'Next Month'] as const).map((tier) => (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => setUrgency(tier)}
                          className={`py-1.5 font-medium rounded-lg transition-colors ${
                            urgency === tier
                              ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Headcount Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Estimated Headcount Needed
                    </label>
                    <span className="text-base font-extrabold text-amber-300 font-mono">
                      {headcount} {headcount === 1 ? 'Person' : 'Personnel'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="150"
                    value={headcount}
                    onChange={(e) => setHeadcount(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>1 (Key Lateral Hire)</span>
                    <span>50 (Shift Team)</span>
                    <span>150+ (Large Facility)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Output Card */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-white/20 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Seven Star Proposal Summary
                  </div>
                  <Calculator className="w-5 h-5 text-amber-300" />
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-400 block text-xs">Estimated Deployment SLA:</span>
                    <span className="font-extrabold text-white text-base text-amber-300 tabular-nums">
                      {getEstimatedTurnaround()}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-xs">Account Team Allocation:</span>
                    <span className="font-semibold text-slate-100">
                      {getDedicatedPersonnel()}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-xs">Estimated HR Overhead Reduction:</span>
                    <span className="font-bold text-emerald-300 tabular-nums">
                      Save ~{getSavingsPercentage()} vs In-House Sourcing
                    </span>
                  </div>

                  <div className="pt-2 border-t border-white/15 space-y-1.5 text-xs text-slate-200">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>EPF, ESIC & Minimum Wage Statutory Assurance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Replacement guarantee & verified credentials</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onEstimateSubmit({
                      service,
                      industry,
                      headcount,
                      timeline: urgency,
                    })
                  }
                  className="w-full py-3 px-4 rounded-xl text-sm font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Request Custom Proposal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
