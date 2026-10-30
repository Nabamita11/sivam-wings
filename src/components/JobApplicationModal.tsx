import React, { useState } from 'react';
import { JobOpening, JobApplication } from '../types';
import {
  X,
  Briefcase,
  MapPin,
  Clock,
  IndianRupee,
  UploadCloud,
  CheckCircle,
  FileText,
  AlertCircle,
  Send,
  MessageSquare,
} from 'lucide-react';
import { FOUNDER_INFO } from '../data/mockData';

interface JobApplicationModalProps {
  job: JobOpening | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitApplication: (application: JobApplication) => void;
}

export const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  job,
  isOpen,
  onClose,
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

  if (!isOpen || !job) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.toLowerCase().split('.').pop();
      if (!['pdf', 'doc', 'docx'].includes(ext || '')) {
        setErrorMessage('Please choose a PDF, DOC, or DOCX resume.');
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        setErrorMessage('Resume must be 25 MB or smaller.');
        return;
      }
      setResumeFile(file);
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.candidateName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage('Please fill in your name, email, and contact phone number.');
      return;
    }

    if (!formData.expectedSalary.trim()) {
      setErrorMessage('Please specify your expected salary / CTC.');
      return;
    }

    if (!resumeFile) {
      setErrorMessage('Please upload or attach your resume (PDF/DOCX).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const uploadForm = new FormData();
      uploadForm.append('resume', resumeFile);
      const uploadResponse = await fetch('/api/upload-resume', { method: 'POST', body: uploadForm });
      const uploadResult = await uploadResponse.json();
      if (!uploadResponse.ok || !uploadResult.storageName) {
        throw new Error(uploadResult.error || 'Resume upload failed. Please try again.');
      }
      const newAppId = `SSS-APP-${Math.floor(1000 + Math.random() * 9000)}`;
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
        resumeFileSize: `${(resumeFile.size / 1024).toFixed(0)} KB`,
        resumeStorageName: uploadResult.storageName,
        coverNote: formData.coverNote.trim(),
        portfolioUrl: formData.portfolioUrl.trim(),
        appliedDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
        status: 'New',
      };

      await onSubmitApplication(newApplication);
      setSubmissionSuccess(newApplication);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to upload resume. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmissionSuccess(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-6 shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-5 sm:p-6 relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
              {job.department}
            </span>
            <span className="text-xs text-blue-200">· {job.type}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight pr-8">
            {job.title}
          </h3>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-blue-100">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-300" />
              <span>{job.location}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-300" />
              <span>Exp: {job.experience}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <IndianRupee className="w-4 h-4 text-amber-300" />
              <span>{job.salaryRange}</span>
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
          {submissionSuccess ? (
            /* Application Submitted Success State */
            <div className="text-center py-8 space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-2xl font-extrabold text-slate-900">
                  Application Submitted Successfully!
                </h4>
                <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
                  Thank you, <span className="font-bold text-slate-900">{submissionSuccess.candidateName}</span>. Your application for <span className="font-bold text-slate-900">{submissionSuccess.jobTitle}</span> has been received and routed directly to Founder Vinay Jalan.
                </p>
              </div>

              {/* Reference ID card */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl max-w-md mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Application Reference ID:</span>
                  <span className="font-mono font-bold text-blue-700 text-sm">
                    {submissionSuccess.id}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Applied Role:</span>
                  <span className="font-semibold text-slate-800">{submissionSuccess.jobTitle}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Resume Attached:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[180px]">
                    {submissionSuccess.resumeFileName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Routing Status:</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Sent to Owner Admin Inbox
                  </span>
                </div>
              </div>

              {/* Quick WhatsApp Alert to Founder */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/${FOUNDER_INFO.phoneClean}?text=Hello%20Sivam Wings%2C%20I%20would%20like%20to%20inquire%20about%20your%20recruitment%20and%20staffing%20solutions.}%20on%20the%20Seven%20Star%20Services%20website.%20My%20Name:%20${encodeURIComponent(submissionSuccess.candidateName)},%20Application%20ID:%20${submissionSuccess.id}.%20Kindly%20review.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Notify Vinay Jalan via WhatsApp</span>
                </a>

                <button
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            /* Application Form */
            <>
              {/* Job Overview Accordion */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-3">
                <div>
                  <span className="font-bold text-slate-900 block mb-1">Role Description:</span>
                  <p className="text-slate-600 leading-relaxed">{job.description}</p>
                </div>

                <div>
                  <span className="font-bold text-slate-900 block mb-1">Key Responsibilities:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    {job.responsibilities.slice(0, 3).map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-bold text-slate-900 block mb-1">Requirements:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    {job.requirements.slice(0, 3).map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Form starts */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Candidate Application Form</span>
                  </h4>
                  <span className="text-xs text-slate-400">All fields routed directly to Admin</span>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone / WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Current City / Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kolkata, Howrah, Pan-India"
                      value={formData.currentLocation}
                      onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="35"
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({ ...formData, experienceYears: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Current CTC / Salary (Annual or Monthly)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹3.5 Lakhs / yr or ₹25,000 / mo"
                      value={formData.currentSalary}
                      onChange={(e) => setFormData({ ...formData, currentSalary: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Expected CTC / Salary <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ₹4.5 Lakhs / yr or ₹32,000 / mo"
                      value={formData.expectedSalary}
                      onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Resume Upload Simulation with Real File Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Attach Resume / CV (PDF, DOCX) <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 bg-slate-50/60 transition-colors text-center relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {resumeFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <FileText className="w-8 h-8 text-blue-600 shrink-0" />
                        <div className="text-left">
                          <div className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-xs">
                            {resumeFile.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {(resumeFile.size / 1024).toFixed(0)} KB · Click or drag to replace
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                        <div className="text-xs font-bold text-slate-700">
                          Click to browse or drag and drop your resume
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Supports PDF, DOC, DOCX up to 5 MB · Required
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cover Note & Portfolio */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    LinkedIn / Portfolio Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/yourname"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Brief Note to Hiring Team / Vinay Jalan (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe your core skills, recent achievements, or why you are suitable for this role..."
                    value={formData.coverNote}
                    onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Submitting Application...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Job Application</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
