import React, { useState } from 'react';
import { PledgeFormData, Pledge } from '../../types/index.ts';
import { OFFICIAL_PLEDGE_TEXT } from '../../lib/constants.ts';
import { ShieldCheck, ArrowLeft, Check, Sparkles, AlertCircle } from 'lucide-react';

interface PledgeStepAcceptProps {
  formData: PledgeFormData;
  onBack: () => void;
  onSuccess: (pledge: Pledge) => void;
  onViewExistingCertificate?: (certId: string) => void;
}

export const PledgeStepAccept: React.FC<PledgeStepAcceptProps> = ({
  formData,
  onBack,
  onSuccess,
  onViewExistingCertificate
}) => {
  const [accepted, setAccepted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [existingCertId, setExistingCertId] = useState<string | null>(null);

  const handleTakePledge = async () => {
    if (!accepted) return;
    setSubmitting(true);
    setErrorMsg('');
    setExistingCertId(null);

    try {
      const res = await fetch('/api/pledges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          pledgeAccepted: true
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409 && data.existingCertificateId) {
          setExistingCertId(data.existingCertificateId);
        }
        setErrorMsg(data.error || 'Failed to submit pledge. Please try again.');
        return;
      }

      onSuccess(data.pledge);
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMsg('An unexpected network error occurred while recording your pledge.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0c2f4d] via-[#144272] to-[#0c2f4d] px-6 py-6 text-white text-center">
        <span className="inline-block text-xs font-semibold text-emerald-300 tracking-widest uppercase mb-1">
          Step 2 of 2 • Solemn Declaration
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif tracking-wide">
          Official Yamuna Pledge
        </h2>
        <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto mt-1">
          Pledging as <span className="font-semibold text-amber-300">{formData.fullName}</span> from <span className="font-semibold text-amber-300">{formData.city}, {formData.state}</span>
        </p>
      </div>

      <div className="p-6 sm:p-10 space-y-8">
        
        {/* The Exact Official Pledge Card */}
        <div className="relative bg-[#fcfcf9] border-2 border-[#c5a059]/40 rounded-xl p-6 sm:p-8 shadow-sm">
          
          {/* Subtle Watermark Stamp */}
          <div className="absolute top-4 right-4 opacity-15 pointer-events-none">
            <ShieldCheck className="w-24 h-24 text-[#0c2f4d]" />
          </div>

          <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed font-serif text-sm sm:text-base space-y-4">
            <p className="italic font-medium text-slate-900 border-l-4 border-[#c5a059] pl-3 py-1">
              “I stand today as a proud citizen of India, a conscious human on Earth, and a guardian of nature.
            </p>

            <p>
              I solemnly pledge to protect, honor, and restore the holy River Yamuna. The Yamuna is not merely water; she is our lifeline, a vibrant symbol of our deep cultural heritage, and revered with the sacred dignity of a Goddess. To choke her with pollution is to dishonor our own civilization and the earth that sustains us.
            </p>

            <p className="font-sans font-semibold text-[#0c2f4d] pt-2 text-sm uppercase tracking-wide">
              From this moment onward, I commit to this lifelong duty:
            </p>

            <ul className="space-y-2 list-none pl-0 font-sans text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0"></span>
                <span>I will never litter plastic, garbage, toxic materials, or waste into the Yamuna or any waterway.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0"></span>
                <span>I will eliminate single-use plastics from my daily life and dispose of household waste responsibly.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0"></span>
                <span>I will preserve her sanctity during festivals, choosing only eco-friendly, green celebrations.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0"></span>
                <span>I will actively speak up, educate my community, and motivate others to defend her cleanliness.</span>
              </li>
            </ul>

            <p className="pt-2">
              The Yamuna gave us life; now, I will give her my protection.
            </p>

            <div className="py-2 text-center">
              <span className="inline-block bg-[#0c2f4d] text-[#FFD700] font-sans font-bold px-4 py-1.5 rounded text-sm sm:text-base tracking-widest uppercase">
                Clean Yamuna, Pure India.
              </span>
            </div>

            <p className="font-semibold text-slate-900 text-center italic">
              This is my sacred duty, this is my unwavering promise.”
            </p>
          </div>
        </div>

        {/* Error message if any */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">{errorMsg}</p>
              {existingCertId && onViewExistingCertificate && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => onViewExistingCertificate(existingCertId)}
                    className="text-xs font-semibold text-[#0c2f4d] underline hover:text-emerald-800"
                  >
                    View existing certificate ({existingCertId}) →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mandatory Checkbox */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
          <label className="flex items-start gap-3.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded text-[#0c2f4d] focus:ring-[#0c2f4d] border-slate-300 shrink-0 cursor-pointer"
            />
            <span className="text-sm sm:text-base text-slate-800 font-semibold leading-snug">
              I have read and understood the above pledge and solemnly commit to follow it.
            </span>
          </label>
        </div>

        {/* Controls */}
        <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            disabled={submitting}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Edit My Details
          </button>

          <button
            type="button"
            onClick={handleTakePledge}
            disabled={!accepted || submitting}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-lg text-sm sm:text-base font-bold transition flex items-center justify-center gap-2 shadow-lg ${
              accepted && !submitting
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer hover:shadow-emerald-900/20 hover:scale-[1.01]'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
            }`}
          >
            {submitting ? (
              <>
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
                Recording Your Pledge...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                I Take the Pledge
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
