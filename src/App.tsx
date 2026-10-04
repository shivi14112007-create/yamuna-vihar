import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { Hero } from './components/Hero.tsx';
import { WhyYamuna } from './components/WhyYamuna.tsx';
import { HowItWorks } from './components/HowItWorks.tsx';
import { ThePledgeSection } from './components/ThePledgeSection.tsx';
import { CollectiveCommitment } from './components/CollectiveCommitment.tsx';
import { CertificatePreviewSection } from './components/CertificatePreviewSection.tsx';
import { PledgeStepForm } from './components/PledgeFlow/PledgeStepForm.tsx';
import { PledgeStepAccept } from './components/PledgeFlow/PledgeStepAccept.tsx';
import { PledgeStepSuccess } from './components/PledgeFlow/PledgeStepSuccess.tsx';
import { VerifyCertificate } from './components/VerifyCertificate.tsx';
import { AdminLogin } from './components/Admin/AdminLogin.tsx';
import { AdminDashboard } from './components/Admin/AdminDashboard.tsx';
import { CertificateView } from './components/CertificateView.tsx';
import { downloadCertificatePdf, downloadCertificateImage } from './lib/certificateGenerator.ts';
import { ImpactStats, Pledge, PledgeFormData } from './types/index.ts';
import { ArrowLeft, Download } from 'lucide-react';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'take-pledge' | 'verify' | 'admin' | 'view-cert'>('home');
  const [routeParam, setRouteParam] = useState<string>('');

  // Impact Statistics
  const [stats, setStats] = useState<ImpactStats>({
    totalPledges: 0,
    certificatesGenerated: 0,
    todayPledges: 0,
    uniqueCities: 0,
    uniqueStates: 0
  });

  // Pledge Flow State
  const [pledgeStep, setPledgeStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<PledgeFormData>({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    country: 'India',
    organization: ''
  });
  const [completedPledge, setCompletedPledge] = useState<Pledge | null>(null);

  // Dedicated Certificate Viewer State
  const [viewingCertData, setViewingCertData] = useState<Pledge | null>(null);
  const [loadingCert, setLoadingCert] = useState<boolean>(false);

  // Admin Auth State
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('yamuna_admin_token') || null;
  });
  const [adminUser, setAdminUser] = useState<{ id: string; email: string; name: string } | null>(() => {
    const cached = localStorage.getItem('yamuna_admin_user');
    return cached ? JSON.parse(cached) : null;
  });

  // Load Public Impact Stats
  const loadStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error('Failed to load stats:', e);
    }
  };

  // URL Path Routing Sync
  useEffect(() => {
    loadStats();

    const handleRouteFromUrl = () => {
      const path = window.location.pathname;
      if (path.startsWith('/verify/')) {
        const certId = decodeURIComponent(path.replace('/verify/', ''));
        setCurrentView('verify');
        setRouteParam(certId);
      } else if (path === '/verify') {
        setCurrentView('verify');
        setRouteParam('');
      } else if (path === '/admin' || path === '/admin/login' || path === '/admin/dashboard') {
        setCurrentView('admin');
      } else if (path.startsWith('/certificate/')) {
        const certId = decodeURIComponent(path.replace('/certificate/', ''));
        fetchAndShowCertificate(certId);
      } else if (path === '/pledge') {
        setCurrentView('take-pledge');
      } else {
        setCurrentView('home');
      }
    };

    handleRouteFromUrl();
    window.addEventListener('popstate', handleRouteFromUrl);
    return () => window.removeEventListener('popstate', handleRouteFromUrl);
  }, []);

  const navigateTo = (view: string, param = '') => {
    let url = '/';
    if (view === 'take-pledge') {
      url = '/pledge';
      setCurrentView('take-pledge');
      setPledgeStep(1);
    } else if (view === 'verify') {
      url = param ? `/verify/${encodeURIComponent(param)}` : '/verify';
      setCurrentView('verify');
      setRouteParam(param);
    } else if (view === 'admin') {
      url = '/admin';
      setCurrentView('admin');
    } else if (view === 'view-cert') {
      url = `/certificate/${encodeURIComponent(param)}`;
      setCurrentView('view-cert');
      fetchAndShowCertificate(param);
    } else {
      url = '/';
      setCurrentView('home');
    }

    if (window.location.pathname !== url) {
      window.history.pushState({}, '', url);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchAndShowCertificate = async (certificateId: string) => {
    try {
      setLoadingCert(true);
      setCurrentView('view-cert');
      const res = await fetch(`/api/pledges/certificate/${encodeURIComponent(certificateId)}`);
      if (res.ok) {
        const data = await res.json();
        setViewingCertData(data);
      } else {
        setViewingCertData(null);
      }
    } catch (err) {
      console.error('Failed to fetch certificate:', err);
    } finally {
      setLoadingCert(false);
    }
  };

  const handleAdminLoginSuccess = (token: string, admin: { id: string; email: string; name: string }) => {
    setAdminToken(token);
    setAdminUser(admin);
    localStorage.setItem('yamuna_admin_token', token);
    localStorage.setItem('yamuna_admin_user', JSON.stringify(admin));
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('yamuna_admin_token');
    localStorage.removeItem('yamuna_admin_user');
    navigateTo('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-[#0c2f4d] selection:text-white">
      
      {/* Navbar (hidden in dedicated full-screen certificate view) */}
      {currentView !== 'view-cert' && (
        <Navbar
          currentView={currentView}
          onNavigate={(v, p) => navigateTo(v, p)}
          isAdminLoggedIn={!!adminToken}
        />
      )}

      {/* Main Content Areas */}
      <main className="flex-1">
        
        {/* VIEW 1: HOME LANDING PAGE */}
        {currentView === 'home' && (
          <div>
            <Hero
              stats={stats}
              onTakePledge={() => navigateTo('take-pledge')}
              onVerifyCertificate={() => navigateTo('verify')}
            />
            <WhyYamuna />
            <ThePledgeSection onTakePledge={() => navigateTo('take-pledge')} />
            <CollectiveCommitment
              stats={stats}
              onTakePledge={() => navigateTo('take-pledge')}
            />
            <HowItWorks />
            <CertificatePreviewSection onTakePledge={() => navigateTo('take-pledge')} />
          </div>
        )}

        {/* VIEW 2: 3-STEP PLEDGE FLOW */}
        {currentView === 'take-pledge' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
            
            {/* Step Progress Bar (when not in success view) */}
            {pledgeStep !== 3 && (
              <div className="mb-8">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  <span className={pledgeStep === 1 ? 'text-[#0c2f4d] font-bold' : ''}>
                    1. Enter Details
                  </span>
                  <span className={pledgeStep === 2 ? 'text-[#0c2f4d] font-bold' : ''}>
                    2. Accept Pledge
                  </span>
                  <span>3. Receive Certificate</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0c2f4d] h-full transition-all duration-300"
                    style={{ width: pledgeStep === 1 ? '50%' : '100%' }}
                  ></div>
                </div>
              </div>
            )}

            {/* Step 1: Form */}
            {pledgeStep === 1 && (
              <PledgeStepForm
                initialData={formData}
                onSubmit={(data) => {
                  setFormData(data);
                  setPledgeStep(2);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onCancel={() => navigateTo('home')}
              />
            )}

            {/* Step 2: Accept */}
            {pledgeStep === 2 && (
              <PledgeStepAccept
                formData={formData}
                onBack={() => setPledgeStep(1)}
                onSuccess={(pledge) => {
                  setCompletedPledge(pledge);
                  setPledgeStep(3);
                  loadStats();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onViewExistingCertificate={(certId) => navigateTo('verify', certId)}
              />
            )}

            {/* Step 3: Success & Certificate */}
            {pledgeStep === 3 && completedPledge && (
              <PledgeStepSuccess
                pledge={completedPledge}
                onTakeAnother={() => {
                  setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    city: '',
                    state: '',
                    country: 'India',
                    organization: ''
                  });
                  setCompletedPledge(null);
                  setPledgeStep(1);
                }}
                onVerifyCertificate={(certId) => navigateTo('verify', certId)}
                onViewFullScreen={() => navigateTo('view-cert', completedPledge.certificateId)}
              />
            )}

          </div>
        )}

        {/* VIEW 3: VERIFY CERTIFICATE */}
        {currentView === 'verify' && (
          <VerifyCertificate
            initialCertificateId={routeParam}
            onNavigateHome={() => navigateTo('home')}
            onNavigateTakePledge={() => navigateTo('take-pledge')}
            onViewCertificate={(certId) => navigateTo('view-cert', certId)}
          />
        )}

        {/* VIEW 4: ADMIN PORTAL */}
        {currentView === 'admin' && (
          <div>
            {adminToken ? (
              <AdminDashboard
                token={adminToken}
                adminName={adminUser?.name || 'Administrator'}
                onLogout={handleAdminLogout}
                onNavigateHome={() => navigateTo('home')}
              />
            ) : (
              <AdminLogin
                onSuccess={(token, admin) => {
                  handleAdminLoginSuccess(token, admin);
                }}
                onNavigateHome={() => navigateTo('home')}
              />
            )}
          </div>
        )}

        {/* VIEW 5: DEDICATED FULL-SCREEN CERTIFICATE VIEWER */}
        {currentView === 'view-cert' && (
          <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-4 sm:p-8">
            
            {/* Top Toolbar */}
            <div className="max-w-5xl mx-auto w-full flex flex-wrap gap-3 items-center justify-between pb-6 border-b border-slate-800">
              <button
                onClick={() => navigateTo('home')}
                className="text-slate-300 hover:text-white flex items-center gap-2 text-sm transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Yamuna Pledge
              </button>
              
              <div className="flex flex-wrap items-center gap-3">
                {viewingCertData && (
                  <>
                    <button
                      onClick={() =>
                        downloadCertificatePdf(
                          'fullscreen-certificate-node',
                          viewingCertData.certificateId,
                          viewingCertData.fullName
                        )
                      }
                      className="bg-[#0c2f4d] hover:bg-[#144272] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                    <button
                      onClick={() =>
                        downloadCertificateImage(
                          'fullscreen-certificate-node',
                          viewingCertData.certificateId,
                          viewingCertData.fullName
                        )
                      }
                      className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Download className="w-4 h-4" />
                      Save Image
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Certificate Render */}
            <div className="flex-1 flex items-center justify-center py-8">
              {loadingCert ? (
                <div className="text-center text-slate-400">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p>Loading Official Certificate...</p>
                </div>
              ) : viewingCertData ? (
                <div className="w-full max-w-4xl shadow-2xl">
                  <CertificateView
                    certificateId={viewingCertData.certificateId}
                    fullName={viewingCertData.fullName}
                    city={viewingCertData.city}
                    state={viewingCertData.state}
                    country={viewingCertData.country}
                    pledgeAcceptedAt={viewingCertData.pledgeAcceptedAt}
                    organization={viewingCertData.organization}
                    id="fullscreen-certificate-node"
                  />
                </div>
              ) : (
                <div className="text-center text-slate-400 max-w-md">
                  <h3 className="text-lg font-bold text-white mb-2">Certificate Not Found</h3>
                  <p className="text-xs mb-4">
                    The requested certificate could not be retrieved from the registry.
                  </p>
                  <button
                    onClick={() => navigateTo('home')}
                    className="bg-[#0c2f4d] text-white px-4 py-2 rounded-lg text-xs font-semibold"
                  >
                    Go to Homepage
                  </button>
                </div>
              )}
            </div>

            {/* Footer Notice */}
            <div className="max-w-5xl mx-auto w-full text-center text-xs text-slate-500 pt-4 border-t border-slate-800">
              Clean Yamuna Initiative • National Environmental Citizen Registry • Verifiable E-Certificate
            </div>
          </div>
        )}

      </main>

      {/* Footer (hidden in dedicated certificate viewer) */}
      {currentView !== 'view-cert' && (
        <Footer onNavigate={(v, p) => navigateTo(v, p)} />
      )}

    </div>
  );
}
