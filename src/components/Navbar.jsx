import React, { useState } from 'react';
import {
  Sparkles,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
  Zap,
  Target,
  Compass,
  Handshake,
  Lightbulb,
  CreditCard,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { NotificationPopover } from './NotificationPopover.jsx';
import { useToast } from '../context/ToastContext.jsx';

export function Navbar({ onOpenAuth, activePage, setActivePage, onToggleSidebar }) {
  const { user, isAuthenticated, logout, login } = useAuth();
  const { addToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  async function handleQuickDemo(email, roleLabel) {
    try {
      await login(email, 'password123');
      addToast(`Switched account to demo ${roleLabel}!`, 'success');
      setActivePage('dashboard');
      setDemoMenuOpen(false);
      setMobileMenuOpen(false);
    } catch (err) {
      addToast(err.message || 'Demo login failed', 'error');
    }
  }

  function handleNavClick(pageId) {
    setActivePage(pageId);
    setMobileMenuOpen(false);
  }

  const isBrand = user?.role === 'Brand';
  const isInfluencer = user?.role === 'Influencer';

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6 w-full max-w-7xl mx-auto transition-all duration-300">
      <div className="bg-[#0B0B12]/85 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_12px_36px_-10px_rgba(0,0,0,0.85),0_0_20px_-5px_rgba(124,58,237,0.18)] px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Left: Hamburger (for mobile dashboard) & Custom Logo */}
        <div className="flex items-center gap-3">
          {isAuthenticated && activePage !== 'landing' && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Logo with Abstract Orbit/Spark Graphic */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => setActivePage(isAuthenticated ? 'dashboard' : 'landing')}
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-violet-500 to-pink-500 p-[1px] shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full rounded-[11px] bg-[#0B0B12] flex items-center justify-center relative overflow-hidden">
                {/* Orbit Rings inside */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/25 to-pink-600/25" />
                <div className="w-4 h-4 rounded-full border border-purple-400/60 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400 shadow-[0_0_6px_#EC4899]" />
                </div>
                <Sparkles className="w-3.5 h-3.5 text-purple-300 absolute -top-0.5 -right-0.5 animate-pulse" />
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-base font-extrabold tracking-tight text-white font-display">
                  Collab<span className="bg-gradient-to-r from-purple-400 via-pink-400 to-pink-300 bg-clip-text text-transparent">Sphere</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300">
                  AI
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Hub */}
        {isAuthenticated ? (
          <nav className="hidden lg:flex items-center gap-1 bg-[#11111A]/60 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                activePage === 'dashboard'
                  ? 'text-white bg-gradient-to-r from-purple-600/40 to-pink-600/30 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </button>

            {isBrand && (
              <button
                onClick={() => handleNavClick('campaigns')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  activePage === 'campaigns'
                    ? 'text-white bg-gradient-to-r from-purple-600/40 to-pink-600/30 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                Campaigns
              </button>
            )}

            <button
              onClick={() => handleNavClick('discovery')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                activePage === 'discovery'
                  ? 'text-white bg-gradient-to-r from-purple-600/40 to-pink-600/30 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Discover
            </button>

            <button
              onClick={() => handleNavClick('collaborations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                activePage === 'collaborations'
                  ? 'text-white bg-gradient-to-r from-purple-600/40 to-pink-600/30 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Handshake className="w-3.5 h-3.5" />
              Collaborations
            </button>

            <button
              onClick={() => handleNavClick('ai-ideas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                activePage === 'ai-ideas'
                  ? 'text-white bg-gradient-to-r from-purple-600/40 to-pink-600/30 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-pink-400" />
              AI Ideas
            </button>

            <button
              onClick={() => handleNavClick('payments')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                activePage === 'payments'
                  ? 'text-white bg-gradient-to-r from-purple-600/40 to-pink-600/30 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              Payments
            </button>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => handleNavClick('landing')}
              className={`text-xs font-medium transition-colors ${
                activePage === 'landing' ? 'text-white font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <a
              href="#features"
              onClick={() => setActivePage('landing')}
              className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setActivePage('landing')}
              className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a
              href="#brands"
              onClick={() => setActivePage('landing')}
              className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Brands
            </a>
            <a
              href="#creators"
              onClick={() => setActivePage('landing')}
              className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Creators
            </a>
          </nav>
        )}

        {/* Right Action buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Demo Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDemoMenuOpen(!demoMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-purple-200 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl transition-all duration-200 border border-purple-500/25 shadow-[0_0_10px_rgba(168,85,247,0.15)]"
            >
              <Zap className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
              <span className="hidden sm:inline">Demo Switch</span>
              <span className="sm:hidden">Demo</span>
              <ChevronDown className="w-3 h-3 text-purple-300" />
            </button>

            {demoMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-2xl glass-dropdown py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setDemoMenuOpen(false)}
              >
                <div className="px-3.5 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Test as Brand
                </div>
                <button
                  onClick={() => handleQuickDemo('brand@auraglow.com', 'Aura Glow (Brand)')}
                  className="w-full text-left px-3.5 py-2 text-xs hover:bg-purple-600/15 text-zinc-300 hover:text-white flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="font-semibold text-white">Aura Glow Skincare</div>
                    <div className="text-[11px] text-zinc-400">brand@auraglow.com</div>
                  </div>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-full border border-purple-500/30">
                    Brand
                  </span>
                </button>
                <button
                  onClick={() => handleQuickDemo('contact@voltnutrition.in', 'Volt Nutrition (Brand)')}
                  className="w-full text-left px-3.5 py-2 text-xs hover:bg-purple-600/15 text-zinc-300 hover:text-white flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="font-semibold text-white">Volt Nutrition</div>
                    <div className="text-[11px] text-zinc-400">contact@voltnutrition.in</div>
                  </div>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-full border border-purple-500/30">
                    Brand
                  </span>
                </button>

                <div className="px-3.5 py-1 mt-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-t border-white/5">
                  Test as Creator
                </div>
                <button
                  onClick={() => handleQuickDemo('rhea@techverse.com', 'Rhea Sen (Tech)')}
                  className="w-full text-left px-3.5 py-2 text-xs hover:bg-pink-600/15 text-zinc-300 hover:text-white flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="font-semibold text-white">Rhea Sen</div>
                    <div className="text-[11px] text-zinc-400">145k • Tech Creator</div>
                  </div>
                  <span className="text-[10px] bg-pink-500/20 text-pink-300 px-1.5 py-0.5 rounded-full border border-pink-500/30">
                    Creator
                  </span>
                </button>
                <button
                  onClick={() => handleQuickDemo('kabir@fashionflow.com', 'Kabir Mehta (Fashion)')}
                  className="w-full text-left px-3.5 py-2 text-xs hover:bg-pink-600/15 text-zinc-300 hover:text-white flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="font-semibold text-white">Kabir Mehta</div>
                    <div className="text-[11px] text-zinc-400">320k • Fashion Stylist</div>
                  </div>
                  <span className="text-[10px] bg-pink-500/20 text-pink-300 px-1.5 py-0.5 rounded-full border border-pink-500/30">
                    Creator
                  </span>
                </button>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notification Popover with glow */}
              <NotificationPopover />

              {/* User Avatar & Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 p-[1px]">
                    <div className="w-full h-full rounded-[7px] bg-[#0B0B12] flex items-center justify-center font-bold text-xs text-white">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </div>
                  <div className="hidden sm:block text-left">
                    <span className="block text-xs font-semibold text-white leading-tight">
                      {user?.name}
                    </span>
                    <span className="inline-block text-[10px] text-purple-300 font-medium leading-none">
                      {user?.role}
                    </span>
                  </div>
                  <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-zinc-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 rounded-2xl glass-dropdown py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3.5 py-2 border-b border-white/5">
                      <div className="text-xs font-semibold text-white truncate">{user?.name}</div>
                      <div className="text-[11px] text-zinc-400 truncate">{user?.email}</div>
                    </div>

                    <button
                      onClick={() => handleNavClick('dashboard')}
                      className="w-full text-left px-3.5 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-purple-400" />
                      Workspace Dashboard
                    </button>

                    {isInfluencer && (
                      <button
                        onClick={() => handleNavClick('profile-edit')}
                        className="w-full text-left px-3.5 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-pink-400" />
                        Media Kit & Profile
                      </button>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        addToast('Logged out successfully', 'info');
                        setActivePage('landing');
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors border-t border-white/5 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('register')}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_25px_rgba(236,72,153,0.45)] hover:scale-[1.02]"
              >
                Get Started →
              </button>
            </div>
          )}

          {/* Mobile Public Menu Hamburger */}
          {!isAuthenticated && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-xl text-zinc-400 hover:bg-white/5"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer for Public Landing */}
      {!isAuthenticated && mobileMenuOpen && (
        <div className="md:hidden mt-2 rounded-2xl glass-panel p-4 space-y-3 animate-in fade-in duration-200">
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => handleNavClick('landing')}
              className="text-left py-2 px-3 text-xs font-medium text-white hover:bg-white/5 rounded-lg"
            >
              Overview
            </button>
            <a
              href="#features"
              onClick={() => {
                setActivePage('landing');
                setMobileMenuOpen(false);
              }}
              className="py-2 px-3 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => {
                setActivePage('landing');
                setMobileMenuOpen(false);
              }}
              className="py-2 px-3 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg"
            >
              How It Works
            </a>
            <a
              href="#brands"
              onClick={() => {
                setActivePage('landing');
                setMobileMenuOpen(false);
              }}
              className="py-2 px-3 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg"
            >
              Brands
            </a>
            <a
              href="#creators"
              onClick={() => {
                setActivePage('landing');
                setMobileMenuOpen(false);
              }}
              className="py-2 px-3 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg"
            >
              Creators
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
