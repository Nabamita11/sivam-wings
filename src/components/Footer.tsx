import React from 'react';
import { Logo } from './Logo';
import { Phone, Mail, Shield, Heart } from 'lucide-react';
import { FOUNDER_INFO } from '../data/mockData';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <Logo size="md" variant="light" />
            <p className="text-sm text-slate-400 leading-relaxed">
              Sivam Wings delivers comprehensive HR, recruitment, manpower staffing, payroll, and statutory compliance solutions. Your People. Our Priority. Your Success.
            </p>
            <div className="space-y-2 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Founder:</span>
                <span className="font-bold text-white">{FOUNDER_INFO.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <a href={`https://wa.me/${FOUNDER_INFO.phoneClean}?text=Hello%20Sivam Wings%2C%20I%20would%20like%20to%20inquire%20about%20your%20recruitment%20and%20staffing%20solutions.`} className="hover:text-amber-300 transition-colors">
                  {FOUNDER_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <a href="https://wa.me/917278369751?text=Hello%20Sivam Wings%2C%20I%20would%20like%20to%20inquire%20about%20your%20recruitment%20and%20staffing%20solutions." className="hover:text-amber-300 transition-colors">+91 72783 69751</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(FOUNDER_INFO.email)}`} target="_blank" rel="noreferrer" className="hover:text-blue-300 transition-colors truncate">
                  {FOUNDER_INFO.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Quick Services Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Core Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Recruitment & Talent Acquisition
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Manpower Supply & Staffing Solutions
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Payroll Management & Processing
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  HR Management & Employee Support
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Statutory Compliance & Labour Laws
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Labour Contract & Workforce Management
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Nav & Careers */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Opportunities & Company
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About Sivam Wings
                </a>
              </li>
              <li>
                <a href="#industries" className="hover:text-white transition-colors">
                  Industries We Support
                </a>
              </li>
              <li>
                <a href="#openings" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Current Job Openings</span>
                  <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded">
                    We're Hiring
                  </span>
                </a>
              </li>
              <li>
                <a href="#approach" className="hover:text-white transition-colors">
                  Our 4-Phase Approach
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Contact & Location
                </a>
              </li>
            </ul>
          </div>

          {/* Admin & Trust */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Internal Administration
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Owner portal for reviewing candidate applications, scheduling interviews, and posting roles.
            </p>
            <button
              onClick={onOpenAdmin}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Owner Portal</span>
            </button>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Sivam Wings. All rights reserved.
          </p>
          <p className="text-center sm:text-right text-slate-500 max-w-xl">
            All services are subject to the agreed scope of work, applicable laws, and operational requirements.
          </p>
        </div>
      </div>
    </footer>
  );
};
