import React, { useState } from 'react';
import { JobApplication, JobOpening, ClientInquiry, ApplicationStatus, JobCategory } from '../types';
import {
  X,
  Shield,
  Users,
  Briefcase,
  Mail,
  Phone,
  MessageSquare,
  Search,
  Plus,
  Download,
  Trash2,
  Calendar,
  CheckCircle,
  FileText,
  Clock,
  IndianRupee,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { FOUNDER_INFO } from '../data/mockData';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: JobApplication[];
  onUpdateApplicationStatus: (appId: string, status: ApplicationStatus, notes?: string) => void;
  onDeleteApplication?: (appId: string) => void;
  jobOpenings: JobOpening[];
  onAddNewJob: (job: JobOpening) => void;
  onToggleJobStatus: (jobId: string, status: 'Active' | 'Urgent' | 'Filled') => void;
  onDeleteJob: (jobId: string) => void;
  clientInquiries: ClientInquiry[];
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  applications,
  onUpdateApplicationStatus,
  onDeleteApplication,
  jobOpenings,
  onAddNewJob,
  onToggleJobStatus,
  onDeleteJob,
  clientInquiries,
}) => {
  const [activeTab, setActiveTab] = useState<'applications' | 'jobs' | 'inquiries'>('applications');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [internalNote, setInternalNote] = useState('');

  // New Job Opening State
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [newJobData, setNewJobData] = useState({
    title: '',
    department: 'HR & Administration' as JobCategory,
    location: 'Kolkata, WB (On-site)',
    type: 'Full-time' as const,
    experience: '2 - 4 Years',
    salaryRange: '₹3,00,000 - ₹4,50,000 / year',
    openPositions: 2,
    description: '',
    responsibilities: '',
    requirements: '',
    benefits: 'PF, ESIC, Health Insurance, Annual Bonus',
    status: 'Active' as const,
  });

  if (!isOpen) return null;

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectApp = (app: JobApplication) => {
    setSelectedApplication(app);
    setInternalNote(app.adminNotes || '');
  };

  const handleSaveStatusAndNotes = () => {
    if (selectedApplication) {
      onUpdateApplicationStatus(selectedApplication.id, selectedApplication.status, internalNote);
      setSelectedApplication({
        ...selectedApplication,
        adminNotes: internalNote,
      });
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'App ID',
      'Candidate Name',
      'Applied Role',
      'Email',
      'Phone',
      'Location',
      'Experience (Yrs)',
      'Qualification',
      'Expected Salary',
      'Notice Period',
      'Status',
      'Applied Date',
    ];
    const rows = applications.map((a) => [
      a.id,
      `"${a.candidateName}"`,
      `"${a.jobTitle}"`,
      a.email,
      a.phone,
      `"${a.currentLocation}"`,
      a.experienceYears,
      `"${a.highestQualification}"`,
      `"${a.expectedSalary}"`,
      `"${a.noticePeriod}"`,
      a.status,
      a.appliedDate,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Seven_Star_Services_Applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobData.title.trim() || !newJobData.description.trim()) return;

    const newJob: JobOpening = {
      id: `job-${Date.now().toString().slice(-4)}`,
      title: newJobData.title.trim(),
      department: newJobData.department,
      location: newJobData.location.trim(),
      type: newJobData.type,
      experience: newJobData.experience.trim(),
      salaryRange: newJobData.salaryRange.trim(),
      openPositions: Number(newJobData.openPositions) || 1,
      description: newJobData.description.trim(),
      responsibilities: newJobData.responsibilities
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean),
      requirements: newJobData.requirements
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean),
      benefits: newJobData.benefits
        .split(',')
        .map((b) => b.trim())
        .filter(Boolean),
      postedDate: new Date().toISOString().slice(0, 10),
      status: newJobData.status,
      featured: false,
    };

    onAddNewJob(newJob);
    setIsAddingJob(false);
    setNewJobData({
      title: '',
      department: 'HR & Administration',
      location: 'Kolkata, WB (On-site)',
      type: 'Full-time',
      experience: '2 - 4 Years',
      salaryRange: '₹3,00,000 - ₹4,50,000 / year',
      openPositions: 2,
      description: '',
      responsibilities: '',
      requirements: '',
      benefits: 'PF, ESIC, Health Insurance, Annual Bonus',
      status: 'Active',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-6xl w-full my-4 shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 sm:px-8 sm:py-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold shadow">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                  Sivam Wings — Owner & Admin Inbox
                </h3>
                <span className="text-[11px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                  Vinay Jalan
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Direct Candidate Application Management & Hiring Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Controls Bar & Quick Stats */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'applications'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Job Applications</span>
              <span className="px-1.5 py-0.2 rounded-full text-xs font-mono font-extrabold bg-blue-100 text-blue-900">
                {applications.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'jobs'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Manage Job Openings</span>
              <span className="px-1.5 py-0.2 rounded-full text-xs font-mono font-extrabold bg-slate-100 text-slate-700">
                {jobOpenings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'inquiries'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Client Staffing Inquiries</span>
              <span className="px-1.5 py-0.2 rounded-full text-xs font-mono font-extrabold bg-slate-100 text-slate-700">
                {clientInquiries.length}
              </span>
            </button>
          </div>

          {activeTab === 'applications' && (
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Export CSV</span>
            </button>
          )}

          {activeTab === 'jobs' && (
            <button
              onClick={() => setIsAddingJob(true)}
              className="px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post New Opening</span>
            </button>
          )}
        </div>

        {/* Tab 1: Applications Content */}
        {activeTab === 'applications' && (
          <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Left Applications Table / List */}
            <div className="lg:col-span-6 border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
              {/* Search & Filter Header */}
              <div className="p-4 border-b border-slate-200 bg-white space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search candidate name, role, phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-semibold text-slate-600">
                  <span className="text-slate-400 mr-1">Status:</span>
                  {(['All', 'New', 'Under Review', 'Interviewing', 'Hired', 'Rejected'] as const).map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-2 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                          statusFilter === st
                            ? 'bg-blue-600 text-white font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-200">
                {filteredApplications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No candidate applications match your search.
                  </div>
                ) : (
                  filteredApplications.map((app) => {
                    const isSelected = selectedApplication?.id === app.id;
                    return (
                      <div
                        key={app.id}
                        onClick={() => handleSelectApp(app)}
                        className={`p-4 transition-colors cursor-pointer flex flex-col gap-2 ${
                          isSelected
                            ? 'bg-blue-50/90 border-l-4 border-blue-600'
                            : 'hover:bg-slate-100/80 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-900">
                            {app.candidateName}
                          </span>
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              app.status === 'New'
                                ? 'bg-amber-100 text-amber-900'
                                : app.status === 'Interviewing'
                                ? 'bg-purple-100 text-purple-900'
                                : app.status === 'Hired'
                                ? 'bg-emerald-100 text-emerald-900'
                                : app.status === 'Rejected'
                                ? 'bg-rose-100 text-rose-900'
                                : 'bg-blue-100 text-blue-900'
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-blue-700">
                          {app.jobTitle}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>
                            {app.experienceYears}y exp · {app.noticePeriod}
                          </span>
                          <span className="font-mono text-slate-400">{app.appliedDate}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Selected Application Deep Dive */}
            <div className="lg:col-span-6 flex flex-col h-full bg-white overflow-y-auto p-6">
              {selectedApplication ? (
                <div className="space-y-6">
                  {/* Candidate Header */}
                  <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                    <div>
                      <div className="text-xs font-mono font-bold text-blue-600 mb-1">
                        {selectedApplication.id}
                      </div>
                      <h4 className="text-xl font-extrabold text-slate-900">
                        {selectedApplication.candidateName}
                      </h4>
                      <div className="text-xs font-bold text-slate-700 mt-0.5">
                        Applied for: <span className="text-blue-700">{selectedApplication.jobTitle}</span>
                      </div>
                    </div>

                    {/* Direct Contact Buttons for Vinay Jalan */}
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${selectedApplication.phone}`}
                        className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        title="Call Candidate"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      <a
                        href={`https://wa.me/${selectedApplication.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedApplication.candidateName)},%20this%20is%20Vinay%20Jalan%20from%20Seven%20Star%20Services.%20We%20reviewed%20your%20application%20for%20${encodeURIComponent(selectedApplication.jobTitle)}%20and%20would%20like%20to%20discuss%20an%20interview.`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        title="WhatsApp Interview Invite"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>
                      <a
                        href={`mailto:${selectedApplication.email}?subject=Seven%20Star%20Services%20-%20Interview%20Discussion%20for%20${encodeURIComponent(selectedApplication.jobTitle)}`}
                        className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                        title="Email Candidate"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Status update box */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Candidate Stage Status
                      </label>
                      <button
                        onClick={handleSaveStatusAndNotes}
                        className="text-xs font-bold px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors"
                      >
                        Save Status & Notes
                      </button>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-xs">
                      {(['New', 'Under Review', 'Interviewing', 'Hired', 'Rejected'] as ApplicationStatus[]).map(
                        (st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() =>
                              setSelectedApplication({ ...selectedApplication, status: st })
                            }
                            className={`py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-colors cursor-pointer ${
                              selectedApplication.status === st
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {st}
                          </button>
                        )
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Vinay's Internal Hiring Notes
                      </label>
                      <textarea
                        rows={2}
                        value={internalNote}
                        onChange={(e) => setInternalNote(e.target.value)}
                        placeholder="e.g. Cleared telephonic round; CTC within budget; scheduled client interview for Friday..."
                        className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      />
                    </div>
                  </div>

                  {/* Candidate Details Grid */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[11px]">Phone Number:</span>
                      <span className="font-bold text-slate-800">{selectedApplication.phone}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[11px]">Email Address:</span>
                      <span className="font-bold text-slate-800 truncate block">
                        {selectedApplication.email}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[11px]">Location:</span>
                      <span className="font-bold text-slate-800">
                        {selectedApplication.currentLocation}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[11px]">Total Experience:</span>
                      <span className="font-bold text-slate-800">
                        {selectedApplication.experienceYears} Years
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[11px]">Highest Qualification:</span>
                      <span className="font-bold text-slate-800">
                        {selectedApplication.highestQualification}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[11px]">Notice Period:</span>
                      <span className="font-bold text-slate-800">
                        {selectedApplication.noticePeriod}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[11px]">Current Salary:</span>
                      <span className="font-bold text-slate-800">
                        {selectedApplication.currentSalary || 'Not specified'}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[11px]">Expected Salary:</span>
                      <span className="font-bold text-emerald-700">
                        {selectedApplication.expectedSalary}
                      </span>
                    </div>
                  </div>

                  {/* Attached Resume Box */}
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-blue-600 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {selectedApplication.resumeFileName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {selectedApplication.resumeFileSize || 'Resume Attached'} · Verified Upload
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Simulating download of ${selectedApplication.resumeFileName}`)}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-blue-200 text-xs font-bold text-blue-700 flex items-center gap-1 shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>

                  {/* Cover Note */}
                  {selectedApplication.coverNote && (
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Candidate Statement:
                      </h5>
                      <p className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed italic">
                        "{selectedApplication.coverNote}"
                      </p>
                    </div>
                  )}

                  {/* Portfolio Link */}
                  {selectedApplication.portfolioUrl && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500">Portfolio / Profile:</span>
                      <a
                        href={selectedApplication.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline font-semibold flex items-center gap-1"
                      >
                        <span>{selectedApplication.portfolioUrl}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {onDeleteApplication && (
                    <div className="pt-4 border-t border-slate-100 text-right">
                      <button
                        onClick={() => {
                          if (confirm('Delete this application record?')) {
                            onDeleteApplication(selectedApplication.id);
                            setSelectedApplication(null);
                          }
                        }}
                        className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 ml-auto font-semibold cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Application Record</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2">
                  <Users className="w-12 h-12 text-slate-300 mx-auto" />
                  <div className="text-sm font-bold text-slate-700">Select an application</div>
                  <div className="text-xs text-slate-500 max-w-xs">
                    Choose any candidate submission from the list to review their details, schedule interviews, or update hiring stages.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Manage Job Openings Content */}
        {activeTab === 'jobs' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isAddingJob ? (
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 max-w-2xl mx-auto space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h4 className="text-base font-extrabold text-slate-900">
                    Create New Job Opening for Clients
                  </h4>
                  <button
                    onClick={() => setIsAddingJob(false)}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Job Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Accounts & Tally Executive"
                      value={newJobData.title}
                      onChange={(e) => setNewJobData({ ...newJobData, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Department</label>
                      <select
                        value={newJobData.department}
                        onChange={(e) =>
                          setNewJobData({ ...newJobData, department: e.target.value as JobCategory })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="HR & Administration">HR & Administration</option>
                        <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                        <option value="IT & Software">IT & Software</option>
                        <option value="Manufacturing & Operations">Manufacturing & Operations</option>
                        <option value="Healthcare & Hospital">Healthcare & Hospital</option>
                        <option value="Sales & Retail">Sales & Retail</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={newJobData.location}
                        onChange={(e) => setNewJobData({ ...newJobData, location: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Experience</label>
                      <input
                        type="text"
                        value={newJobData.experience}
                        onChange={(e) => setNewJobData({ ...newJobData, experience: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Salary Range</label>
                      <input
                        type="text"
                        value={newJobData.salaryRange}
                        onChange={(e) => setNewJobData({ ...newJobData, salaryRange: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Positions Count</label>
                      <input
                        type="number"
                        min="1"
                        value={newJobData.openPositions}
                        onChange={(e) =>
                          setNewJobData({ ...newJobData, openPositions: parseInt(e.target.value) || 1 })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Role Description *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Brief overview of the role..."
                      value={newJobData.description}
                      onChange={(e) => setNewJobData({ ...newJobData, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Key Responsibilities (One per line)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Manage ledger reconciliation&#10;Process GST filings&#10;Handle audit documentation"
                      value={newJobData.responsibilities}
                      onChange={(e) =>
                        setNewJobData({ ...newJobData, responsibilities: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Candidate Requirements (One per line)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="B.Com / M.Com&#10;2+ years in Tally Prime&#10;Good analytical acumen"
                      value={newJobData.requirements}
                      onChange={(e) => setNewJobData({ ...newJobData, requirements: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingJob(false)}
                      className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-xs"
                    >
                      Publish Job Opening
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-extrabold text-slate-900">
                    Live Job Openings ({jobOpenings.length})
                  </h4>
                  <span className="text-xs text-slate-500">
                    Candidates can apply directly to these on the website
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobOpenings.map((job) => (
                    <div
                      key={job.id}
                      className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                            {job.department}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {(['Active', 'Urgent', 'Filled'] as const).map((st) => (
                              <button
                                key={st}
                                onClick={() => onToggleJobStatus(job.id, st)}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                                  job.status === st
                                    ? st === 'Urgent'
                                    ? 'bg-amber-400 text-slate-950'
                                    : st === 'Active'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-400 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>

                        <h5 className="font-bold text-sm text-slate-900 mt-2">{job.title}</h5>

                        <div className="text-xs text-slate-500 space-y-1 mt-2">
                          <div>
                            {job.location} · {job.experience}
                          </div>
                          <div className="font-semibold text-slate-800">{job.salaryRange}</div>
                          <div>{job.openPositions} Open Positions</div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-mono">ID: {job.id}</span>
                        <button
                          onClick={() => {
                            if (confirm(`Remove job opening "${job.title}"?`)) {
                              onDeleteJob(job.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Client Inquiries Content */}
        {activeTab === 'inquiries' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h4 className="text-base font-extrabold text-slate-900">
                Client Staffing & HR Quote Requests ({clientInquiries.length})
              </h4>
              <span className="text-xs text-slate-500">
                Inquiries submitted through Contact and Estimator tools
              </span>
            </div>

            <div className="space-y-3">
              {clientInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-blue-600 mr-2">
                        {inq.id}
                      </span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {inq.companyName}
                      </span>
                      <span className="text-xs text-slate-500 ml-2">({inq.contactPerson})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${inq.phone}`}
                        className="px-3 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call {inq.phone}</span>
                      </a>
                      <a
                        href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(inq.contactPerson)},%20this%20is%20Vinay%20Jalan%20from%20Seven%20Star%20Services.%20We%20received%20your%20inquiry%20regarding%20${encodeURIComponent(inq.serviceRequired)}.`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-slate-400 block">Service:</span>
                      <span className="font-semibold text-slate-800">{inq.serviceRequired}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Estimated Headcount:</span>
                      <span className="font-semibold text-slate-800">{inq.estimatedHeadcount}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Target Timeline:</span>
                      <span className="font-semibold text-slate-800">{inq.timeline}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded border border-slate-100">
                    "{inq.message}"
                  </p>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Email: {inq.email}</span>
                    <span>Received on {inq.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
