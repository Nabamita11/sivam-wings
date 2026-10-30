import React, { useState } from 'react';
import { JobOpening, JobCategory } from '../types';
import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  IndianRupee,
  Users,
  ArrowRight,
  Flame,
  FileUp,
} from 'lucide-react';

interface CareersSectionProps {
  jobOpenings: JobOpening[];
  onApplyForJob: (job: JobOpening) => void;
  onOpenApplicationModal: () => void;
}

export const CareersSection: React.FC<CareersSectionProps> = ({
  jobOpenings,
  onApplyForJob,
  onOpenApplicationModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<JobCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: JobCategory[] = [
    'All',
    'HR & Administration',
    'Logistics & Supply Chain',
    'IT & Software',
    'Manufacturing & Operations',
    'Healthcare & Hospital',
    'Sales & Retail',
  ];

  const filteredJobs = jobOpenings.filter((job) => {
    const matchesCategory =
      selectedCategory === 'All' || job.department === selectedCategory;
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="openings" className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 text-xs font-extrabold uppercase tracking-widest border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Career Opportunities & Current Openings</span>
            <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full flex items-center gap-0.5 ml-1">
              <Flame className="w-2.5 h-2.5 fill-slate-950" />
              Direct Hiring
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight text-balance">
            Find Your Next Career Move{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              With Sivam Wings
            </span>
          </h2>
          <p className="pt-2 text-base sm:text-lg text-slate-600 leading-relaxed">
            We connect skilled professionals and energetic talent with verified employers across manufacturing, technology, healthcare, logistics, and corporate administration. Click on any opening to submit your application directly to Founder Vinay Jalan.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search job title, location, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              />
            </div>

            {/* General Resume Drop Action */}
            <button
              onClick={onOpenApplicationModal}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <FileUp className="w-4 h-4 text-blue-600" />
              <span>Submit General Resume / CV</span>
            </button>
          </div>

          {/* Interactive Category Segmented Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Job Listings Grid */}
        {filteredJobs.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No Job Openings Match Your Filter</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search terms or submit your general resume below to be notified as soon as new roles open.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-blue-600 hover:underline pt-2 inline-block cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:border-blue-300"
              >
                <div className="space-y-4">
                  {/* Card top indicators */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                      {job.department}
                    </span>
                    {job.status === 'Urgent' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                        <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
                        Urgent Hiring
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-500">
                        {job.type}
                      </span>
                    )}
                  </div>

                  {/* Job Title */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                    {job.title}
                  </h3>

                  {/* Meta items */}
                  <div className="space-y-2 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Experience: {job.experience}</span>
                    </div>

                    <div className="flex items-center gap-2 font-semibold text-slate-800">
                      <IndianRupee className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{job.salaryRange}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{job.openPositions} Open Positions</span>
                      <span aria-hidden="true">·</span>
                      <span>Posted {job.postedDate}</span>
                    </div>
                  </div>

                  {/* Brief description snippet */}
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1">
                    {job.description}
                  </p>
                </div>

                {/* Card CTA */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Direct to Admin
                  </span>

                  <button
                    onClick={() => onApplyForJob(job)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Open Resume Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-amber-50/60 border border-blue-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Looking for other roles or fresh graduate opportunities?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Send your profile directly to Sivam Wings. We match incoming client requirements daily.
            </p>
          </div>
          <button
            onClick={onOpenApplicationModal}
            className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm shrink-0 cursor-pointer"
          >
            Submit Resume to Talent Pool
          </button>
        </div>
      </div>
    </section>
  );
};
