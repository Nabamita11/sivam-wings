import React, { useState, useEffect } from 'react';
import {
  JobApplication,
  JobOpening,
  ClientInquiry,
  ApplicationStatus,
  JobCategory,
  StatusHistoryEntry,
} from '../types';
import {
  Shield,
  Lock,
  Unlock,
  KeyRound,
  LogOut,
  Users,
  Briefcase,
  Mail,
  Phone,
  MessageSquare,
  Search,
  Filter,
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
  ChevronRight,
  Sparkles,
  AlertCircle,
  RefreshCw,
  X,
  Eye,
  EyeOff,
  Send,
  Bell,
  Check,
} from 'lucide-react';
import { FOUNDER_INFO } from '../data/mockData';
import { emailService, EmailNotification } from '../services/emailService';

interface SecureAdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: JobApplication[];
  onUpdateApplicationStatus: (
    appId: string,
    status: ApplicationStatus,
    notes?: string,
    historyEntry?: StatusHistoryEntry
  ) => void;
  onDeleteApplication?: (appId: string) => void;
  jobOpenings: JobOpening[];
  onAddNewJob: (job: JobOpening) => void;
  onToggleJobStatus: (jobId: string, status: 'Active' | 'Urgent' | 'Filled') => void;
  onDeleteJob: (jobId: string) => void;
  clientInquiries: ClientInquiry[];
  onUpdateClientInquiry: (inquiry: ClientInquiry) => void;
  onDeleteClientInquiry: (inquiryId: string) => void;
}

