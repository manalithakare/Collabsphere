import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ToastProvider, useToast } from './context/ToastContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { AuthModal } from './pages/AuthModal.jsx';

// Pages
import { LandingPage } from './pages/LandingPage.jsx';
import { BrandDashboard } from './pages/BrandDashboard.jsx';
import { CampaignManagement } from './pages/CampaignManagement.jsx';
import { InfluencerDiscovery } from './pages/InfluencerDiscovery.jsx';
import { BrandCollaborationsPage } from './pages/BrandCollaborationsPage.jsx';
import { InfluencerDashboard } from './pages/InfluencerDashboard.jsx';
import { InfluencerCollaborationsPage } from './pages/InfluencerCollaborationsPage.jsx';
import { InfluencerProfileEdit } from './pages/InfluencerProfileEdit.jsx';
import { PaymentTrackingPage } from './pages/PaymentTrackingPage.jsx';
import { AIContentIdeasPage } from './pages/AIContentIdeasPage.jsx';

function AppContent() {
  const { user, isAuthenticated, isLoading }: any = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [authModalMode, setAuthModalMode] = useState<string | null>(null); // 'login' | 'register' | null
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [preselectedCampaignForDiscovery, setPreselectedCampaignForDiscovery] = useState<string | null>(null);

  // Sync navigation on login/logout
  useEffect(() => {
    if (isAuthenticated) {
      if (currentPage === 'landing') {
        setCurrentPage('dashboard');
      }
    } else {
      if (currentPage !== 'discovery') {
        setCurrentPage('landing');
      }
    }
  }, [isAuthenticated]);

  function handleNavigate(page: string, extraData: any = null) {
    if (extraData?.campaignId) {
      setPreselectedCampaignForDiscovery(extraData.campaignId);
    } else {
      setPreselectedCampaignForDiscovery(null);
    }
    setCurrentPage(page);
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute w-96 h-96 bg-pink-600/15 rounded-full blur-[140px] pointer-events-none translate-x-20" />
        <div className="relative flex flex-col items-center gap-4">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-pink-500 border-r-purple-500 animate-spin" />
            <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 animate-ping opacity-75" />
          </div>
          <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase">Loading CollabSphere...</span>
        </div>
      </div>
    );
  }

  const isBrand = user?.role === 'Brand';
  const isInfluencer = user?.role === 'Influencer';
  const showSidebar = isAuthenticated && currentPage !== 'landing';

  return (
    <div className="min-h-screen bg-[#050507] text-white flex flex-col font-sans antialiased overflow-x-hidden relative">
      {/* Visual Ambient Depth Layers */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-center purple radial glow */}
        <div className="absolute -top-32 left-1/3 w-[650px] h-[650px] bg-purple-600/12 rounded-full blur-[150px] animate-float-slow" />
        {/* Top-right magenta/pink radial glow */}
        <div className="absolute top-20 right-10 w-[550px] h-[550px] bg-pink-600/10 rounded-full blur-[160px] animate-float-reverse" />
        {/* Bottom subtle violet glow */}
        <div className="absolute bottom-10 left-10 w-[600px] h-[600px] bg-violet-900/10 rounded-full blur-[180px]" />
        {/* Micro-dot grid layer */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:28px_28px] opacity-70" />
      </div>

      {/* Global Navbar */}
      <div className="relative z-40">
        <Navbar
          activePage={currentPage}
          setActivePage={(page: string) => handleNavigate(page)}
          onOpenAuth={(mode: string) => setAuthModalMode(mode)}
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />
      </div>

      {/* Main Layout Area */}
      <div className="flex-1 w-full relative flex min-w-0 z-10">
        {/* Sidebar fixed on desktop, collapsible drawer on mobile/tablet */}
        {showSidebar && (
          <Sidebar
            activeView={currentPage}
            setActiveView={(view: string) => handleNavigate(view)}
            isMobileOpen={isMobileSidebarOpen}
            setIsMobileOpen={setIsMobileSidebarOpen}
          />
        )}

        {/* Main Content Area */}
        <div
          className={`flex-1 w-full min-w-0 transition-all duration-200 ${
            showSidebar ? 'md:pl-64' : ''
          }`}
        >
          <main
            className={`w-full mx-auto min-w-0 overflow-x-hidden ${
              showSidebar
                ? 'max-w-7xl px-6 sm:px-8 py-6 sm:py-8'
                : 'max-w-6xl px-4 sm:px-6 py-8'
            }`}
          >
            {/* Landing Page (Public) */}
            {currentPage === 'landing' && (
              <LandingPage
                onOpenAuth={(mode: string) => setAuthModalMode(mode)}
                onNavigate={(page: string) => handleNavigate(page)}
              />
            )}

            {/* Discovery Page (Brand & Public Preview) */}
            {currentPage === 'discovery' && (
              <InfluencerDiscovery
                preselectedCampaignId={preselectedCampaignForDiscovery}
              />
            )}

            {/* Authenticated Brand Pages */}
            {isAuthenticated && isBrand && (
              <>
                {currentPage === 'dashboard' && (
                  <BrandDashboard
                    onNavigate={(page: string) => handleNavigate(page)}
                    onOpenCreateCampaign={() => handleNavigate('campaigns')}
                  />
                )}

                {currentPage === 'campaigns' && (
                  <CampaignManagement
                    onNavigateToDiscovery={(campId: string) =>
                      handleNavigate('discovery', { campaignId: campId })
                    }
                  />
                )}

                {currentPage === 'collaborations' && (
                  <BrandCollaborationsPage
                    onNavigateToDiscovery={() => handleNavigate('discovery')}
                  />
                )}
              </>
            )}

            {/* Authenticated Influencer Pages */}
            {isAuthenticated && isInfluencer && (
              <>
                {currentPage === 'dashboard' && (
                  <InfluencerDashboard
                    onNavigate={(page: string) => handleNavigate(page)}
                  />
                )}

                {currentPage === 'influencer-collabs' && (
                  <InfluencerCollaborationsPage />
                )}

                {currentPage === 'influencer-profile' && (
                  <InfluencerProfileEdit />
                )}
              </>
            )}

            {/* Shared Authenticated Pages (AI Studio & Payments) */}
            {isAuthenticated && (
              <>
                {currentPage === 'ai-ideas' && (
                  <AIContentIdeasPage />
                )}

                {currentPage === 'payments' && (
                  <PaymentTrackingPage />
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Auth Modal */}
      {authModalMode && (
        <AuthModal
          isOpen={!!authModalMode}
          onClose={() => setAuthModalMode(null)}
          initialMode={authModalMode}
          onSuccess={() => {
            setAuthModalMode(null);
            setCurrentPage('dashboard');
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}
