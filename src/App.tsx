/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { HrCalculator } from './components/HrCalculator';
import { IndustriesSection } from './components/IndustriesSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { OurApproach } from './components/OurApproach';
import { CareersSection } from './components/CareersSection';
import { CareersPage } from './components/CareersPage';
import { JobDetailPage } from './components/JobDetailPage';
import { JobApplicationModal } from './components/JobApplicationModal';
import { SecureAdminPortal } from './components/SecureAdminPortal';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { emailService } from './services/emailService';

import {
  INITIAL_JOB_OPENINGS,
  INITIAL_JOB_APPLICATIONS,
  INITIAL_CLIENT_INQUIRIES,
  FOUNDER_INFO,
} from './data/mockData';
import {
  JobOpening,
  JobApplication,
  ClientInquiry,
  ApplicationStatus,
  StatusHistoryEntry,
} from './types';
import { Phone, MessageSquare, Shield, Bell } from 'lucide-react';

export default function App() {
  // Page view routing state: 'home' | 'careers' | 'job-detail'
  const [currentView, setCurrentView] = useState<'home' | 'careers' | 'job-detail'>('home');
  const [selectedJobDetail, setSelectedJobDetail] = useState<JobOpening | null>(null);

  // Local storage state management for persistent candidate applications and job postings
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>(() => {
    try {
      const saved = localStorage.getItem('seven_star_jobs_v2');
      return saved ? JSON.parse(saved) : INITIAL_JOB_OPENINGS;
    } catch {
      return INITIAL_JOB_OPENINGS;
    }
  });

  const [applications, setApplications] = useState<JobApplication[]>(() => {
    try {
      const saved = localStorage.getItem('seven_star_applications_v2');
      return saved ? JSON.parse(saved) : INITIAL_JOB_APPLICATIONS;
    } catch {
      return INITIAL_JOB_APPLICATIONS;
    }
  });

  const [clientInquiries, setClientInquiries] = useState<ClientInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('seven_star_inquiries');
      return saved ? JSON.parse(saved) : INITIAL_CLIENT_INQUIRIES;
    } catch {
      return INITIAL_CLIENT_INQUIRIES;
    }
  });

  // Modal controls must be initialized before effects that depend on them.
  const [selectedJobForModal, setSelectedJobForModal] = useState<JobOpening | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isSecureAdminOpen, setIsSecureAdminOpen] = useState(false);
  const [contactServicePrefill, setContactServicePrefill] = useState('Recruitment & Talent Acquisition');
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Load server-persisted jobs so postings created by the admin appear for public visitors.
  useEffect(() => {
    let active = true;
    const loadJobs = async () => {
      try {
        const response = await fetch('/api/jobs', { cache: 'no-store' });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || 'Could not load jobs.');
        if (!Array.isArray(result.jobs)) return;
        if (result.jobs.length > 0) {
          if (active) setJobOpenings(result.jobs);
          return;
        }
        // First-run migration: seed the server with the existing local/default jobs
        // so they remain visible to candidates on other browsers and devices.
        const seedJobs = jobOpenings.length ? jobOpenings : INITIAL_JOB_OPENINGS;
        const saved = await Promise.all(seedJobs.map(async (job) => {
          const saveResponse = await fetch('/api/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(job) });
          return saveResponse.ok;
        }));
        if (active && saved.every(Boolean)) setJobOpenings(seedJobs);
      } catch (error) {
        console.error('Could not refresh job postings from server:', error);
      }
    };
    void loadJobs();
    return () => { active = false; };
  // Initial state is used only to seed an empty server once.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync a local cache for a smoother startup, while the server remains authoritative.
  useEffect(() => {
    try {
      localStorage.setItem('seven_star_jobs_v2', JSON.stringify(jobOpenings));
    } catch (err) {
      console.error('Error saving jobs:', err);
    }
  }, [jobOpenings]);

  // Load the authoritative applicant list from the server on startup and whenever
  // the admin portal is opened. Browser storage is only a cache, not the source of truth.
  useEffect(() => {
    let active = true;
    const loadApplications = async () => {
      try {
        const response = await fetch('/api/applications', { cache: 'no-store' });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || `Application load failed (${response.status}).`);
        if (active && Array.isArray(result.applications)) {
          setApplications(result.applications);
        }
      } catch (err) {
        console.error('Could not refresh applications from server:', err);
        if (active && isSecureAdminOpen) {
          showToast('Could not load applications from the server. Check the VS Code terminal and Supabase settings.');
        }
      }
    };
    void loadApplications();
    return () => { active = false; };
  }, [isSecureAdminOpen]);

  useEffect(() => {
    try { localStorage.setItem('seven_star_applications_v2', JSON.stringify(applications)); }
    catch (err) { console.error('Error caching applications:', err); }
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem('seven_star_inquiries', JSON.stringify(clientInquiries));
    } catch (err) {
      console.error('Error saving inquiries:', err);
    }
  }, [clientInquiries]);

  // New applications counter for Owner's notification badge
  const newApplicationsCount = applications.filter((app) => app.status === 'New').length;

  const showToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => {
      setToastNotification(null);
    }, 4500);
  };

  // Job application submission handler with mock email notification dispatch
  const handleApplicationSubmit = async (newApp: JobApplication) => {
    const response = await fetch('/api/applications', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newApp),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'Could not save your application. Please try again.');
    const savedApplication = result.application && typeof result.application === 'object' ? result.application as JobApplication : newApp;
    setApplications((prev) => [savedApplication, ...prev.filter((item) => item.id !== savedApplication.id)]);
    try { await emailService.sendApplicationNotification(savedApplication); }
    catch (err) { console.warn('Notification dispatch error:', err); }
    showToast(`Application #${newApp.id} submitted and saved.`);
  };

  // Open general application modal (if not tied to a specific job)
  const handleOpenGeneralApplication = () => {
    const generalJob: JobOpening = {
      id: 'general-talent-pool',
      title: 'General Talent Pool / Future Opportunities',
      department: 'HR & Administration',
      location: 'Pan-India / Multiple Locations',
      type: 'Full-time',
      experience: 'Any Experience Level',
      salaryRange: 'Industry Standard / Commensurate with experience',
      openPositions: 10,
      description:
        'Submit your profile to Sivam Wings active talent repository. Our recruiters match incoming requirements daily across IT, Manufacturing, Logistics, Healthcare, Retail, and Corporate offices.',
      responsibilities: [
        'Engage in candidate discovery interviews with Seven Star recruitment specialists',
        'Receive fast-track priority notifications when client mandates open in your area',
        'Direct representation to prospective employers with complete background readiness',
      ],
      requirements: [
        'Updated resume with valid phone number and email',
        'Clear statement of current skillset, salary requirements, and notice period',
      ],
      benefits: [
        'Zero candidate fee policy',
        'Direct connection to trusted corporate employers',
        'Guidance on interview preparation and salary benchmarking',
      ],
      postedDate: new Date().toISOString().slice(0, 10),
      status: 'Active',
    };
    setSelectedJobForModal(generalJob);
    setIsApplicationModalOpen(true);
  };

  // Navigation handlers
  const handleNavigateToJobDetail = (job: JobOpening) => {
    setSelectedJobDetail(job);
    setCurrentView('job-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyFromCard = (job: JobOpening) => {
    // Navigate directly to the detailed job description page with its prominent apply form
    setSelectedJobDetail(job);
    setCurrentView('job-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin handlers
  const handleUpdateApplicationStatus = (
    appId: string,
    status: ApplicationStatus,
    notes?: string,
    historyEntry?: StatusHistoryEntry
  ) => {
    const current = applications.find((app) => app.id === appId);
    if (!current) return;
    const updatedHistory = historyEntry ? [historyEntry, ...(current.statusHistory || [])] : current.statusHistory;
    const updated = { ...current, status, adminNotes: notes ?? current.adminNotes, statusHistory: updatedHistory };
    fetch(`/api/applications/${encodeURIComponent(appId)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: updated.status, adminNotes: updated.adminNotes, statusHistory: updated.statusHistory }) })
      .then(async (response) => { if (!response.ok) throw new Error('Could not save applicant status to database.'); setApplications((prev) => prev.map((app) => app.id === appId ? updated : app)); showToast(`Applicant #${appId} stage updated to "${status}".`); })
      .catch((error) => { console.error(error); showToast('Status was not saved to the database. Check storage configuration.'); });
  };

  const handleDeleteApplication = async (appId: string) => {
    const applicationToDelete = applications.find((app) => app.id === appId);
    if (!applicationToDelete) return;
    try {
      const response = await fetch(`/api/applications/${encodeURIComponent(appId)}`, { method: 'DELETE' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) { showToast(result.error || 'Could not delete applicant and resume.'); return; }
      setApplications((prev) => prev.filter((app) => app.id !== appId));
      if (result.warning) {
        showToast(result.warning);
      } else {
        showToast(applicationToDelete.status === 'Rejected' ? 'Rejected applicant and resume permanently deleted.' : 'Applicant and resume permanently deleted.');
      }
    } catch (error) {
      console.error('Application deletion failed:', error);
      showToast('Could not reach storage. Applicant was not removed from the list.');
    }
  };

  const handleAddNewJob = (job: JobOpening) => {
    void (async () => {
      try {
        const response = await fetch('/api/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(job) });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || 'Could not publish job.');
        setJobOpenings((prev) => [job, ...prev.filter((item) => item.id !== job.id)]);
        showToast(`Job opening "${job.title}" published and saved.`);
      } catch (error) {
        console.error('Job publish failed:', error);
        showToast(error instanceof Error ? error.message : 'Could not publish job.');
      }
    })();
  };

  const handleToggleJobStatus = (jobId: string, status: 'Active' | 'Urgent' | 'Filled') => {
    const current = jobOpenings.find((job) => job.id === jobId);
    if (!current) return;
    const updated = { ...current, status };
    void fetch(`/api/jobs/${encodeURIComponent(jobId)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
      .then(async (response) => { const result = await response.json().catch(() => ({})); if (!response.ok) throw new Error(result.error || 'Could not update job.'); setJobOpenings((prev) => prev.map((job) => job.id === jobId ? updated : job)); })
      .catch((error) => { console.error('Job status update failed:', error); showToast('Could not save job status.'); });
  };

  const handleDeleteJob = (jobId: string) => {
    void fetch(`/api/jobs/${encodeURIComponent(jobId)}`, { method: 'DELETE' })
      .then(async (response) => { const result = await response.json().catch(() => ({})); if (!response.ok) throw new Error(result.error || 'Could not delete job.'); setJobOpenings((prev) => prev.filter((job) => job.id !== jobId)); showToast('Job opening removed.'); })
      .catch((error) => { console.error('Job deletion failed:', error); showToast('Could not delete job posting.'); });
  };

  const handleClientInquirySubmit = (inquiry: ClientInquiry) => {
    setClientInquiries((prev) => [inquiry, ...prev]);
    showToast('Inquiry received! Our team will contact you shortly.');
  };

  const handleUpdateClientInquiry = (updatedInquiry: ClientInquiry) => {
    setClientInquiries((prev) => prev.map((inquiry) => inquiry.id === updatedInquiry.id ? updatedInquiry : inquiry));
    showToast(`Inquiry ${updatedInquiry.id} updated successfully.`);
  };

  const handleDeleteClientInquiry = (inquiryId: string) => {
    setClientInquiries((prev) => prev.filter((inquiry) => inquiry.id !== inquiryId));
    showToast(`Inquiry ${inquiryId} deleted from this browser's saved admin records.`);
  };

  const handleSelectServiceForInquiry = (serviceTitle: string) => {
    setContactServicePrefill(serviceTitle);
    if (currentView !== 'home') {
      setCurrentView('home');
    }
    setTimeout(() => {
      const contactElem = document.getElementById('contact');
      if (contactElem) {
        contactElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleEstimateSubmit = (data: {
    service: string;
    industry: string;
    headcount: number;
    timeline: string;
  }) => {
    setContactServicePrefill(data.service);
    if (currentView !== 'home') {
      setCurrentView('home');
    }
    setTimeout(() => {
      const contactElem = document.getElementById('contact');
      if (contactElem) {
        contactElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    showToast(`Estimate configured for ${data.headcount} personnel in ${data.industry}!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <Bell className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-xs font-semibold leading-snug">{toastNotification}</span>
        </div>
      )}

      {/* Main 3-Zone Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => setIsSecureAdminOpen(true)}
        onOpenContact={() => {
          if (currentView !== 'home') {
            setCurrentView('home');
          }
          setTimeout(() => {
            const contactElem = document.getElementById('contact');
            if (contactElem) {
              contactElem.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }}
        pendingApplicationsCount={newApplicationsCount}
      />

      {/* Dynamic View Router */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <>
            {/* Hero Section */}
            <Hero
              onOpenContact={() => {
                const contactElem = document.getElementById('contact');
                if (contactElem) {
                  contactElem.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />

            {/* Core Services Section (6 verticals) */}
            <ServicesSection onSelectServiceForInquiry={handleSelectServiceForInquiry} />

            {/* About Sivam Wings (Mission, Vision, Founder Vinay Jalan) */}
            <AboutSection />

            {/* Interactive Workforce & Staffing Requirement Estimator */}
            <HrCalculator onEstimateSubmit={handleEstimateSubmit} />

            {/* Current Job Openings & Career Opportunities section on Homepage */}
            <CareersSection
              jobOpenings={jobOpenings}
              onApplyForJob={handleApplyFromCard}
              onOpenApplicationModal={handleOpenGeneralApplication}
            />

            {/* Industries We Serve (7 industries from brief) */}
            <IndustriesSection
              onSelectIndustryForStaffing={(indTitle) => {
                setContactServicePrefill(`Staffing for ${indTitle}`);
                const contactElem = document.getElementById('contact');
                if (contactElem) {
                  contactElem.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />

            {/* Why Choose Sivam Wings? (6 pillars) */}
            <WhyChooseUs />

            {/* Our Approach (4 steps) */}
            <OurApproach />

            {/* Contact Section (Vinay Jalan, Phone +91 70449 89666, Email, Lead Form) */}
            <ContactSection
              initialService={contactServicePrefill}
              onSubmitInquiry={handleClientInquirySubmit}
            />
          </>
        )}

        {currentView === 'careers' && (
          /* Dedicated Careers Page */
          <CareersPage
            jobOpenings={jobOpenings}
            onSelectJob={handleNavigateToJobDetail}
            onOpenGeneralApplication={handleOpenGeneralApplication}
            onNavigateHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'job-detail' && selectedJobDetail && (
          /* Detailed Job Description Page with Prominent Apply Now Form */
          <JobDetailPage
            job={selectedJobDetail}
            onBackToCareers={() => {
              setCurrentView('careers');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSubmitApplication={handleApplicationSubmit}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsSecureAdminOpen(true)} />

      {/* Floating Mobile Quick Connect Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2.5 px-4 flex items-center justify-between gap-3 shadow-lg">
        <a
          href={`tel:${FOUNDER_INFO.phone}`}
          className="flex-1 py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call Vinay Jalan</span>
        </a>
        <a
          href={`https://wa.me/${FOUNDER_INFO.phoneClean}?text=Hello%20Sivam Wings%2C%20I%20would%20like%20to%20inquire%20about%20your%20recruitment%20and%20staffing%20solutions.`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-2.5 px-3 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
        >
          <MessageSquare className="w-3.5 h-3.5 fill-white" />
          <span>WhatsApp</span>
        </a>
        <button
          onClick={() => setIsSecureAdminOpen(true)}
          className="p-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 relative cursor-pointer"
          title="Secure Owner Portal for Vinay Jalan"
        >
          <Shield className="w-4 h-4 text-amber-600" />
          {newApplicationsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full" />
          )}
        </button>
      </div>

      {/* General Modal for Quick/Open Application */}
      <JobApplicationModal
        job={selectedJobForModal}
        isOpen={isApplicationModalOpen}
        onClose={() => {
          setIsApplicationModalOpen(false);
          setSelectedJobForModal(null);
        }}
        onSubmitApplication={handleApplicationSubmit}
      />

      {/* Secure Owner / Admin Portal (Vinay Jalan) */}
      <SecureAdminPortal
        isOpen={isSecureAdminOpen}
        onClose={() => setIsSecureAdminOpen(false)}
        applications={applications}
        onUpdateApplicationStatus={handleUpdateApplicationStatus}
        onDeleteApplication={handleDeleteApplication}
        jobOpenings={jobOpenings}
        onAddNewJob={handleAddNewJob}
        onToggleJobStatus={handleToggleJobStatus}
        onDeleteJob={handleDeleteJob}
        clientInquiries={clientInquiries}
        onUpdateClientInquiry={handleUpdateClientInquiry}
        onDeleteClientInquiry={handleDeleteClientInquiry}
      />
    </div>
  );
}
