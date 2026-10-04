import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Pledge } from '../../types/index.ts';
import { CertificateView } from '../CertificateView.tsx';
import { downloadCertificatePdf, downloadCertificateImage } from '../../lib/certificateGenerator.ts';
import {
  CheckCircle,
  Download,
  Share2,
  ExternalLink,
  RotateCcw,
  Maximize2,
  Copy,
  Check,
  FileText
} from 'lucide-react';

interface PledgeStepSuccessProps {
  pledge: Pledge;
  onTakeAnother: () => void;
  onVerifyCertificate: (certId: string) => void;
  onViewFullScreen?: () => void;
}

export const PledgeStepSuccess: React.FC<PledgeStepSuccessProps> = ({
  pledge,
  onTakeAnother,
  onVerifyCertificate,
  onViewFullScreen
}) => {
  const [downloadingPdf, setDownloadingPdf] = useState<boolean>(false);
  const [downloadingPng, setDownloadingPng] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0c2f4d', '#138808', '#FF9933', '#c5a059', '#38bdf8']
      });
    } catch (e) {
      // ignore
    }
  }, []);

  const handleDownloadPdf = async () => {
    try {
      setDownloadingPdf(true);
      await downloadCertificatePdf('certificate-node', pledge.certificateId, pledge.fullName);
    } catch (err) {
      console.error('PDF download error:', err);
      alert('Could not download PDF automatically. You can print this page or download as PNG.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadPng = async () => {
    try {
      setDownloadingPng(true);
      await downloadCertificateImage('certificate-node', pledge.certificateId, pledge.fullName);
    } catch (err) {
      console.error('PNG download error:', err);
    } finally {
      setDownloadingPng(false);
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(pledge.certificateId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Success Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-lg border border-slate-200 text-center relative overflow-hidden">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c2f4d] tracking-tight">
          Your Pledge Has Been Recorded.
        </h1>
        <p className="text-base sm:text-lg text-slate-700 font-medium mt-1">
          Thank you for standing with the Yamuna.
        </p>

        {/* Certificate ID Pill */}
        <div className="mt-4 inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 transition border border-slate-300 rounded-full px-4 py-1.5 text-sm font-mono text-[#0c2f4d]">
          <span className="text-slate-500 font-sans text-xs uppercase tracking-wider font-semibold">
            Certificate ID:
          </span>
          <span className="font-bold tracking-wider">{pledge.certificateId}</span>
          <button
            onClick={handleCopyId}
            title="Copy Certificate ID"
            className="text-slate-500 hover:text-slate-800 transition p-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <p className="mt-4 text-xs sm:text-sm text-slate-500 italic max-w-md mx-auto">
          “One promise. One river. One collective responsibility.”
        </p>

        {/* Action Buttons Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="bg-[#0c2f4d] hover:bg-[#144272] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow hover:shadow-md disabled:opacity-60"
          >
            <Download className="w-4 h-4" />
            {downloadingPdf ? 'Generating PDF...' : 'Download Certificate (PDF)'}
          </button>

          <button
            onClick={handleDownloadPng}
            disabled={downloadingPng}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow hover:shadow-md disabled:opacity-60"
          >
            <FileText className="w-4 h-4" />
            {downloadingPng ? 'Saving Image...' : 'Download Image (PNG)'}
          </button>

          <button
            onClick={() => onVerifyCertificate(pledge.certificateId)}
            className="border border-[#0c2f4d] text-[#0c2f4d] hover:bg-blue-50 px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4" />
            Verify Certificate
          </button>

          <button
            onClick={onTakeAnother}
            className="text-slate-600 hover:text-slate-900 border border-slate-300 hover:bg-slate-50 px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            Take Another Pledge
          </button>
        </div>
      </div>

      {/* Certificate Viewer Preview */}
      <div className="bg-slate-100/90 rounded-2xl p-4 sm:p-8 border border-slate-300 shadow-inner">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Official E-Certificate Preview (Printable A4 Landscape)
          </span>
          <div className="flex items-center gap-2">
            {onViewFullScreen && (
              <button
                onClick={onViewFullScreen}
                className="text-xs font-medium text-slate-700 hover:text-[#0c2f4d] bg-white px-3 py-1 rounded border border-slate-300 flex items-center gap-1 shadow-sm transition"
              >
                <Maximize2 className="w-3.5 h-3.5" /> Fullscreen View
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto pb-4">
          <CertificateView
            certificateId={pledge.certificateId}
            fullName={pledge.fullName}
            city={pledge.city}
            state={pledge.state}
            country={pledge.country}
            pledgeAcceptedAt={pledge.pledgeAcceptedAt}
            organization={pledge.organization}
            id="certificate-node"
          />
        </div>
      </div>

    </div>
  );
};
