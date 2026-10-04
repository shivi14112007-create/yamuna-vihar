import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertCircle, Search, ArrowRight, Award, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { PublicVerificationResult } from '../types/index.ts';

interface VerifyCertificateProps {
  initialCertificateId?: string;
  onNavigateHome: () => void;
  onNavigateTakePledge: () => void;
  onViewCertificate?: (certificateId: string) => void;
}

export const VerifyCertificate: React.FC<VerifyCertificateProps> = ({
  initialCertificateId = '',
  onNavigateHome,
  onNavigateTakePledge,
  onViewCertificate
}) => {
  const [certInput, setCertInput] = useState<string>(initialCertificateId);
  const [loading, setLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);
  const [result, setResult] = useState<PublicVerificationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const performVerification = async (idToVerify: string) => {
    const cleanId = idToVerify.trim().toUpperCase();
    if (!cleanId) {
      setErrorMsg('Please enter a Certificate ID (e.g. YAMUNA-2026-000001)');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSearched(true);

    try {
      const res = await fetch(`/api/verify/${encodeURIComponent(cleanId)}`);
      const data = await res.json();
      if (res.ok && data.found) {
        setResult(data);
      } else {
        setResult({ found: false });
      }
    } catch (err) {
      setErrorMsg('Failed to communicate with verification server. Please try again.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCertificateId) {
      setCertInput(initialCertificateId);
      performVerification(initialCertificateId);
    }
  }, [initialCertificateId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performVerification(certInput);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <button
            onClick={onNavigateHome}
            className="text-sm font-medium text-slate-600 hover:text-[#0c2f4d] flex items-center gap-1 transition"
          >
            ← Back to Clean Yamuna Initiative
          </button>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Public Verification Portal
          </span>
        </div>

        {/* Page Title */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-blue-50 text-[#0c2f4d] mb-3">
            <Award className="w-8 h-8 text-[#0c2f4d]" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#0c2f4d] tracking-tight">
            Verify Clean Yamuna Pledge Certificate
          </h1>
          <p className="mt-2 text-slate-600 max-w-xl mx-auto text-sm">
            Enter the unique Certificate ID printed on the e-certificate to confirm authenticity and active registry status.
          </p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="flex flex-col sm:flex-row gap-2 shadow-sm rounded-xl bg-white p-2 border border-slate-300 focus-within:border-[#0c2f4d] focus-within:ring-2 focus-within:ring-[#0c2f4d]/20 transition">
            <div className="relative flex-1 flex items-center pl-3">
              <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value.toUpperCase())}
                placeholder="e.g. YAMUNA-2026-000001"
                className="w-full bg-transparent py-2.5 px-2 text-slate-900 font-mono text-sm tracking-wider uppercase focus:outline-none placeholder:font-sans placeholder:normal-case placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#0c2f4d] hover:bg-[#144272] text-white px-6 py-3 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Certificate'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {errorMsg && (
            <p className="mt-2 text-xs text-rose-600 font-medium pl-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 inline" /> {errorMsg}
            </p>
          )}
        </form>

        {/* Verification Result Card */}
        {searched && !loading && (
          <div>
            {result && result.found ? (
              <div className="bg-white border-2 border-emerald-500 rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
                
                {/* Status Bar */}
                <div className="bg-emerald-600 text-white px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                    <div>
                      <h2 className="text-lg font-bold tracking-wide">Certificate Verified ✓</h2>
                      <p className="text-xs text-emerald-100">Official commitment recorded in national registry</p>
                    </div>
                  </div>
                  <span className="bg-white/20 text-white font-mono text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                    Status: {result.status === 'valid' ? 'Valid' : result.status}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="p-6 sm:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Certificate ID</p>
                      <p className="text-lg font-bold text-[#0c2f4d] font-mono mt-0.5">{result.certificateId}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Citizen Name</p>
                      <p className="text-lg font-bold text-slate-800 font-serif mt-0.5">{result.fullName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Location</p>
                      <p className="text-sm font-semibold text-slate-700 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {result.city}, {result.state}, {result.country || 'India'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Date of Pledge</p>
                      <p className="text-sm font-semibold text-slate-700 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {result.pledgeAcceptedAt
                          ? new Date(result.pledgeAcceptedAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })
                          : 'Recorded'}
                      </p>
                    </div>
                  </div>

                  {result.organization && (
                    <div className="mt-4 pt-2">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Organization / Institution</p>
                      <p className="text-sm font-medium text-slate-700 mt-0.5">{result.organization}</p>
                    </div>
                  )}

                  {/* Security Note */}
                  <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-start space-x-3 text-xs text-slate-600">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800">Tamper-Proof Verification Notice:</span>
                      <p className="mt-0.5">
                        This digital record is permanently verified by the Clean Yamuna Initiative. To protect citizen privacy, private contact coordinates (email and phone number) are never exposed through this public lookup.
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-wrap items-center gap-3 pt-4">
                    {onViewCertificate && result.certificateId && (
                      <button
                        onClick={() => onViewCertificate(result.certificateId!)}
                        className="bg-[#0c2f4d] hover:bg-[#144272] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
                      >
                        View Official E-Certificate
                      </button>
                    )}
                    <button
                      onClick={onNavigateTakePledge}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
                    >
                      Take the Yamuna Pledge Yourself
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white border-2 border-rose-200 rounded-2xl p-8 text-center shadow-lg animate-fadeIn">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-600">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Certificate Not Found</h2>
                <p className="mt-2 text-slate-600 text-sm max-w-md mx-auto">
                  No registered pledge corresponds to Certificate ID: <span className="font-mono font-bold text-rose-700">{certInput}</span>. Please verify the ID for typographical errors.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={() => setCertInput('')}
                    className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Clear Search
                  </button>
                  <button
                    onClick={onNavigateTakePledge}
                    className="bg-[#0c2f4d] hover:bg-[#144272] text-white px-5 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Take the Yamuna Pledge
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
