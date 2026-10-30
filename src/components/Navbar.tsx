import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Phone, Shield, Menu, X, ArrowUpRight, MessageSquare, Lock } from 'lucide-react';
import { FOUNDER_INFO } from '../data/mockData';

interface NavbarProps {
  currentView: 'home' | 'careers' | 'job-detail';
  onNavigate: (view: 'home' | 'careers') => void;
  onOpenAdmin: () => void;
  onOpenContact: () => void;
  pendingApplicationsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAdmin,
  onOpenContact,
  pendingApplicationsCount,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId?: string) => {
    setMobileMenuOpen(false);
    if (currentView !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        if (sectionId) {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white text-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-amber-300">Direct Connect:</span>
            <span className="truncate">Need Immediate Manpower or HR Support? Call Vinay Jalan at</span>
            <a
              href={`https://wa.me/${FOUNDER_INFO.phoneClean}?text=Hello%20Sivam Wings%2C%20I%20would%20like%20to%20inquire%20about%20your%20recruitment%20and%20staffing%20solutions.`}
              className="font-bold underline hover:text-amber-200 transition-colors whitespace-nowrap"
            >
              {FOUNDER_INFO.phone}
            </a>
            <span className="text-white/70">/</span>
            <a href="https://wa.me/917278369751?text=Hello%20Sivam Wings%2C%20I%20would%20like%20to%20inquire%20about%20your%20recruitment%20and%20staffing%20solutions." className="font-bold underline hover:text-amber-200 transition-colors whitespace-nowrap">+91 72783 69751</a>
          </div>
          <div className="hidden md:flex items-center gap-4 shrink-0 text-blue-100">
            <span>Email: {FOUNDER_INFO.email}</span>
            <span aria-hidden="true">·</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={onOpenAdmin}
              className="hover:text-white transition-colors flex items-center gap-1.5 font-bold cursor-pointer bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-amber-300"
              title="Secure Owner Portal for Vinay Jalan"
            >
              <Lock className="w-3 h-3 text-amber-300" />
              <span>Owner Portal</span>
              {pendingApplicationsCount > 0 && (
                <span className="bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                  {pendingApplicationsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-Zone Sticky Navigation Bar */}
      <header
        className={`relative z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
            : 'bg-white border-b border-slate-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 lg:gap-5">
            {/* Zone 1: Brand Wordmark */}
            <button
              onClick={() => handleNavClick()}
              className="whitespace-nowrap shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg text-left cursor-pointer"
            >
              <Logo size="lg" showTagline={true} />
            </button>

            {/* Zone 2: 5 Concise Single-Line Nav Links */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-semibold text-slate-700">
              <button
                onClick={() => handleNavClick()}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
                  currentView === 'home' ? 'text-blue-600 font-bold' : 'hover:text-blue-600'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('services')}
                className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
              >
                Services
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
              >
                About Us
              </button>
              <button
                onClick={() => handleNavClick('industries')}
                className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
              >
                Industries
              </button>
              {/* Dedicated Careers Navigation Link with Hiring Badge */}
              <button
                onClick={() => {
                  onNavigate('careers');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 cursor-pointer ${
                  currentView === 'careers' || currentView === 'job-detail'
                    ? 'text-blue-600 font-extrabold'
                    : 'hover:text-blue-600'
                }`}
              >
                <span>Careers</span>
                <span className="text-[11px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  We're Hiring
                </span>
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
              >
                Contact
              </button>
            </nav>

            {/* Zone 3: Primary Action */}
            <div className="flex items-center gap-3 shrink-0">
              <a
                href={`https://wa.me/${FOUNDER_INFO.phoneClean}?text=Hello%20Sivam Wings%2C%20I%20would%20like%20to%20inquire%20about%20your%20recruitment%20and%20staffing%20solutions.`}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-emerald-600 text-white" />
                <span>WhatsApp</span>
              </a>

              <button
                onClick={onOpenContact}
                className="px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Request Staffing</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
                className="lg:hidden p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity">
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <Logo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 flex flex-col space-y-4">
                <button
                  onClick={() => handleNavClick()}
                  className="text-left text-base font-semibold text-slate-800 hover:text-blue-600 py-1"
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavClick('services')}
                  className="text-left text-base font-semibold text-slate-800 hover:text-blue-600 py-1"
                >
                  Our Core Services
                </button>
                <button
                  onClick={() => handleNavClick('about')}
                  className="text-left text-base font-semibold text-slate-800 hover:text-blue-600 py-1"
                >
                  About Sivam Wings
                </button>
                <button
                  onClick={() => handleNavClick('industries')}
                  className="text-left text-base font-semibold text-slate-800 hover:text-blue-600 py-1"
                >
                  Industries We Serve
                </button>
                {/* Careers on Mobile */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('careers');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left text-base font-semibold text-blue-600 flex items-center justify-between py-1"
                >
                  <span>Careers & Job Openings</span>
                  <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                    Openings
                  </span>
                </button>
                <button
                  onClick={() => handleNavClick('approach')}
                  className="text-left text-base font-semibold text-slate-800 hover:text-blue-600 py-1"
                >
                  Our Approach
                </button>
                <button
                  onClick={() => handleNavClick('contact')}
                  className="text-left text-base font-semibold text-slate-800 hover:text-blue-600 py-1"
                >
                  Contact Vinay Jalan
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-3">
              <a
                href={`https://wa.me/${FOUNDER_INFO.phoneClean}?text=Hello%20Sivam Wings%2C%20I%20would%20like%20to%20inquire%20about%20your%20recruitment%20and%20staffing%20solutions.`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Call Vinay Jalan ({FOUNDER_INFO.phone})</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Shield className="w-4 h-4 text-amber-600" />
                <span>Owner Portal</span>
                {pendingApplicationsCount > 0 && (
                  <span className="bg-amber-400 text-slate-900 text-xs px-1.5 py-0.2 rounded-full font-bold">
                    {pendingApplicationsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
