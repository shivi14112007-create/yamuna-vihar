import React, { useState } from 'react';
import { Waves, ShieldCheck, Lock, Menu, X, Award } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  isAdminLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  isAdminLoggedIn = false
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: string, param?: string) => {
    onNavigate(view, param);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Tricolor Subtle Top Line */}
      <div className="h-1 w-full flex">
        <div className="w-1/3 bg-[#FF9933]"></div>
        <div className="w-1/3 bg-slate-200"></div>
        <div className="w-1/3 bg-[#138808]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo / Brand */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#0c2f4d] to-[#144272] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
              <Waves className="w-6 h-6 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-lg sm:text-xl text-[#0c2f4d] tracking-wide">
                  Yamuna Pledge
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                  National Initiative
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wider">
                Clean Yamuna, Pure India
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => handleNav('home')}
              className={`hover:text-[#0c2f4d] transition ${
                currentView === 'home' ? 'text-[#0c2f4d] font-bold' : ''
              }`}
            >
              Overview
            </button>
            <a
              href="#why-yamuna"
              onClick={(e) => {
                if (currentView !== 'home') {
                  e.preventDefault();
                  handleNav('home');
                  setTimeout(() => {
                    document.getElementById('why-yamuna')?.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                }
              }}
              className="hover:text-[#0c2f4d] transition"
            >
              Why Yamuna
            </a>
            <a
              href="#the-pledge"
              onClick={(e) => {
                if (currentView !== 'home') {
                  e.preventDefault();
                  handleNav('home');
                  setTimeout(() => {
                    document.getElementById('the-pledge')?.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                }
              }}
              className="hover:text-[#0c2f4d] transition"
            >
              The Pledge
            </a>
            <button
              onClick={() => handleNav('verify')}
              className={`hover:text-[#0c2f4d] flex items-center gap-1.5 transition ${
                currentView === 'verify' ? 'text-[#0c2f4d] font-bold' : ''
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verify Certificate
            </button>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleNav('admin')}
              className={`p-2 rounded-lg text-slate-500 hover:text-[#0c2f4d] hover:bg-slate-100 transition text-xs font-semibold flex items-center gap-1.5 border border-slate-200 ${
                currentView.startsWith('admin') ? 'bg-slate-100 text-[#0c2f4d]' : ''
              }`}
              title="Official Admin Portal"
            >
              <Lock className="w-3.5 h-3.5" />
              {isAdminLoggedIn ? 'Admin Panel' : 'Admin Login'}
            </button>

            <button
              onClick={() => handleNav('take-pledge')}
              className="bg-[#0c2f4d] hover:bg-[#144272] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-sm hover:shadow"
            >
              <Award className="w-4 h-4 text-amber-300" />
              Take the Pledge
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleNav('take-pledge')}
              className="bg-[#0c2f4d] text-white px-3 py-1.5 rounded-md text-xs font-semibold"
            >
              Pledge
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-fadeIn">
          <button
            onClick={() => handleNav('home')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Overview
          </button>
          <button
            onClick={() => handleNav('take-pledge')}
            className="block w-full text-left px-3 py-2 text-base font-semibold text-emerald-700 bg-emerald-50 rounded-lg flex items-center justify-between"
          >
            <span>Take the Yamuna Pledge</span>
            <Award className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleNav('verify')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-between"
          >
            <span>Verify a Certificate</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </button>
          <button
            onClick={() => handleNav('admin')}
            className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg flex items-center justify-between border-t border-slate-100 pt-3"
          >
            <span>Admin Portal</span>
            <Lock className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      )}
    </header>
  );
};
