import React from 'react';
import { Award, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PLEDGE_CLAUSES } from '../lib/constants.ts';

interface ThePledgeSectionProps {
  onTakePledge: () => void;
}

export const ThePledgeSection: React.FC<ThePledgeSectionProps> = ({ onTakePledge }) => {
  return (
    <section id="the-pledge" className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Official Solemn Declaration
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#0c2f4d] tracking-tight mt-3">
            The Clean Yamuna Pledge
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Read the four core commitments made by thousands of citizens across India.
          </p>
        </div>

        {/* Ceremonial Card Preview */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-[#c5a059]/40 p-6 sm:p-10 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full pointer-events-none -z-0 opacity-50"></div>

          <div className="relative z-10 space-y-6">
            <div className="text-center border-b border-slate-100 pb-5">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c5a059]">
                Solemn Civic Oath
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#0c2f4d] mt-1">
                “I Stand Today As A Guardian Of Nature”
              </h3>
            </div>

            <p className="italic text-slate-700 text-sm sm:text-base font-serif leading-relaxed text-center max-w-3xl mx-auto">
              “I solemnly pledge to protect, honor, and restore the holy River Yamuna. The Yamuna is not merely water; she is our lifeline, a vibrant symbol of our deep cultural heritage, and revered with the sacred dignity of a Goddess.”
            </p>

            {/* Clauses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {PLEDGE_CLAUSES.map((clause, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    {idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-snug">
                    {clause}
                  </p>
                </div>
              ))}
            </div>

            {/* Slogan */}
            <div className="text-center pt-3">
              <div className="inline-block bg-[#0c2f4d] text-white px-6 py-2 rounded-full text-xs sm:text-sm font-bold tracking-widest uppercase shadow-sm">
                Clean Yamuna, Pure India.
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4 text-center">
              <button
                onClick={onTakePledge}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base transition inline-flex items-center gap-2 shadow-lg shadow-emerald-900/10 hover:scale-[1.02]"
              >
                <Award className="w-5 h-5 text-amber-300" />
                Read the Full Pledge & Make Your Commitment
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
