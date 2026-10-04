import React from 'react';
import { CertificateView } from './CertificateView.tsx';
import { Award, ArrowRight, ShieldCheck, Download, Sparkles } from 'lucide-react';

interface CertificatePreviewSectionProps {
  onTakePledge: () => void;
}

export const CertificatePreviewSection: React.FC<CertificatePreviewSectionProps> = ({ onTakePledge }) => {
  return (
    <section className="py-16 sm:py-24 bg-white border-t border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0c2f4d] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Official Recognition
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#0c2f4d] tracking-tight mt-3">
            Certificate of Commitment
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Upon taking the pledge, citizens receive an official, print-ready A4 landscape e-certificate with a verifiable QR code.
          </p>
        </div>

        {/* Certificate Display Container */}
        <div className="max-w-4xl mx-auto bg-slate-100/80 p-4 sm:p-8 rounded-3xl border border-slate-200 shadow-xl relative">
          <div className="overflow-x-auto pb-4">
            <CertificateView
              certificateId="YAMUNA-2026-000001"
              fullName="Aarav Sharma"
              city="New Delhi"
              state="Delhi"
              country="India"
              pledgeAcceptedAt={new Date().toISOString()}
              organization="Yamuna Environmental Guardian"
              id="preview-certificate-node"
            />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Includes cryptographic serial ID & live scanning QR verification</span>
            </div>

            <button
              onClick={onTakePledge}
              className="w-full sm:w-auto bg-[#0c2f4d] hover:bg-[#144272] text-white px-7 py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-md hover:scale-[1.02]"
            >
              <Award className="w-4 h-4 text-amber-300" />
              Take the Pledge & Get Yours
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
