import React, { useState } from 'react';
import { Waves, Shield, Award, Lock, ExternalLink, Heart, ChevronRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [modalContent, setModalContent] = useState<{ title: string; body: string } | null>(null);

  const showPrivacyPolicy = () => {
    setModalContent({
      title: 'Privacy Policy — Clean Yamuna Initiative',
      body: `The Clean Yamuna Initiative is dedicated to safeguarding the personal privacy of all participating citizens. 

1. Data Collection: We collect only essential contact coordinates (Name, Email, City, State, optional Phone number and Institution) strictly for the purpose of issuing, cataloging, and validating citizen pledge certificates.
2. Public Privacy Protection: Public certificate verification lookups (/verify/:certificateId) intentionally display only the recipient's Name, State, City, Date, and Registry Status. Private coordinates such as phone numbers and email addresses are strictly shielded from public access.
3. Data Sharing: Your information is never sold, rented, or distributed to third-party commercial advertisers. Data is exclusively preserved for official non-profit environmental and civic accountability.
4. Security: All records are secured using cryptographic password hashing, tokenized authentication, and restricted role-based administrative access.`
    });
  };

  const showTerms = () => {
    setModalContent({
      title: 'Terms of Commitment & Civic Disclaimer',
      body: `1. Moral Commitment: The Clean Yamuna Pledge is a voluntary, non-partisan solemn civic declaration by citizens dedicated to environmental preservation, reduction of single-use plastics, and responsible waste management along River Yamuna and connected river basins.
2. E-Certificate Usage: The generated digital e-certificate is an honorary recognition of your commitment. It may be proudly presented in educational institutions, civic programs, and sustainability forums.
3. Authenticity: Each certificate features a verifiable cryptographic serial ID and verifiable QR code registered in the database.
4. Non-commercial: This platform is built for civic ecological consciousness and public empowerment.`
    });
  };

  return (
    <footer className="bg-[#081c2c] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-[#144272] flex items-center justify-center text-white shadow-md">
                <Waves className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-serif text-white tracking-wide">
                  Clean Yamuna Initiative
                </h3>
                <p className="text-xs text-sky-400 font-medium tracking-wider">
                  Clean Yamuna, Pure India
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              A national citizen-led environmental movement dedicated to restoring the ecological sanctity, biological vitality, and sacred dignity of the Holy River Yamuna.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Official Citizen Registry • Verifiable E-Certificates</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Pledge Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('take-pledge')}
                  className="hover:text-white transition flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
                  Take the Pledge
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('verify')}
                  className="hover:text-white transition flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
                  Verify Certificate
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
                  Overview & Impact
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-white transition flex items-center gap-1.5 text-left text-slate-400"
                >
                  <Lock className="w-3 h-3 text-slate-400" />
                  Admin Login
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Policies */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Governance & Trust
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={showPrivacyPolicy}
                  className="hover:text-white transition text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={showTerms}
                  className="hover:text-white transition text-left"
                >
                  Terms & Disclaimer
                </button>
              </li>
              <li>
                <span className="text-xs text-slate-500 block pt-1">
                  Protected under National Environmental Citizen Charters.
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} Clean Yamuna Initiative. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-slate-400">
            <span>One promise. One river. One collective responsibility.</span>
          </div>
        </div>

      </div>

      {/* Info Modal for Privacy / Terms */}
      {modalContent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-2xl relative">
            <h3 className="text-xl font-bold font-serif text-[#0c2f4d] mb-4">
              {modalContent.title}
            </h3>
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line max-h-96 overflow-y-auto pr-2">
              {modalContent.body}
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={() => setModalContent(null)}
                className="bg-[#0c2f4d] hover:bg-[#144272] text-white px-5 py-2 rounded-lg text-sm font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