export const SecureAdminPortal: React.FC<SecureAdminPortalProps> = ({
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
  onUpdateClientInquiry,
  onDeleteClientInquiry,
}) => {
  // Authentication State - Restricted Strictly by Username and Password only
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('seven_star_admin_auth') === 'true';
  });
  const [adminUsername, setAdminUsername] = useState<string>(() => {
    return localStorage.getItem('seven_star_admin_username') || 'vinayjalan';
  });
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('seven_star_admin_password') || 'Vinay@7StarServices';
  });
  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isChangingCredentials, setIsChangingCredentials] = useState(false);
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');

  // Portal Navigation & Filtering State
  const [activeTab, setActiveTab] = useState<'applications' | 'jobs' | 'inquiries' | 'emails'>('applications');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [internalNote, setInternalNote] = useState('');
  const [statusUpdateMessage, setStatusUpdateMessage] = useState('');

  // Email Notification Outbox State
  const [emailOutbox, setEmailOutbox] = useState<EmailNotification[]>(() => emailService.getOutbox());
  const [selectedEmailPreview, setSelectedEmailPreview] = useState<EmailNotification | null>(null);
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);

  // Job Creation State
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
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

  // Reload email outbox when tab switches to emails
  useEffect(() => {
    if (activeTab === 'emails') {
      setEmailOutbox(emailService.getOutbox());
    }
  }, [activeTab]);

  // Keep selected application in sync
  useEffect(() => {
    if (selectedApplication) {
      const updated = applications.find((a) => a.id === selectedApplication.id);
      if (updated) {
        setSelectedApplication(updated);
      }
    } else if (applications.length > 0) {
      setSelectedApplication(applications[0]);
      setInternalNote(applications[0].adminNotes || '');
    }
  }, [applications]);

  if (!isOpen) return null;

  // Authentication Handlers - Username & Password Only
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = inputUsername.trim().toLowerCase();
    const validUsers = [
      adminUsername.toLowerCase(),
      'vinayjalan',
      'vinay@sivamwings.com',
    ];

    if (validUsers.includes(cleanUser) && inputPassword === adminPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('seven_star_admin_auth', 'true');
      setAuthError('');
      setInputUsername('');
      setInputPassword('');
    } else {
      setAuthError('Access denied: Invalid Username or Password. Please check credentials or use Auto-fill below.');
    }
  };

  const handleAutoFillCredentials = () => {
    setInputUsername('vinayjalan');
    setInputPassword('Vinay@7StarServices');
    setAuthError('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('seven_star_admin_auth');
  };

  const handleSaveNewCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUsername.trim() || newAdminPassword.length < 6) {
      alert('Username is required and Password must be at least 6 characters.');
      return;
    }
    const cleanUser = newAdminUsername.trim();
    const cleanPass = newAdminPassword;
    localStorage.setItem('seven_star_admin_username', cleanUser);
    localStorage.setItem('seven_star_admin_password', cleanPass);
    setAdminUsername(cleanUser);
    setAdminPassword(cleanPass);
    setIsChangingCredentials(false);
    setNewAdminUsername('');
    setNewAdminPassword('');
    alert('Admin Username & Password updated successfully!');
  };

  const handleSendTestNotification = async () => {
    setIsSendingTestEmail(true);
    const testApp: JobApplication = {
      id: `TEST-${Math.floor(1000 + Math.random() * 9000)}`,
      jobId: 'job-01',
      jobTitle: 'Senior Recruitment Specialist',
      candidateName: 'Rohit Sharma (Test Applicant)',
      email: 'rohit.test@gmail.com',
      phone: '+91 98765 43210',
      currentLocation: 'Kolkata, West Bengal',
      experienceYears: 4,
      highestQualification: 'MBA in Human Resources',
      currentSalary: '₹3,50,000 / year',
      noticePeriod: '15 Days / Immediate',
      expectedSalary: '₹4,50,000 / year',
      coverNote: 'This is a test notification generated by Admin Vinay Jalan to verify instant email delivery.',
      resumeFileName: 'Rohit_Sharma_HR_Resume.pdf',
      appliedDate: new Date().toISOString().slice(0, 10),
      status: 'New',
    };

    try {
      const sentNotification = await emailService.sendApplicationNotification(testApp);
      setEmailOutbox(emailService.getOutbox());
      setSelectedEmailPreview(sentNotification);
      setStatusUpdateMessage('Test notification successfully dispatched to vinay@sivamwings.com!');
      setTimeout(() => setStatusUpdateMessage(''), 4000);
    } catch (err) {
      console.error(err);
      alert('Failed to dispatch test notification.');
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  const handleEditClientInquiry = (inq: ClientInquiry) => {
    const companyName = window.prompt('Company name:', inq.companyName);
    if (companyName === null) return;
    const contactPerson = window.prompt('Contact person / designation:', inq.contactPerson);
    if (contactPerson === null) return;
    const email = window.prompt('Email address:', inq.email);
    if (email === null) return;
    const phone = window.prompt('Phone number:', inq.phone);
    if (phone === null) return;
    const serviceRequired = window.prompt('Service required:', inq.serviceRequired);
    if (serviceRequired === null) return;
    const estimatedHeadcount = window.prompt('Target headcount:', inq.estimatedHeadcount);
    if (estimatedHeadcount === null) return;
    const timeline = window.prompt('Deployment timeline:', inq.timeline);
    if (timeline === null) return;
    const message = window.prompt('Inquiry details:', inq.message);
    if (message === null) return;
    const status = window.prompt('Status (New, Contacted, Proposal Sent, Converted, Closed):', inq.status);
    if (status === null) return;
    const allowedStatuses = ['New', 'Contacted', 'Proposal Sent', 'Converted', 'Closed'];
    if (!allowedStatuses.includes(status.trim())) { window.alert('Please enter one of: New, Contacted, Proposal Sent, Converted, Closed.'); return; }
    onUpdateClientInquiry({ ...inq, companyName: companyName.trim(), contactPerson: contactPerson.trim(), email: email.trim(), phone: phone.trim(), serviceRequired: serviceRequired.trim(), estimatedHeadcount: estimatedHeadcount.trim(), timeline: timeline.trim(), message: message.trim(), status: status.trim() as ClientInquiry['status'] });
  };

  const handleDeleteEmailAlert = (id: string) => {
    if (!window.confirm(`Delete email alert ${id} from this browser's outbox? This does not recall an email already sent.`)) return;
    setEmailOutbox(emailService.deleteFromOutbox(id));
    if (selectedEmailPreview?.id === id) setSelectedEmailPreview(null);
  };

  const handleClearEmailAlerts = () => {
    if (!window.confirm('Delete all email alerts from this browser’s outbox? This does not recall emails already sent.')) return;
    emailService.clearOutbox();
    setEmailOutbox([]);
    setSelectedEmailPreview(null);
  };

  // Unique job titles for filtering
  const uniqueJobRoles = Array.from(new Set(applications.map((app) => app.jobTitle)));

  // Filtered Applications according to user request
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.phone.includes(searchQuery) ||
      (app.currentLocation && app.currentLocation.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole =
      selectedRoleFilter === 'All' || app.jobTitle === selectedRoleFilter;

    const matchesStatus =
      selectedStatusFilter === 'All' || app.status === selectedStatusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSelectApp = (app: JobApplication) => {
    setSelectedApplication(app);
    setInternalNote(app.adminNotes || '');
    setStatusUpdateMessage('');
  };

  // Status Update Handler (Status values: 'New', 'Under Review', 'Interviewing', 'Hired', 'Rejected')
  const handleStatusChange = (newStatus: ApplicationStatus) => {
    if (!selectedApplication) return;

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const historyEntry: StatusHistoryEntry = {
      status: newStatus,
      timestamp,
      updatedBy: 'Vinay Jalan (Owner)',
      note: internalNote.trim() || `Status updated to ${newStatus}`,
    };

    onUpdateApplicationStatus(selectedApplication.id, newStatus, internalNote, historyEntry);

    setSelectedApplication({
      ...selectedApplication,
      status: newStatus,
      adminNotes: internalNote,
      statusHistory: [historyEntry, ...(selectedApplication.statusHistory || [])],
    });

    setStatusUpdateMessage(`Candidate status successfully updated to "${newStatus}".`);
    setTimeout(() => setStatusUpdateMessage(''), 3500);
  };

  const handleSaveNotes = () => {
    if (!selectedApplication) return;
    onUpdateApplicationStatus(selectedApplication.id, selectedApplication.status, internalNote);
    setSelectedApplication({
      ...selectedApplication,
      adminNotes: internalNote,
    });
    setStatusUpdateMessage('Internal candidate notes saved.');
    setTimeout(() => setStatusUpdateMessage(''), 3000);
  };

  // Enhanced CSV Export Engine with UTF-8 BOM for flawless Excel & Google Sheets compatibility
  const exportToCSV = (appList: JobApplication[], filenamePrefix: string) => {
    if (appList.length === 0) {
      alert('No applicant records to export.');
      return;
    }

    const headers = [
      'Application ID',
      'Candidate Name',
      'Applied Role',
      'Current Stage Status',
      'Email Address',
      'Phone / WhatsApp',
      'Current Location',
      'Experience (Years)',
      'Highest Qualification',
      'Notice Period',
      'Current CTC',
      'Expected CTC',
      'Resume File Name',
      'Portfolio / Profile URL',
      'Candidate Statement / Cover Note',
      'Internal Notes (Vinay Jalan)',
      'Application Submitted Date & Time',
      'Status Audit History Timeline',
    ];

    const escapeCSV = (val: string | number | undefined | null) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = appList.map((a) => {
      const historySummary = (a.statusHistory || [])
        .map((h) => `[${h.timestamp}] ${h.status} (${h.updatedBy}): ${h.note || ''}`)
        .join(' | ');

      return [
        escapeCSV(a.id),
        escapeCSV(a.candidateName),
        escapeCSV(a.jobTitle),
        escapeCSV(a.status),
        escapeCSV(a.email),
        escapeCSV(a.phone),
        escapeCSV(a.currentLocation),
        escapeCSV(a.experienceYears),
        escapeCSV(a.highestQualification),
        escapeCSV(a.noticePeriod),
        escapeCSV(a.currentSalary || 'Not Disclosed'),
        escapeCSV(a.expectedSalary),
        escapeCSV(a.resumeFileName),
        escapeCSV(a.portfolioUrl || 'None'),
        escapeCSV(a.coverNote || 'None'),
        escapeCSV(a.adminNotes || 'None'),
        escapeCSV(a.appliedDate),
        escapeCSV(historySummary || 'No transitions recorded'),
      ].join(',');
    });

    // Add UTF-8 BOM (\uFEFF) so Excel respects special characters and formatting
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `${filenamePrefix}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setStatusUpdateMessage(`Exported ${appList.length} applicant records to CSV.`);
    setTimeout(() => setStatusUpdateMessage(''), 3500);
  };

  const handleExportAllCSV = () => {
    exportToCSV(applications, 'Seven_Star_Services_ALL_Job_Applicants');
  };

  const handleExportFilteredCSV = () => {
    exportToCSV(filteredApplications, 'Seven_Star_Services_Filtered_Job_Applicants');
  };

  const handleExportSingleCandidateCSV = (cand: JobApplication) => {
    exportToCSV([cand], `Seven_Star_Applicant_${cand.candidateName.replace(/\s+/g, '_')}_${cand.id}`);
  };

  const handleDownloadResumeFile = (cand: JobApplication) => {
    if (!cand.resumeStorageName) {
      alert('The original resume file is not available for this older/demo application. New candidate uploads will be downloadable in their original PDF or Word format.');
      return;
    }

    const link = document.createElement('a');
    link.href = `/api/resumes/${encodeURIComponent(cand.resumeStorageName)}`;
    link.download = cand.resumeFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatusUpdateMessage(`Original resume download started for ${cand.candidateName}.`);
    setTimeout(() => setStatusUpdateMessage(''), 3000);
  };

  // Job Creation
  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobData.title.trim() || !newJobData.description.trim()) return;

    const newJob: JobOpening = {
      id: editingJobId || `job-${Date.now().toString().slice(-4)}`, 
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
        .split(/[\n,]/)
        .map((b) => b.trim())
        .filter(Boolean),
      postedDate: new Date().toISOString().slice(0, 10),
      status: newJobData.status,
      featured: false,
    };

    onAddNewJob(newJob);
    setIsAddingJob(false);
    setEditingJobId(null);
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

  // Status counts for quick metrics
  const counts = {
    total: applications.length,
    new: applications.filter((a) => a.status === 'New').length,
    underReview: applications.filter((a) => a.status === 'Under Review').length,
    interviewing: applications.filter((a) => a.status === 'Interviewing').length,
    hired: applications.filter((a) => a.status === 'Hired').length,
    rejected: applications.filter((a) => a.status === 'Rejected').length,
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-7xl w-full my-4 shadow-2xl border border-slate-200 overflow-hidden flex flex-col min-h-0 h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* If Not Authenticated: Security Challenge Screen */}
        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-w-md w-full bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700/80 p-8 shadow-2xl text-center space-y-6">
              <div className="bg-white rounded-2xl p-2 w-fit mx-auto shadow-md">
                <img
                  src="/assets/sivamwings-logo.png"
                  alt="Sivam Wings"
                  className="h-12 w-auto object-contain"
                />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
                  Authentication Required
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-1">
                  Owner Portal Sign In
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Strictly restricted to Owner <strong className="text-white">Vinay Jalan</strong>. Access via authorized Username & Password only.
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Admin Username / Email
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="vinayjalan"
                    value={inputUsername}
                    onChange={(e) => setInputUsername(e.target.value)}
                    autoFocus
                    className="w-full text-sm font-medium py-3 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Secret Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      className="w-full text-sm font-medium py-3 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 space-y-1.5">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Authorized Owner:</span>
                    <span className="text-slate-200 font-bold font-mono">vinayjalan</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Default Password:</span>
                    <span className="text-amber-300 font-bold font-mono">Vinay@7StarServices</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFillCredentials}
                    className="w-full mt-1 pt-1 border-t border-slate-800 text-[11px] text-amber-300 hover:underline font-bold text-center block cursor-pointer"
                  >
                    ⚡ Auto-fill Owner Credentials
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:opacity-95 active:scale-[0.99] transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Verify Credentials & Enter Portal</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Admin Portal Content */
          <>
            {/* Top Bar with Founder Identity and Security Controls */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3.5">
                {/* Official Company Logo Badge */}
                <div className="bg-white rounded-xl p-1.5 shadow-sm shrink-0 flex items-center justify-center">
                  <img
                    src="/assets/sivamwings-logo.png"
                    alt="Sivam Wings Logo"
                    className="h-10 sm:h-11 w-auto object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-extrabold text-white">
                      Sivam Wings — Owner & Admin Portal
                    </h3>
                    <span className="text-[11px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                      Vinay Jalan (Owner)
                    </span>
                  </div>
                  <p className="text-xs text-blue-200">
                    Skilled People | Stronger Businesses · Candidate Management & Reporting
                  </p>
                </div>
              </div>

              {/* Security, Export and Logout Actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={handleExportAllCSV}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  title="Download complete applicant registry in CSV spreadsheet format"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export to CSV ({applications.length})</span>
                </button>

                <button
                  onClick={() => setIsChangingCredentials(!isChangingCredentials)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
                  title="Update Owner Login Credentials"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Change Password</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-xs text-slate-300 hover:text-rose-200 flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
                  title="Lock / Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Lock</span>
                </button>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Change Admin Credentials Box */}
            {isChangingCredentials && (
              <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-900 animate-in fade-in">
                <form onSubmit={handleSaveNewCredentials} className="flex flex-wrap items-center gap-2.5">
                  <span className="font-bold">Update Owner Credentials:</span>
                  <input
                    type="text"
                    required
                    placeholder="New Username"
                    value={newAdminUsername}
                    onChange={(e) => setNewAdminUsername(e.target.value)}
                    className="px-2.5 py-1 rounded border border-amber-300 bg-white text-xs w-36"
                  />
                  <input
                    type="password"
                    required
                    placeholder="New Password (min 6)"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    className="px-2.5 py-1 rounded border border-amber-300 bg-white text-xs w-44"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded cursor-pointer shadow-xs"
                  >
                    Save Credentials
                  </button>
                </form>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-amber-800">
                    Current: <code>{adminUsername}</code>
                  </span>
                  <button
                    onClick={() => setIsChangingCredentials(false)}
                    className="text-amber-800 hover:text-amber-950 font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Quick KPI Strip */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs shrink-0">
              <div
                onClick={() => setSelectedStatusFilter('All')}
                className={`p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedStatusFilter === 'All' ? 'bg-white shadow-2xs border border-blue-200' : 'hover:bg-white/60'
                }`}
              >
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Applicants</span>
                <span className="text-base font-extrabold text-slate-900 font-mono">{counts.total}</span>
              </div>

              <div
                onClick={() => setSelectedStatusFilter('New')}
                className={`p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedStatusFilter === 'New' ? 'bg-amber-50 shadow-2xs border border-amber-300' : 'hover:bg-white/60'
                }`}
              >
                <span className="text-amber-800 block text-[10px] uppercase font-bold">New Submissions</span>
                <span className="text-base font-extrabold text-amber-900 font-mono">{counts.new}</span>
              </div>

              <div
                onClick={() => setSelectedStatusFilter('Under Review')}
                className={`p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedStatusFilter === 'Under Review' ? 'bg-blue-50 shadow-2xs border border-blue-300' : 'hover:bg-white/60'
                }`}
              >
                <span className="text-blue-800 block text-[10px] uppercase font-bold">Under Review</span>
                <span className="text-base font-extrabold text-blue-900 font-mono">{counts.underReview}</span>
              </div>

              <div
                onClick={() => setSelectedStatusFilter('Interviewing')}
                className={`p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedStatusFilter === 'Interviewing' ? 'bg-purple-50 shadow-2xs border border-purple-300' : 'hover:bg-white/60'
                }`}
              >
                <span className="text-purple-800 block text-[10px] uppercase font-bold">Interviewing</span>
                <span className="text-base font-extrabold text-purple-900 font-mono">{counts.interviewing}</span>
              </div>

              <div
                onClick={() => setSelectedStatusFilter('Hired')}
                className={`p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedStatusFilter === 'Hired' ? 'bg-emerald-50 shadow-2xs border border-emerald-300' : 'hover:bg-white/60'
                }`}
              >
                <span className="text-emerald-800 block text-[10px] uppercase font-bold">Hired</span>
                <span className="text-base font-extrabold text-emerald-900 font-mono">{counts.hired}</span>
              </div>

              <div
                onClick={() => setSelectedStatusFilter('Rejected')}
                className={`p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedStatusFilter === 'Rejected' ? 'bg-rose-50 shadow-2xs border border-rose-300' : 'hover:bg-white/60'
                }`}
              >
                <span className="text-rose-800 block text-[10px] uppercase font-bold">Rejected</span>
                <span className="text-base font-extrabold text-rose-900 font-mono">{counts.rejected}</span>
              </div>
            </div>

            {/* Nav Tabs */}
            <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
                    activeTab === 'applications'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
                    activeTab === 'jobs'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Manage Job Openings</span>
                  <span className="px-1.5 py-0.2 rounded-full text-xs font-mono font-extrabold bg-slate-200 text-slate-700">
                    {jobOpenings.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
                    activeTab === 'inquiries'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Client Inquiries</span>
                  <span className="px-1.5 py-0.2 rounded-full text-xs font-mono font-extrabold bg-slate-200 text-slate-700">
                    {clientInquiries.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('emails')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
                    activeTab === 'emails'
                      ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span>Email Alerts Outbox</span>
                  <span className="px-1.5 py-0.2 rounded-full text-xs font-mono font-extrabold bg-purple-100 text-purple-900">
                    {emailOutbox.length}
                  </span>
                </button>
              </div>

              {activeTab === 'applications' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportAllCSV}
                    className="px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    title="Export all applicants to CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export to CSV ({applications.length} All)</span>
                  </button>

                  {filteredApplications.length !== applications.length && (
                    <button
                      onClick={handleExportFilteredCSV}
                      className="px-3 py-2 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Export current filtered results to CSV"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-600" />
                      <span>Export Filtered ({filteredApplications.length}) CSV</span>
                    </button>
                  )}
                </div>
              )}

              {activeTab === 'jobs' && (
                <button
                  onClick={() => setIsAddingJob(true)}
                  className="px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Post New Job Opening</span>
                </button>
              )}
            </div>

            {/* TAB 1: APPLICATIONS (With role filter & status tracking as requested) */}
            {activeTab === 'applications' && (
              <div className="flex-1 min-h-0 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
                {/* Left Split: Search, Filters & Application List */}
                <div className="lg:col-span-5 border-r border-slate-200 flex flex-col h-full min-h-0 bg-slate-50/40">
                  {/* Filter Toolbar */}
                  <div className="p-4 border-b border-slate-200 bg-white space-y-3">
                    {/* Search */}
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search applicant name, phone, email, location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                      />
                    </div>

                    {/* Filter by Job Role (User explicitly requested!) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                          <Filter className="w-3 h-3 text-blue-600" />
                          <span>Filter by Job Role:</span>
                        </label>
                        {selectedRoleFilter !== 'All' && (
                          <button
                            onClick={() => setSelectedRoleFilter('All')}
                            className="text-[10px] text-blue-600 hover:underline font-bold"
                          >
                            Clear Role Filter
                          </button>
                        )}
                      </div>
                      <select
                        value={selectedRoleFilter}
                        onChange={(e) => setSelectedRoleFilter(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      >
                        <option value="All">All Job Roles ({applications.length})</option>
                        {uniqueJobRoles.map((role) => {
                          const count = applications.filter((a) => a.jobTitle === role).length;
                          return (
                            <option key={role} value={role}>
                              {role} ({count})
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {/* Filter by Status ('New', 'Under Review', 'Interviewing', 'Hired', 'Rejected') */}
                    <div>
                      <div className="text-[11px] font-bold text-slate-600 mb-1">
                        Filter by Status:
                      </div>
                      <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-semibold pb-1 scrollbar-none">
                        {(['All', 'New', 'Under Review', 'Interviewing', 'Hired', 'Rejected'] as const).map(
                          (st) => (
                            <button
                              key={st}
                              onClick={() => setSelectedStatusFilter(st)}
                              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer text-xs ${
                                selectedStatusFilter === st
                                  ? 'bg-blue-600 text-white font-bold shadow-2xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {st}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Applicant Cards List */}
                  <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain divide-y divide-slate-200" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {filteredApplications.length === 0 ? (
                      <div className="p-10 text-center text-xs text-slate-500 space-y-2">
                        <Users className="w-8 h-8 text-slate-300 mx-auto" />
                        <div className="font-bold text-slate-700">No applicants found</div>
                        <div>Try adjusting the job role or status filter above.</div>
                      </div>
                    ) : (
                      filteredApplications.map((app) => {
                        const isSelected = selectedApplication?.id === app.id;
                        return (
                          <div
                            key={app.id}
                            onClick={() => handleSelectApp(app)}
                            className={`p-4 transition-all cursor-pointer flex flex-col gap-2 ${
                              isSelected
                                ? 'bg-blue-50/90 border-l-4 border-blue-600 shadow-2xs'
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
                                    ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                    : app.status === 'Under Review'
                                    ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                    : app.status === 'Interviewing'
                                    ? 'bg-purple-100 text-purple-900 border border-purple-200'
                                    : app.status === 'Hired'
                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                    : 'bg-rose-100 text-rose-900 border border-rose-200'
                                }`}
                              >
                                {app.status}
                              </span>
                            </div>

                            <div className="text-xs font-semibold text-blue-700 line-clamp-1">
                              {app.jobTitle}
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                              <span>
                                {app.experienceYears}y exp · {app.currentLocation}
                              </span>
                              <span className="font-mono text-slate-400">{app.appliedDate.split(' ')[0]}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right Split: Selected Candidate Deep Dive & Status Workflow */}
                <div className="lg:col-span-7 flex flex-col h-full min-h-0 bg-white overflow-y-auto overscroll-contain p-6 sm:p-8 space-y-6" style={{ WebkitOverflowScrolling: 'touch' }}>
                  {selectedApplication ? (
                    <>
                      {/* Candidate Header & Instant Communication */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-extrabold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                              {selectedApplication.id}
                            </span>
                            <span className="text-xs text-slate-400">
                              Applied on {selectedApplication.appliedDate}
                            </span>
                          </div>
                          <h4 className="text-2xl font-extrabold text-slate-900">
                            {selectedApplication.candidateName}
                          </h4>
                          <div className="text-xs font-bold text-slate-700 mt-1">
                            Applied Role: <span className="text-blue-700">{selectedApplication.jobTitle}</span>
                          </div>
                        </div>

                        {/* Direct Contact Triggers */}
                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={`tel:${selectedApplication.phone}`}
                            className="p-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors shadow-2xs"
                            title={`Call candidate at ${selectedApplication.phone}`}
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                          <a
                            href={`https://wa.me/${selectedApplication.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedApplication.candidateName)},%20this%20is%20Vinay%20Jalan%20from%20Seven%20Star%20Services.%20We%20reviewed%20your%20application%20for%20${encodeURIComponent(selectedApplication.jobTitle)}%20and%20would%20like%20to%20discuss%20an%20interview.`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors shadow-2xs"
                            title="Send WhatsApp Interview Invite"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>
                          <a
                            href={`mailto:${selectedApplication.email}?subject=Seven%20Star%20Services%20-%20Interview%20Invitation%20for%20${encodeURIComponent(selectedApplication.jobTitle)}`}
                            className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-800 hover:text-white transition-colors shadow-2xs"
                            title="Send Email"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleExportSingleCandidateCSV(selectedApplication)}
                            className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors shadow-2xs flex items-center gap-1 text-xs font-bold cursor-pointer"
                            title="Export this candidate record to CSV"
                          >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">CSV</span>
                          </button>
                        </div>
                      </div>

                      {/* Status Update Banner */}
                      {statusUpdateMessage && (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{statusUpdateMessage}</span>
                        </div>
                      )}

                      {/* STATUS UPDATES PANEL (Prominent interactive buttons as requested) */}
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                            Update Candidate Status:
                          </label>
                          <span className="text-xs text-slate-500 font-semibold">
                            Current Stage:{' '}
                            <strong className="text-slate-900 font-extrabold">
                              {selectedApplication.status}
                            </strong>
                          </span>
                        </div>

                        {/* Interactive Status Segmented Buttons */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {(['New', 'Under Review', 'Interviewing', 'Hired', 'Rejected'] as ApplicationStatus[]).map(
                            (st) => {
                              const isActive = selectedApplication.status === st;
                              return (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => handleStatusChange(st)}
                                  className={`py-2 px-3 rounded-xl text-xs font-extrabold text-center transition-all cursor-pointer shadow-2xs ${
                                    isActive
                                      ? st === 'Hired'
                                        ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400'
                                        : st === 'Rejected'
                                        ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400'
                                        : st === 'Interviewing'
                                        ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-400'
                                        : st === 'Under Review'
                                        ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
                                        : 'bg-amber-400 text-slate-950 shadow-sm ring-2 ring-amber-300'
                                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                                  }`}
                                >
                                  {st}
                                </button>
                              );
                            }
                          )}
                        </div>

                        {/* Internal Notes by Vinay Jalan */}
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700">
                              Internal Interviewer / Screening Notes:
                            </label>
                            <button
                              type="button"
                              onClick={handleSaveNotes}
                              className="text-xs font-bold px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer"
                            >
                              Save Notes
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            value={internalNote}
                            onChange={(e) => setInternalNote(e.target.value)}
                            placeholder="e.g. Conducted phone screening; good communication; expected salary aligned; ready to interview with client next Tuesday..."
                            className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                      </div>

                      {/* Candidate Profile Details Grid */}
                      <div className="space-y-3">
                        <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                          Candidate Qualifications & Compensation
                        </h5>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                            <span className="text-slate-400 block text-[11px]">Phone:</span>
                            <span className="font-bold text-slate-900 font-mono">{selectedApplication.phone}</span>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                            <span className="text-slate-400 block text-[11px]">Email:</span>
                            <span className="font-bold text-slate-900 truncate block">
                              {selectedApplication.email}
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                            <span className="text-slate-400 block text-[11px]">Current Location:</span>
                            <span className="font-bold text-slate-900">
                              {selectedApplication.currentLocation}
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                            <span className="text-slate-400 block text-[11px]">Experience:</span>
                            <span className="font-bold text-slate-900">
                              {selectedApplication.experienceYears} Years
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                            <span className="text-slate-400 block text-[11px]">Qualification:</span>
                            <span className="font-bold text-slate-900">
                              {selectedApplication.highestQualification}
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                            <span className="text-slate-400 block text-[11px]">Notice Period:</span>
                            <span className="font-bold text-slate-900">
                              {selectedApplication.noticePeriod}
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                            <span className="text-slate-400 block text-[11px]">Current CTC:</span>
                            <span className="font-bold text-slate-900">
                              {selectedApplication.currentSalary || 'Not specified'}
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                            <span className="text-slate-400 block text-[11px]">Expected CTC:</span>
                            <span className="font-extrabold text-emerald-700">
                              {selectedApplication.expectedSalary}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Attached Resume */}
                      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-blue-600 shrink-0" />
                          <div>
                            <div className="text-xs font-bold text-slate-900">
                              {selectedApplication.resumeFileName}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {selectedApplication.resumeFileSize || 'Resume File'} · Verified Attachment
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleExportSingleCandidateCSV(selectedApplication)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                            title="Export applicant data as CSV"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export CSV</span>
                          </button>
                          <button
                            onClick={() => handleDownloadResumeFile(selectedApplication)}
                            className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-blue-200 text-xs font-bold text-blue-700 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                            title="Download the candidate's original PDF or Word resume"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Download Original Resume</span>
                          </button>
                        </div>
                      </div>

                      {/* Candidate Cover Statement */}
                      {selectedApplication.coverNote && (
                        <div className="space-y-1.5">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                            Candidate's Note to Sivam Wings:
                          </h5>
                          <p className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                            "{selectedApplication.coverNote}"
                          </p>
                        </div>
                      )}

                      {/* Status History / Audit Trail */}
                      {selectedApplication.statusHistory && selectedApplication.statusHistory.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            <span>Application Tracking Timeline & Stage History</span>
                          </h5>
                          <div className="space-y-2">
                            {selectedApplication.statusHistory.map((hist, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                              >
                                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-900">
                                      Stage: {hist.status}
                                    </span>
                                    <span className="text-slate-400 font-mono text-[11px]">
                                      {hist.timestamp}
                                    </span>
                                  </div>
                                  <div className="text-slate-600 mt-0.5">
                                    {hist.note || 'Status updated'} ·{' '}
                                    <span className="text-slate-500 font-medium">By {hist.updatedBy}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Delete Application Record */}
                      {onDeleteApplication && (
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">
                            Sivam Wings Internal Confidential
                          </span>
                          <button
                            onClick={() => {
                              if (confirm(`Permanently delete ${selectedApplication.status === 'Rejected' ? 'rejected applicant' : 'applicant'} ${selectedApplication.candidateName} and their uploaded resume file? This cannot be undone.`)) {
                                onDeleteApplication(selectedApplication.id);
                                setSelectedApplication(null);
                              }
                            }}
                            className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-bold cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{selectedApplication.status === 'Rejected' ? 'Delete Rejected Applicant & Resume' : 'Delete Applicant & Resume'}</span>
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
                      <Users className="w-12 h-12 text-slate-300 mx-auto" />
                      <div className="text-base font-bold text-slate-700">No applicant selected</div>
                      <div className="text-xs text-slate-500 max-w-sm">
                        Choose any applicant from the list on the left to review their qualifications, download CV, schedule an interview, or update status.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: MANAGE JOB OPENINGS */}
            {activeTab === 'jobs' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {isAddingJob ? (
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 max-w-2xl mx-auto space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <h4 className="text-base font-extrabold text-slate-900">
                        {editingJobId ? 'Edit Job Opening' : 'Create New Client Job Opening'}
                      </h4>
                      <button
                        onClick={() => { setIsAddingJob(false); setEditingJobId(null); }}
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
                          <label className="block font-bold text-slate-700 mb-1">Department / Team</label>
                          <input
                            type="text"
                            value={newJobData.department}
                            onChange={(e) => setNewJobData({ ...newJobData, department: e.target.value as JobCategory })}
                            placeholder="e.g. Finance, Warehouse, HR"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                          />
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
                          placeholder="Brief summary of the role..."
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
                          placeholder="Supervise daily shift rosters&#10;Process gate passes&#10;Manage loading dock"
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
                          placeholder="Graduate / Diploma&#10;2+ years logistics experience&#10;Good leadership skills"
                          value={newJobData.requirements}
                          onChange={(e) => setNewJobData({ ...newJobData, requirements: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Compensation, Perks & Benefits</label>
                        <textarea
                          rows={3}
                          placeholder="Salary / incentive details, PF, ESIC, insurance, paid leave, bonus, travel or meal benefits (one per line)"
                          value={newJobData.benefits}
                          onChange={(e) => setNewJobData({ ...newJobData, benefits: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                        />
                        <p className="mt-1 text-[11px] text-slate-500">Enter compensation details and each perk or benefit on a separate line. These details are saved with the job post.</p>
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => { setIsAddingJob(false); setEditingJobId(null); }}
                          className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-xs"
                        >
                          {editingJobId ? 'Save Changes' : 'Publish Job Opening'}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900">
                          Active Client Job Openings ({jobOpenings.length})
                        </h4>
                        <p className="text-xs text-slate-500">
                          Candidates can view detailed descriptions and apply on the Careers page.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {jobOpenings.map((job) => (
                        <div
                          key={job.id}
                          className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
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
                                          ? 'bg-amber-400 text-slate-950 font-bold'
                                          : st === 'Active'
                                          ? 'bg-emerald-600 text-white font-bold'
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
                              <div className="font-semibold text-emerald-700">{job.salaryRange}</div>
                              <div>{job.openPositions} Open Positions</div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-slate-400 font-mono">ID: {job.id}</span>
                            <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                setEditingJobId(job.id);
                                setNewJobData({
                                  title: job.title, department: job.department, location: job.location, type: job.type,
                                  experience: job.experience, salaryRange: job.salaryRange, openPositions: job.openPositions,
                                  description: job.description, responsibilities: (job.responsibilities || []).join('\n'),
                                  requirements: (job.requirements || []).join('\n'), benefits: (job.benefits || []).join('\n'), status: job.status,
                                });
                                setIsAddingJob(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-bold"
                            >
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Remove job opening "${job.title}"?`)) {
                                  onDeleteJob(job.id);
                                }
                              }}
                              className="text-rose-600 hover:text-rose-800 flex items-center gap-1 font-bold"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: CLIENT INQUIRIES */}
            {activeTab === 'inquiries' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">
                      Client Staffing & HR Quote Requests ({clientInquiries.length})
                    </h4>
                    <p className="text-xs text-slate-500">
                      Inbound B2B requests submitted via Contact and Estimator forms
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {clientInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3"
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
                            className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Call {inq.phone}</span>
                          </a>
                          <a
                            href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(inq.contactPerson)},%20this%20is%20Vinay%20Jalan%20from%20Seven%20Star%20Services.%20We%20received%20your%20inquiry%20regarding%20${encodeURIComponent(inq.serviceRequired)}.`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEditClientInquiry(inq)} className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1" title="Edit this inquiry">
                            <span>Edit</span>
                          </button>
                          <button onClick={() => { if (window.confirm(`Delete inquiry ${inq.id} for ${inq.companyName}?`)) onDeleteClientInquiry(inq.id); }} className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1" title="Delete this inquiry">
                            <Trash2 className="w-3 h-3" /><span>Delete</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Service:</span>
                          <span className="font-semibold text-slate-800">{inq.serviceRequired}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Target Headcount:</span>
                          <span className="font-semibold text-slate-800">{inq.estimatedHeadcount}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Deployment Timeline:</span>
                          <span className="font-semibold text-slate-800">{inq.timeline}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 italic bg-white p-3 rounded-lg border border-slate-100">
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

            {/* Email Notifications Outbox & Delivery Center */}
            {activeTab === 'emails' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white shadow-md">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-amber-400" />
                      <h4 className="text-lg font-extrabold text-white">
                        Owner Email Dispatch & Alert Center
                      </h4>
                      <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/40">
                        Active Transport
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Automated notifications routed to Owner <strong className="text-white">Vinay Jalan</strong> at <code className="text-amber-300 font-bold">vinay@sivamwings.com</code> on every new job application.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {emailOutbox.length > 0 && <button onClick={handleClearEmailAlerts} className="px-3 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-100 border border-red-300/30 text-xs font-bold">Clear all alerts</button>}
                    <button
                      onClick={handleSendTestNotification}
                      disabled={isSendingTestEmail}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:opacity-95 text-slate-950 text-xs font-extrabold flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSendingTestEmail ? 'Dispatching...' : 'Dispatch Test Alert Email'}</span>
                    </button>
                  </div>
                </div>

                {emailOutbox.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 space-y-3">
                    <Mail className="w-10 h-10 text-slate-400 mx-auto" />
                    <h5 className="font-extrabold text-slate-800 text-base">
                      No Application Notifications Dispatched Yet
                    </h5>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Whenever a candidate applies through the Careers page or Job Application modal, a direct email alert will be recorded here and transmitted to vinay@sivamwings.com.
                    </p>
                    <button
                      onClick={handleSendTestNotification}
                      className="mt-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Trigger Sample Email Alert
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
                      <span>Recent Email Dispatches ({emailOutbox.length})</span>
                      <span>Target Inbox: vinay@sivamwings.com</span>
                    </div>

                    <div className="space-y-3">
                      {emailOutbox.map((email) => (
                        <div
                          key={email.id}
                          className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                                {email.id}
                              </span>
                              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                                <Check className="w-3 h-3" /> Delivered
                              </span>
                              <span className="text-slate-400">·</span>
                              <span className="text-slate-500">{email.timestamp}</span>
                            </div>

                            <h5 className="font-extrabold text-slate-900 text-sm truncate">
                              {email.subject}
                            </h5>

                            <p className="text-xs text-slate-600 line-clamp-2">
                              {email.previewText}
                            </p>

                            <div className="text-[11px] text-slate-500 flex items-center gap-3 pt-1">
                              <span>Applicant: <strong className="text-slate-800">{email.candidateName}</strong></span>
                              <span>Role: <strong className="text-slate-800">{email.jobTitle}</strong></span>
                              <span>Ref: <strong className="text-slate-800">{email.applicationId}</strong></span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => setSelectedEmailPreview(email)}
                              className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold transition-colors border border-purple-200 flex items-center gap-1.5 cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5 text-purple-600" />
                              <span>View Email HTML</span>
                            </button>
                            <button
                              onClick={() => handleDeleteEmailAlert(email.id)}
                              className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors border border-red-200 flex items-center gap-1.5 cursor-pointer"
                              title="Delete this alert from the outbox"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Email Preview Modal */}
            {selectedEmailPreview && (
              <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
                  <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-bold truncate">
                        Email Notification Preview ({selectedEmailPreview.id})
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedEmailPreview(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs space-y-1.5 shrink-0">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">From: <strong className="text-slate-800">{selectedEmailPreview.sender}</strong></span>
                      <span className="text-slate-500 font-mono">{selectedEmailPreview.timestamp}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">To: <strong className="text-blue-700">{selectedEmailPreview.recipient} (Vinay Jalan)</strong></span>
                    </div>
                    <div>
                      <span className="text-slate-500">Subject: <strong className="text-slate-900">{selectedEmailPreview.subject}</strong></span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 bg-slate-100/70">
                    <div
                      className="bg-white rounded-xl shadow-xs overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: selectedEmailPreview.htmlBody }}
                    />
                  </div>

                  <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
                    <button
                      onClick={() => setSelectedEmailPreview(null)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
