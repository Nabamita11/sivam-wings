import React, { useState } from 'react';
import { JobOpening, JobCategory } from '../types';
import {
  Search,
  MapPin,
  Clock,
  IndianRupee,
  Users,
  ArrowRight,
  Briefcase,
  Flame,
  CheckCircle,
  Building,
  Sparkles,
  FileUp,
} from 'lucide-react';
import { FOUNDER_INFO } from '../data/mockData';

interface CareersPageProps {
  jobOpenings: JobOpening[];
  onSelectJob: (job: JobOpening) => void;
  onOpenGeneralApplication: () => void;
  onNavigateHome: () => void;
}

export const CareersPage: React.FC<CareersPageProps> = ({
  jobOpenings,
  onSelectJob,
  onOpenGeneralApplication,
  onNavigateHome,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<JobCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  const categories: JobCategory[] = [
    'All',
    'HR & Administration',
    'Logistics & Supply Chain',
    'IT & Software',
    'Manufacturing & Operations',
    'Healthcare & Hospital',
    'Sales & Retail',
  ];

  const locations = [
    'All',
    'Kolkata, West Bengal',
    'Howrah / Dankuni',
    'Asansol / Durgapur',
    'Remote / Hybrid',
  ];

  const filteredJobs = jobOpenings.filter((job) => {
    const matchesCategory =
      selectedCategory === 'All' || job.department === selectedCategory;
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation =
      selectedLocation === 'All' ||
      job.location.toLowerCase().includes(selectedLocation.toLowerCase().split('/')[0].trim());
    const matchesType =
      selectedType === 'All' || job.type === selectedType;

    return matchesCategory && matchesSearch && matchesLocation && matchesType;
  });

  return (
    <div className="bg-slate-50/70 min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Careers Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-12 shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-slate-800 text-xs font-bold border border-white/20 shadow-sm">
              <img
                src="/assets/sivamwings-logo.png"
                alt="Sivam Wings"
                className="h-5 w-auto object-contain"
              />
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-blue-900 font-extrabold">Careers & Hiring Portal</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-fuchsia-700 italic font-medium hidden sm:inline">Skilled People | Stronger Businesses</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Current Job Openings & Career Opportunities
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              We partner directly with leading industrial facilities, technology firms, logistics hubs, hospitals, and corporate offices to hire dependable, verified talent. Click on any job listing below to explore comprehensive role descriptions and apply directly to Founder Vinay Jalan.
            </p>

            {/* Quick Guarantees Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5 text-amber-300">
                <CheckCircle className="w-4 h-4 text-amber-400" />
                100% Free Placement for Candidates
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="flex items-center gap-1.5 text-slate-200">
                <Building className="w-4 h-4 text-blue-400" />
                Direct Employer Interviews
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="flex items-center gap-1.5 text-slate-200">
                <Clock className="w-4 h-4 text-blue-400" />
                Fast-Track Application Review
              </span>
            </div>
          </div>
        </div>

        {/* Filter and Search Panel */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
          {/* Top Row: Search Input + General Application CTA */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search job title, keywords, skills (e.g. React, Tally, Logistics)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              />
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={onOpenGeneralApplication}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <FileUp className="w-4 h-4 text-blue-600" />
                <span>Submit General Resume</span>
              </button>
            </div>
          </div>

          {/* Department Category Filter Buttons */}
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Filter by Department
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count & Current Filter Indicators */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Showing <strong className="text-slate-900 font-bold">{filteredJobs.length}</strong> active job openings
          </span>
          {(selectedCategory !== 'All' || searchQuery !== '') && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-blue-600 hover:underline font-bold cursor-pointer"
            >
              Reset All Filters
            </button>
          )}
        </div>

        {/* Job Listings Grid */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs space-y-4">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No Job Openings Found</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              We couldn't find any job openings matching your search criteria. Submit your resume to our general talent pool and our recruiters will match you with incoming client roles.
            </p>
            <button
              onClick={onOpenGeneralApplication}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs cursor-pointer"
            >
              Submit Resume for Future Openings
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => onSelectJob(job)}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-blue-400 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between cursor-pointer group transform hover:-translate-y-1"
              >
                <div className="space-y-4">
                  {/* Category Pill and Urgent Flag */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                      {job.department}
                    </span>
                    {job.status === 'Urgent' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                        <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                        Urgent
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-500">
                        {job.type}
                      </span>
                    )}
                  </div>

                  {/* Job Title */}
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {job.title}
                  </h2>

                  {/* Key Info Strip */}
                  <div className="space-y-2 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Experience: {job.experience}</span>
                    </div>

                    <div className="flex items-center gap-2 font-bold text-emerald-700">
                      <IndianRupee className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{job.salaryRange}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{job.openPositions} Open Positions</span>
                    </div>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1">
                    {job.description}
                  </p>
                </div>

                {/* Bottom CTA Bar */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-[11px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                    Click to view role details & responsibilities
                  </span>
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0 shadow-2xs">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Candidate Support Strip */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 font-bold shrink-0">
              ?
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Need Help Finding the Right Role?</div>
              <div className="text-slate-500">
                Contact Founder Vinay Jalan directly at {FOUNDER_INFO.phone} or {FOUNDER_INFO.email}.
              </div>
            </div>
          </div>
          <button
            onClick={onNavigateHome}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-colors cursor-pointer whitespace-nowrap"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};
