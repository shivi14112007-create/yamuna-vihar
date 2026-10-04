import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { generateQrCodeDataUrl } from '../lib/certificateGenerator.ts';
import { ShieldCheck, Award } from 'lucide-react';

interface CertificateProps {
  certificateId: string;
  fullName: string;
  city: string;
  state: string;
  country?: string;
  pledgeAcceptedAt: string;
  organization?: string;
  id?: string;
}

// The certificate is ALWAYS laid out at this fixed size (A4 landscape ratio).
// On small screens it is only visually scaled down, so downloads are identical on every device.
const CERT_W = 1000;
const CERT_H = 707;

export const CertificateView: React.FC<CertificateProps> = ({
  certificateId,
  fullName,
  city,
  state,
  country = 'India',
  pledgeAcceptedAt,
  organization,
  id = 'certificate-node'
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const verificationUrl = `${origin}/verify/${encodeURIComponent(certificateId)}`;
    generateQrCodeDataUrl(verificationUrl).then(url => {
      if (url) setQrCodeUrl(url);
    });
  }, [certificateId]);

  // Scale to fit the available width
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / CERT_W));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const formattedDate = new Date(pledgeAcceptedAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div ref={wrapRef} style={{ width: '100%', maxWidth: CERT_W, margin: '0 auto' }}>
      {/* Sizer: takes the scaled height so the page layout is correct */}
      <div style={{ position: 'relative', width: '100%', height: CERT_H * scale }}>
        {/* Scaler: the transform lives on the PARENT of the captured node */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: CERT_W,
            height: CERT_H,
            transform: `scale(${scale})`,
            transformOrigin: 'top left'
          }}
        >
          {/* Captured node: fixed size, no responsive classes */}
          <div
            id={id}
            className="relative overflow-hidden shadow-2xl rounded-sm"
            style={{
              width: CERT_W,
              height: CERT_H,
              backgroundColor: '#fdfdfb',
              color: '#0f172a',
              fontFamily: "'Cinzel', 'Plus Jakarta Sans', Georgia, serif"
            }}
          >
            {/* Tricolor Top Bar */}
            <div className="absolute top-0 left-0 right-0 h-2 flex z-20">
              <div className="h-full w-1/3" style={{ backgroundColor: '#FF9933' }}></div>
              <div className="h-full w-1/3" style={{ backgroundColor: '#ffffff' }}></div>
              <div className="h-full w-1/3" style={{ backgroundColor: '#138808' }}></div>
            </div>

            {/* Outer Border */}
            <div className="absolute inset-3 pointer-events-none z-10" style={{ border: '3px solid #0c2f4d' }}>
              <div className="absolute inset-1.5 pointer-events-none" style={{ border: '1px solid #c5a059' }}></div>
            </div>

            {/* Corner Ornaments */}
            <div className="absolute top-4 left-4 w-12 h-12 z-10 pointer-events-none" style={{ borderTop: '2px solid #c5a059', borderLeft: '2px solid #c5a059' }}></div>
            <div className="absolute top-4 right-4 w-12 h-12 z-10 pointer-events-none" style={{ borderTop: '2px solid #c5a059', borderRight: '2px solid #c5a059' }}></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 z-10 pointer-events-none" style={{ borderBottom: '2px solid #c5a059', borderLeft: '2px solid #c5a059' }}></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 z-10 pointer-events-none" style={{ borderBottom: '2px solid #c5a059', borderRight: '2px solid #c5a059' }}></div>

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ opacity: 0.04 }}>
              <svg viewBox="0 0 400 400" width={500} height={500} style={{ color: '#0a2540' }} fill="currentColor">
                <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="8" />
                <circle cx="200" cy="200" r="160" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
                <path d="M120,200 C150,150 250,150 280,200 C250,250 150,250 120,200 Z" fill="none" stroke="currentColor" strokeWidth="6" />
                <circle cx="200" cy="200" r="28" fill="currentColor" />
                <path d="M200,60 L200,100 M200,300 L200,340 M60,200 L100,200 M300,200 L340,200" stroke="currentColor" strokeWidth="5" />
              </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between p-12 text-center">
              {/* Header */}
              <div className="pt-2">
                <div className="flex items-center justify-center space-x-2 mb-1" style={{ color: '#0c2f4d' }}>
                  <div className="h-[1px] w-12" style={{ backgroundColor: '#c5a059' }}></div>
                  <span className="text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: '#065f46' }}>
                    National Environmental & Civic Registry
                  </span>
                  <div className="h-[1px] w-12" style={{ backgroundColor: '#c5a059' }}></div>
                </div>

                <h1 className="text-4xl font-extrabold tracking-[0.18em] uppercase" style={{ color: '#0a2540' }}>
                  CLEAN YAMUNA PLEDGE
                </h1>

                <div className="inline-flex items-center gap-3 mt-1">
                  <div className="h-[1px] w-8" style={{ backgroundColor: '#c5a059' }}></div>
                  <p className="text-sm font-semibold tracking-[0.2em] uppercase" style={{ color: '#b4833e' }}>
                    Certificate of Commitment
                  </p>
                  <div className="h-[1px] w-8" style={{ backgroundColor: '#c5a059' }}></div>
                </div>
              </div>

              {/* Body */}
              <div className="my-auto py-2">
                <p className="text-sm font-sans tracking-wide italic" style={{ color: '#475569' }}>
                  This certificate is proudly presented to
                </p>

                <div className="my-3">
                  <h2
                    className="text-4xl font-bold tracking-wide capitalize font-serif pb-1 inline-block px-6"
                    style={{ color: '#0c2f4d', borderBottom: '2px solid rgba(197, 160, 89, 0.6)' }}
                  >
                    {fullName}
                  </h2>
                  {organization && (
                    <p className="text-xs font-sans mt-1" style={{ color: '#64748b' }}>
                      Representing <span className="font-semibold" style={{ color: '#334155' }}>{organization}</span>
                    </p>
                  )}
                </div>

                <div className="max-w-2xl mx-auto px-4">
                  <p className="text-sm font-sans leading-relaxed" style={{ color: '#334155' }}>
                    for solemnly taking the pledge to protect, honor, and restore the River Yamuna and committing to responsible, sustainable, and environmentally conscious actions.
                  </p>
                </div>

                <div className="mt-3">
                  <span
                    className="inline-block px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase"
                    style={{
                      backgroundColor: 'rgba(12, 47, 77, 0.05)',
                      border: '1px solid rgba(197, 160, 89, 0.5)',
                      color: '#0c2f4d'
                    }}
                  >
                    Clean Yamuna, Pure India
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div
                className="pt-2 grid grid-cols-3 items-end gap-2 text-left"
                style={{ borderTop: '1px solid rgba(226, 232, 240, 0.9)' }}
              >
                {/* Left: QR + meta */}
                <div className="flex items-center space-x-3">
                  {qrCodeUrl ? (
                    <div className="p-1 rounded shadow-sm shrink-0" style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1' }}>
                      <img src={qrCodeUrl} alt="Certificate QR Code" width={64} height={64} style={{ width: 64, height: 64 }} />
                    </div>
                  ) : (
                    <div
                      className="w-16 h-16 rounded flex items-center justify-center text-[10px]"
                      style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', color: '#94a3b8' }}
                    >
                      QR
                    </div>
                  )}
                  <div className="text-[11px] font-sans leading-tight" style={{ color: '#475569' }}>
                    <div className="font-semibold font-mono tracking-wider" style={{ color: '#0c2f4d' }}>
                      {certificateId}
                    </div>
                    <div className="mt-0.5" style={{ color: '#64748b' }}>
                      Date: <span className="font-medium" style={{ color: '#334155' }}>{formattedDate}</span>
                    </div>
                    <div className="truncate max-w-[180px]" style={{ color: '#64748b' }}>
                      {city}, {state}, {country}
                    </div>
                    <div className="font-medium flex items-center gap-0.5 mt-0.5" style={{ color: '#047857' }}>
                      <ShieldCheck className="w-3 h-3 inline" style={{ color: '#059669' }} /> Status: Valid
                    </div>
                  </div>
                </div>

                {/* Center: Seal (static: no animation, so the capture is never mid-rotation) */}
                <div className="text-center flex flex-col items-center justify-center">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full" style={{ border: '2px dashed #c5a059' }}></div>
                    <div
                      className="w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-md"
                      style={{
                        background: 'linear-gradient(135deg, #0c2f4d, #144272)',
                        border: '2px solid #c5a059',
                        color: '#ffffff'
                      }}
                    >
                      <Award className="w-7 h-7" style={{ color: '#FFD700' }} />
                      <span className="text-[7px] font-bold tracking-widest uppercase mt-0.5" style={{ color: '#FFD700' }}>
                        OFFICIAL
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] font-sans font-semibold tracking-wider uppercase mt-1" style={{ color: '#64748b' }}>
                    Verified Digital Record
                  </span>
                </div>

                {/* Right: Signature */}
                <div className="text-right flex flex-col items-end">
                  <div className="w-44 text-center">
                    <div
                      className="font-serif italic text-xl tracking-wider font-semibold opacity-90 select-none pb-0.5"
                      style={{ color: '#0c2f4d' }}
                    >
                      Clean Yamuna
                    </div>
                    <div className="h-[1px] w-full mb-1" style={{ backgroundColor: 'rgba(12, 47, 77, 0.4)' }}></div>
                    <p className="text-xs font-bold tracking-wider uppercase font-sans" style={{ color: '#0c2f4d' }}>
                      Clean Yamuna Initiative
                    </p>
                    <p className="text-[9px] font-sans" style={{ color: '#64748b' }}>
                      National Environmental Registry
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
