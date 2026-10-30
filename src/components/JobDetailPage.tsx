import React, { useState } from 'react';
import { JobOpening, JobApplication } from '../types';
import {
  ArrowLeft,
  MapPin,
  Clock,
  IndianRupee,
  Users,
  Calendar,
  Briefcase,
  CheckCircle2,
  Building,
  ShieldCheck,
  Share2,
  FileText,
  UploadCloud,
  Send,
  MessageSquare,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { FOUNDER_INFO } from '../data/mockData';

interface JobDetailPageProps {
  job: JobOpening;
  onBackToCareers: () => void;
  onSubmitApplication: (application: JobApplication) => void;
}

export const JobDetailPage: React.FC<JobDetailPageProps> = ({
  job,
  onBackToCareers,
  onSubmitApplication,
}) => {
  const [formData, setFormData] = useState({
    candidateName: '',
    email: '',
    phone: '',
    currentLocation: '',
    experienceYears: 2,
    highestQualification: 'Bachelor of Technology (B.Tech)',
    currentSalary: '',
    expectedSalary: '',
    noticePeriod: 'Immediate Joiner',
    portfolioUrl: '',
    coverNote: '',
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<JobApplication | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!['pdf', 'doc', 'docx'].includes(ext || '')) {
        setErrorMessage('Please choose a PDF, DOC, or DOCX resume.');
        e.target.value = '';
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        setErrorMessage('Resume must be 25 MB or smaller.');
        e.target.value = '';
        return;
      }
      setResumeFile(file);
      setErrorMessage('');
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const scrollToApplicationForm = () => {
    const formElement = document.getElementById('application-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.candidateName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage('Please provide your full name, email address, and phone number.');
      return;
    }

    if (!formData.expectedSalary.trim()) {
      setErrorMessage('Please state your expected salary / CTC.');
      return;
    }

    if (!resumeFile) {
      setErrorMessage('Please attach your resume (PDF/DOCX).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const uploadForm = new FormData();
      uploadForm.append('resume', resumeFile);
      const uploadResponse = await fetch('/api/upload-resume', { method: 'POST', body: uploadForm });
      const uploadResult = await uploadResponse.json().catch(() => ({}));
      if (!uploadResponse.ok || !uploadResult.storageName) {
        throw new Error(uploadResult.error || 'Resume upload failed. Please try again.');
      }

      const newAppId = `SSS-APP-${crypto.randomUUID()}`;
      const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
      const newApplication: JobApplication = {
        id: newAppId,
        jobId: job.id,
        jobTitle: job.title,
        candidateName: formData.candidateName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        currentLocation: formData.currentLocation.trim() || 'Not specified',
        experienceYears: Number(formData.experienceYears) || 0,
        highestQualification: formData.highestQualification,
        currentSalary: formData.currentSalary.trim() || 'Not disclosed',
        expectedSalary: formData.expectedSalary.trim(),
        noticePeriod: formData.noticePeriod,
        resumeFileName: resumeFile.name,
        resumeFileSize: `${Math.round(resumeFile.size / 1024)} KB`,
        resumeStorageName: uploadResult.storageName,
        coverNote: formData.coverNote.trim(),
        portfolioUrl: formData.portfolioUrl.trim(),
        appliedDate: now,
        status: 'New',
        statusHistory: [
          {
            status: 'New',
            timestamp: now,
            updatedBy: 'Candidate Online Application',
            note: `Applied for ${job.title} via Careers Page`,
          },
        ],
      };

      await onSubmitApplication(newApplication);
      setSubmissionSuccess(newApplication);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50/60 min-h-screen py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onBackToCareers}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-2xs hover:border-blue-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Job Openings</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{copiedLink ? 'Link Copied!' : 'Share Role'}</span>
            </button>
            <button
              onClick={scrollToApplicationForm}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>Apply for this Role</span>
            </button>
          </div>
        </div>

        {/* Main Job Hero Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-extrabold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                {job.department}
              </span>
              <span className="font-semibold text-slate-500">·</span>
              <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                {job.type}
              </span>
              {job.status === 'Urgent' && (
                <span className="font-extrabold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  Urgent Requirement
                </span>
              )}
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {job.title}
                </h1>
                <p className="mt-2 text-sm sm:text-base text-slate-600 flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Verified Client Partner via Sivam Wings</span>
                </p>
              </div>

              {/* Prominent Apply Now Button */}
              <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={scrollToApplicationForm}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Apply Now</span>
                </button>
              </div>
            </div>

            {/* Quick Meta Grid */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="text-slate-400 text-xs flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Work Location</span>
                </div>
                <div className="font-bold text-slate-900">{job.location}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="text-slate-400 text-xs flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Experience Required</span>
                </div>
                <div className="font-bold text-slate-900">{job.experience}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="text-slate-400 text-xs flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Annual / Monthly CTC</span>
                </div>
                <div className="font-extrabold text-emerald-700">{job.salaryRange}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="text-slate-400 text-xs flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Open Positions</span>
                </div>
                <div className="font-bold text-slate-900">{job.openPositions} Active Vacancies</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Detailed Specs + Sticky Application Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Role Details & Responsibilities */}
          <div className="lg:col-span-7 space-y-6">
            {/* Overview Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <span>Role Overview</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Key Responsibilities */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Key Roles & Responsibilities</span>
              </h2>
              <ul className="space-y-3">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Candidate Requirements & Skills */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span>Candidate Qualifications & Skills</span>
              </h2>
              <div className="space-y-2.5">
                {job.requirements.map((req, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Compensation & Employee Benefits */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Compensation, Perks & Benefits</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {job.benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100 text-xs font-semibold text-amber-950 flex items-center gap-2.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* About Sivam Wings Representation */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-7 space-y-3 shadow-md">
              <div className="flex items-center justify-between gap-4">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Direct Candidate Placement
                </div>
                <div className="bg-white rounded-lg p-1">
                  <img
                    src="/assets/sivamwings-logo.png"
                    alt="Sivam Wings"
                    className="h-6 w-auto object-contain"
                  />
                </div>
              </div>
              <h3 className="text-base font-extrabold text-white">
                Zero Recruitment Fee Guarantee
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Sivam Wings never charges candidates any fees for job placement, registration, or interview coordination. All applications go directly to Founder Vinay Jalan for direct employer interview shortlisting.
              </p>
            </div>
          </div>

          {/* Right Column: Embedded Job Application Form */}
          <div id="application-form-section" className="lg:col-span-5 scroll-mt-24">
            <div className="bg-white rounded-2xl border-2 border-blue-600/30 shadow-xl p-6 sm:p-8 space-y-6">
              {submissionSuccess ? (
                <div className="text-center py-6 space-y-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900">
                      Application Submitted!
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Thank you, <span className="font-bold text-slate-900">{submissionSuccess.candidateName}</span>. Your application for <span className="font-bold text-slate-900">{job.title}</span> has been received and routed directly to Founder Vinay Jalan in the owner admin portal.
                    </p>
                  </div>

                  {/* Reference ID card */}
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-left text-xs space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                      <span className="text-slate-500 font-medium">Tracking Reference:</span>
                      <span className="font-mono font-extrabold text-blue-700">{submissionSuccess.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Role:</span>
                      <span className="font-semibold text-slate-800">{job.title}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Expected CTC:</span>
                      <span className="font-semibold text-emerald-700">{submissionSuccess.expectedSalary}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Notice Period:</span>
                      <span className="font-semibold text-slate-800">{submissionSuccess.noticePeriod}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Status:</span>
                      <span className="font-bold text-blue-700">New (Awaiting Review)</span>
                    </div>
                  </div>

                  {/* WhatsApp Action */}
                  <div className="pt-2 space-y-2">
                    <a
                      href={`https://wa.me/${FOUNDER_INFO.phoneClean}?text=Hello%20Sivam Wings%2C%20I%20would%20like%20to%20inquire%20about%20your%20recruitment%20and%20staffing%20solutions.}%20on%20Seven%20Star%20Services.%20My%20Name:%20${encodeURIComponent(submissionSuccess.candidateName)},%20Application%20ID:%20${submissionSuccess.id}.%20Kindly%20review.`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 fill-white" />
                      <span>Notify Vinay Jalan via WhatsApp</span>
                    </a>

                    <button
                      onClick={() => setSubmissionSuccess(null)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Apply With Another Profile
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md mb-2">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Official Job Application Form</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Apply for {job.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Your details will be reviewed directly by Founder Vinay Jalan.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra"
                      value={formData.candidateName}
                      onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Current City / Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Kolkata, Howrah, Durgapur"
                        value={formData.currentLocation}
                        onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Total Experience (Years)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="35"
                        value={formData.experienceYears}
                        onChange={(e) =>
                          setFormData({ ...formData, experienceYears: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Highest Qualification
                      </label>
                      <select
                        value={formData.highestQualification}
                        onChange={(e) => setFormData({ ...formData, highestQualification: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="10th / 12th Pass">10th / 12th Pass</option>
                        <option value="Diploma / ITI">Diploma / ITI Technical</option>
                        <option value="Graduate (B.A / B.Com / B.Sc)">Graduate (B.A / B.Com / B.Sc)</option>
                        <option value="Bachelor of Technology (B.Tech)">Bachelor of Technology (B.Tech / B.E)</option>
                        <option value="Post Graduate / MBA / MCA">Post Graduate / MBA / MCA</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Notice Period
                      </label>
                      <select
                        value={formData.noticePeriod}
                        onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="Immediate Joiner">Immediate Joiner</option>
                        <option value="15 Days or less">15 Days or less</option>
                        <option value="30 Days">30 Days</option>
                        <option value="60 Days+">60 Days+</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Current CTC
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ₹3.5 LPA"
                        value={formData.currentSalary}
                        onChange={(e) => setFormData({ ...formData, currentSalary: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Expected CTC <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. ₹4.8 LPA"
                        value={formData.expectedSalary}
                        onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      />
                    </div>
                  </div>

                  {/* Resume Upload Box */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Attach Resume / CV (PDF, DOCX) <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-3.5 bg-slate-50/60 transition-colors text-center relative">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {resumeFile ? (
                        <div className="flex items-center justify-center gap-3">
                          <FileText className="w-7 h-7 text-blue-600 shrink-0" />
                          <div className="text-left">
                            <div className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                              {resumeFile.name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {Math.round(resumeFile.size / 1024)} KB · Click to replace
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <UploadCloud className="w-6 h-6 text-slate-400 mx-auto" />
                          <div className="text-xs font-semibold text-slate-700">
                            Click or drag to attach resume
                          </div>
                          <div className="text-[10px] text-slate-400">PDF, DOC, DOCX up to 25MB</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Brief Message to Vinay Jalan (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Share your key achievements, notable projects, or why you are a strong fit..."
                      value={formData.coverNote}
                      onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-4 rounded-xl text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Submitting Application to Owner Admin...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Job Application</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 text-center">
                    Direct submission to Sivam Wings Owner Admin Inbox.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
