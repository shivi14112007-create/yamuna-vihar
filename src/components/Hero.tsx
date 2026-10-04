import React from 'react';
import { Award, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { ImpactStats } from '../types/index.ts';

// Import generated realistic river imagery
import yamunaImage from '../assets/images/yamuna_river_clean_1791121189091.jpg';

interface HeroProps {
  stats: ImpactStats;
  onTakePledge: () => void;
  onVerifyCertificate: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  stats,
  onTakePledge,
  onVerifyCertificate
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/60 via-white to-slate-50 pt-8 pb-16 lg:pt-14 lg:pb-24">
      
      {/* Background Decorative River Wave SVG */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
        <svg className="w-full h-full" viewBox="0 0 1440 600" fill="none" preserveAspectRatio="none">
          <path
            d="M0,192L48,208C96,224,192,256,288,245.3C384,235,480,181,576,170.7C672,160,768,192,864,213.3C960,235,1056,245,1152,229.3C1248,213,1344,171,1392,149.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            fill="url(#riverGradient)"
          />
          <defs>
            <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* National Registry Tag */}
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-800 tracking-wide shadow-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span>Official Citizen Registry for Environmental Protection</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-serif text-[#0c2f4d] tracking-tight leading-[1.12]">
              Protect the Yamuna. <br className="hidden sm:inline" />
              <span className="text-sky-800">Protect Our Future.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Take a pledge to protect, honor, and restore the holy River Yamuna. Receive your verified, personalized digital e-certificate and stand as a guardian of nature.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onTakePledge}
                className="w-full sm:w-auto bg-[#0c2f4d] hover:bg-[#144272] text-white px-8 py-4 rounded-xl text-base font-bold transition flex items-center justify-center gap-2.5 shadow-lg shadow-[#0c2f4d]/20 hover:scale-[1.02] active:scale-[0.99]"
              >
                <Award className="w-5 h-5 text-amber-300" />
                Take the Pledge
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={onVerifyCertificate}
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 hover:text-[#0c2f4d] px-6 py-4 rounded-xl text-base font-semibold transition border border-slate-300 shadow-sm flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Verify a Certificate
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="pt-4 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto lg:mx-0 border-t border-slate-200/80">
              <div className="text-left">
                <span className="block text-xl sm:text-2xl font-black text-[#0c2f4d] font-mono">
                  {stats.totalPledges}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  Citizens Pledged
                </span>
              </div>
              <div className="text-left">
                <span className="block text-xl sm:text-2xl font-black text-emerald-700 font-mono">
                  {stats.certificatesGenerated}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  Certificates Generated
                </span>
              </div>
              <div className="text-left">
                <span className="block text-xl sm:text-2xl font-black text-sky-700 font-mono">
                  {stats.uniqueCities}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  Cities Represented
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5 relative">
            
            {/* Background Glow */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-sky-400/20 to-emerald-400/20 rounded-3xl blur-2xl opacity-70"></div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
              <img
                src={yamunaImage}
                alt="Sacred and Clean River Yamuna at Sunrise"
                className="w-full h-80 sm:h-96 lg:h-[460px] object-cover group-hover:scale-105 transition duration-700 ease-out"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#081c2c]/90 via-[#081c2c]/30 to-transparent"></div>

              {/* Overlay Badge */}
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Sacred Duty & Civic Promise
                  </div>
                  <h3 className="text-base font-serif font-bold text-white leading-snug">
                    “The Yamuna gave us life; now, I will give her my protection.”
                  </h3>
                  <p className="text-[11px] text-slate-200 mt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
                    Instant downloadable e-certificate with unique verification QR code
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

    </section>
  );
};
