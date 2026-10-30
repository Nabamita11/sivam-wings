import React, { useState } from 'react';
import { Phone, Mail, MessageSquare, MapPin, CheckCircle, Send, Clock, UserCheck } from 'lucide-react';
import { FOUNDER_INFO } from '../data/mockData';
import { ClientInquiry } from '../types';

interface ContactSectionProps {
  initialService?: string;
  onSubmitInquiry: (inquiry: ClientInquiry) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  initialService = 'Recruitment & Talent Acquisition',
  onSubmitInquiry,
}) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    serviceRequired: initialService || 'Recruitment & Talent Acquisition',
    estimatedHeadcount: '10 - 25 Personnel',
    timeline: 'Within 2 Weeks',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newInquiry: ClientInquiry = {
        id: `INQ-${Math.floor(100 + Math.random() * 900)}`,
        companyName: formData.companyName.trim() || 'Confidential Client',
        contactPerson: formData.contactPerson.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        serviceRequired: formData.serviceRequired,
        estimatedHeadcount: formData.estimatedHeadcount,
        timeline: formData.timeline,
        message: formData.message.trim() || 'Requesting HR/Staffing services consultation.',
        date: new Date().toISOString().slice(0, 10),
        status: 'New',
      };

      onSubmitInquiry(newInquiry);
      setIsSubmitting(false);
      setSubmitted(true);
    }, 500);
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-gradient-to-b from-white to-blue-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 text-xs font-extrabold uppercase tracking-widest border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Let's Build Your Workforce Together</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight text-balance">
            Looking for Reliable{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
              HR & Manpower Solutions?
            </span>
          </h2>
          <p className="pt-2 text-base sm:text-lg text-slate-600 leading-relaxed">
            Whether you need skilled professionals, dependable staffing support, payroll assistance, or complete HR coordination, Sivam Wings is ready to understand your requirements. Let us help you simplify workforce management so you can focus on growing your business. Contact Founder Vinay Jalan today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Founder Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-6">
              <div className="space-y-3">
                <img
                  src="/assets/sivamwings-logo.png"
                  alt="Sivam Wings"
                  className="h-24 sm:h-28 w-auto max-w-full object-contain"
                />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Direct Founder Contact
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Connecting People. Strengthening Businesses.
                  </p>
                </div>
              </div>

              {/* Founder Vinay Jalan */}
              <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-100 space-y-2">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-700" />
                  <span className="text-xs font-bold text-slate-600">Founder & Principal:</span>
                  <span className="text-sm font-extrabold text-slate-900">{FOUNDER_INFO.name}</span>
                </div>
                <p className="text-xs text-slate-600">
                  Personally oversees client staffing mandates, SLA compliance, and enterprise partnerships.
                </p>
              </div>

              {/* Direct channels */}
              <div className="space-y-3 text-sm">
                <a
                  href={`https://wa.me/${FOUNDER_INFO.phoneClean}?text=Hello%20Sivam Wings%2C%20I%20would%20like%20to%20inquire%20about%20your%20recruitment%20and%20staffing%20solutions.`}
                  className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-slate-800 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">WhatsApp — Primary Number</div>
                    <div className="font-extrabold text-slate-900">{FOUNDER_INFO.phone}</div>
                  </div>
                </a>
                <a href="https://wa.me/917278369751?text=Hello%20Sivam Wings%2C%20I%20would%20like%20to%20inquire%20about%20your%20recruitment%20and%20staffing%20solutions." className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-slate-800 group">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700"><Phone className="w-5 h-5" /></div>
                  <div><div className="text-xs text-slate-500 font-medium">WhatsApp — Second Number</div><div className="font-extrabold text-slate-900">+91 72783 69751</div></div>
                </a>

                <a
                  href={`https://wa.me/${FOUNDER_INFO.phoneClean}?text=Hello%20Sivam Wings%2C%20I%20would%20like%20to%20inquire%20about%20your%20recruitment%20and%20staffing%20solutions.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-slate-800 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Instant WhatsApp Chat</div>
                    <div className="font-extrabold text-emerald-800">Chat with Vinay Jalan</div>
                  </div>
                </a>

                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(FOUNDER_INFO.email)}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-slate-800 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs text-slate-500 font-medium">Email Inquiries</div>
                    <div className="font-extrabold text-slate-900 truncate">{FOUNDER_INFO.email}</div>
                  </div>
                </a>

                <div className="flex items-start gap-3.5 p-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-700">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Headquarters & Operational Reach</div>
                    <div className="font-semibold text-xs text-slate-800">{FOUNDER_INFO.location}</div>
                  </div>
                </div>
              </div>

              {/* Working hours notice */}
              <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Mon – Sat: 9:00 AM – 7:30 PM IST (Emergency rosters 24/7)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Lead Capture Form */}
          <div className="lg:col-span-7">
            <div className="p-7 sm:p-9 rounded-2xl bg-white border border-slate-200/90 shadow-sm relative">
              {submitted ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle className="w-10 h-10" />
                  </div>

                  <h3 className="text-2xl font-extrabold text-slate-900">
                    Inquiry Received Successfully!
                  </h3>

                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-bold text-slate-900">{formData.contactPerson}</span>. Your requirements have been submitted directly to Founder Vinay Jalan. We will contact you within 2 to 4 business hours.
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/${FOUNDER_INFO.phoneClean}?text=Hello%20Sivam Wings%2C%20I%20would%20like%20to%20inquire%20about%20your%20recruitment%20and%20staffing%20solutions.}%20for%20${encodeURIComponent(formData.serviceRequired)}.`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4 fill-white" />
                      <span>Speed Up via WhatsApp</span>
                    </a>

                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                    >
                      Send Another Request
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">
                      Request HR Consultation & Staffing Proposal
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Fill out your workforce specifications for a customized service proposal and quotation.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Company / Organization Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Acme Logistics Pvt Ltd"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Contact Person Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajesh Ghosh"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Official Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="hr@acmelogistics.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

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
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Primary HR Service Required
                      </label>
                      <select
                        value={formData.serviceRequired}
                        onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="Recruitment & Talent Acquisition">Recruitment & Talent Acquisition</option>
                        <option value="Manpower Supply & Staffing Solutions">Manpower Supply & Staffing Solutions</option>
                        <option value="Payroll Management">Payroll Management</option>
                        <option value="HR Management & Employee Support">HR Management & Employee Support</option>
                        <option value="Statutory Compliance Support">Statutory Compliance Support</option>
                        <option value="Labour Contract & Workforce Management">Labour Contract & Workforce Management</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Target Headcount
                      </label>
                      <select
                        value={formData.estimatedHeadcount}
                        onChange={(e) => setFormData({ ...formData, estimatedHeadcount: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="1 - 5 Specialists (Lateral / Executive)">1 - 5 Specialists (Lateral / Executive)</option>
                        <option value="10 - 25 Personnel (Team / Shift)">10 - 25 Personnel (Team / Shift)</option>
                        <option value="25 - 50 Personnel (Operational Unit)">25 - 50 Personnel (Operational Unit)</option>
                        <option value="50+ Personnel (Facility / Turnkey)">50+ Personnel (Facility / Turnkey)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Brief Message or Operational Notes
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share specific job profiles, shifts, location, or urgency requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Routing to Vinay Jalan...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Requirement & Request Quote</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-400 text-center pt-2">
                    All services are subject to the agreed scope of work, applicable laws, and operational requirements.
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
