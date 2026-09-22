import React from 'react';
import {
  Sparkles,
  Compass,
  Handshake,
  CreditCard,
  Megaphone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  Star,
  Users,
  TrendingUp,
  Layers,
  ChevronRight,
  Play,
  Flame,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export function LandingPage({ onOpenAuth, onNavigate }) {
  const { login } = useAuth();
  const { addToast } = useToast();

  async function handleQuickDemo(email, label) {
    try {
      await login(email, 'password123');
      addToast(`Logged in as demo ${label}!`, 'success');
      onNavigate('dashboard');
    } catch (err) {
      addToast(err.message || 'Demo login failed', 'error');
    }
  }

  const features = [
    {
      icon: Megaphone,
      title: 'Campaign Management',
      desc: 'Define deliverables, deadlines, and allocated budgets in structured briefs with real-time status tracking.',
      glowColor: 'from-purple-600/30 to-indigo-600/30',
      iconGradient: 'from-purple-500 to-indigo-500',
    },
    {
      icon: Compass,
      title: 'Creator Discovery',
      desc: 'Filter verified influencers by niche, platform, audience size, engagement rate, and base rates instantly.',
      glowColor: 'from-pink-600/30 to-purple-600/30',
      iconGradient: 'from-pink-500 to-purple-500',
    },
    {
      icon: Handshake,
      title: 'Structured Collaborations',
      desc: 'Direct pitch proposals, duplicate prevention, and lifecycle milestones from Requested to Completed.',
      glowColor: 'from-violet-600/30 to-pink-600/30',
      iconGradient: 'from-violet-500 to-pink-500',
    },
    {
      icon: CreditCard,
      title: 'Milestone Escrow Tracking',
      desc: 'Transparent compensation release where creators see guaranteed payout records upon deliverable approval.',
      glowColor: 'from-emerald-600/30 to-teal-600/30',
      iconGradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Sparkles,
      title: 'AI Content Studio',
      desc: 'Generate viral video hooks, creator speaking scripts, call-to-actions, and hashtags tailored directly to your product specs.',
      glowColor: 'from-pink-600/30 to-rose-600/30',
      iconGradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: ShieldCheck,
      title: 'Dual Portals & Instant Alerts',
      desc: 'Tailored views for Brands and Creators with real-time notifications on all milestone and payout transitions.',
      glowColor: 'from-amber-600/30 to-orange-600/30',
      iconGradient: 'from-amber-500 to-orange-500',
    },
  ];

  const steps = [
    { num: '01', title: 'Brand Creates Campaign', desc: 'Specify product specs, deliverables, compensation, and audience targets.' },
    { num: '02', title: 'Discover Creators', desc: 'Filter verified influencer media kits matching your exact niche and budget.' },
    { num: '03', title: 'Send Structured Pitch', desc: 'Formal proposal with agreed terms, eliminating messy email back-and-forth.' },
    { num: '04', title: 'Creator Accepts & Crafts', desc: 'Influencers review terms, accept the pitch, and commence content production.' },
    { num: '05', title: 'Deliverables Verified', desc: 'Content is published and verified against clear campaign milestones.' },
    { num: '06', title: 'Payment Released', desc: 'Brand releases compensation, automatically updating the earnings ledger.' },
  ];

  return (
    <div className="space-y-24 pb-20 relative">
      {/* CINEMATIC HERO SECTION */}
      <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden">
        {/* Glow Spheres specific to hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-purple-600/20 via-pink-600/15 to-transparent rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-7 relative z-10">
          
          {/* Small Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 border border-purple-500/30 text-purple-200 text-xs font-semibold shadow-[0_0_20px_rgba(168,85,247,0.2)] animate-pulse">
            <span className="text-pink-400">✦</span>
            <span>AI-Powered Collaboration Platform</span>
          </div>

          {/* Large Cinematic Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
            Connect.{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-pink-400 bg-clip-text text-transparent">
              Collaborate.
            </span>{' '}
            <span className="bg-gradient-to-r from-white via-pink-200 to-pink-300 bg-clip-text text-transparent">
              Grow.
            </span>
          </h1>

          {/* Short Subtitle */}
          <p className="text-base sm:text-lg text-zinc-300 max-w-xl mx-auto leading-relaxed font-normal">
            Where brands and creators turn collaborations into growth.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenAuth('register')}
              className="px-7 py-3.5 rounded-xl btn-primary-gradient text-sm flex items-center gap-2 group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => onNavigate('discovery')}
              className="px-6 py-3.5 rounded-xl btn-secondary-glass text-sm flex items-center gap-2"
            >
              <span>Explore Platform</span>
              <Compass className="w-4 h-4 text-purple-400" />
            </button>
          </div>

          {/* 1-Click Interactive Demo Launcher Bar */}
          <div className="pt-6 max-w-xl mx-auto">
            <div className="p-3.5 rounded-2xl glass-card border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Instant Evaluation Mode</span>
                  <span className="text-[11px] text-zinc-400">1-click login as seeded demo accounts</span>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleQuickDemo('brand@auraglow.com', 'Brand (Aura Glow)')}
                  className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-xs font-bold text-purple-200 transition-colors"
                >
                  Brand Demo
                </button>
                <button
                  onClick={() => handleQuickDemo('rhea@techverse.com', 'Creator (Rhea Sen)')}
                  className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 text-xs font-bold text-pink-200 transition-colors"
                >
                  Creator Demo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* HERO INTERACTIVE SHOWCASE PREVIEW */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 relative z-10">
          <div className="relative rounded-3xl p-1 bg-gradient-to-b from-purple-500/30 via-pink-500/20 to-transparent shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(124,58,237,0.2)]">
            <div className="rounded-[22px] bg-[#0B0B12]/95 backdrop-blur-2xl border border-white/10 p-5 sm:p-7">
              {/* Fake App Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-white/8 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] font-mono text-zinc-500 ml-2">app.collabsphere.ai / live-workspace</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    ESCROW SECURED
                  </span>
                </div>
              </div>

              {/* Showcase Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Showcase 1: Active Campaign */}
                <div className="p-4 rounded-2xl bg-[#11111A]/90 border border-white/8 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold text-[10px]">
                      BEAUTY • INSTAGRAM
                    </span>
                    <span className="text-emerald-400 font-bold">$2,500</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">HydraGlow Serum Launch</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Aura Glow Cosmetics</p>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-500">Milestone</span>
                    <span className="text-pink-400 font-semibold">Deliverables Verified</span>
                  </div>
                </div>

                {/* Showcase 2: AI Content Studio Highlight */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900/40 via-[#11111A] to-pink-900/40 border border-purple-500/30 space-y-3 relative overflow-hidden">
                  <div className="flex items-center gap-2 text-xs">
                    <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
                    <span className="font-bold text-white">AI Content Studio</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-purple-500/20 text-[11px] font-mono text-purple-200 leading-snug">
                    “Stop buying 5 different skincare serums. This 15% Vitamin C formulation...”
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400">
                    <span>Generated in 1.4s</span>
                    <span className="text-pink-300 font-semibold">98.4% Match Rate</span>
                  </div>
                </div>

                {/* Showcase 3: Verified Creator */}
                <div className="p-4 rounded-2xl bg-[#11111A]/90 border border-white/8 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 p-[1px]">
                      <div className="w-full h-full rounded-[11px] bg-[#0B0B12] flex items-center justify-center font-bold text-white text-xs">
                        RS
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-white">Rhea Sen</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
                      </div>
                      <span className="text-[10px] text-zinc-400">Tech & Design • Mumbai</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-center">
                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-[10px] text-zinc-400 block">Followers</span>
                      <span className="text-xs font-bold text-white">128K</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-[10px] text-zinc-400 block">Engagement</span>
                      <span className="text-xs font-bold text-pink-400">5.2%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Metrics Showcase Ribbon */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl glass-card border border-white/10 text-center">
            <div className="p-2">
              <div className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">8+</div>
              <span className="text-xs font-medium text-zinc-400">Verified Content Niches</span>
            </div>
            <div className="p-2 border-l border-white/10">
              <div className="text-2xl font-black text-pink-400">100%</div>
              <span className="text-xs font-medium text-zinc-400">Escrow Milestone Visibility</span>
            </div>
            <div className="p-2 border-l border-white/10">
              <div className="text-2xl font-black text-purple-400">&lt; 3s</div>
              <span className="text-xs font-medium text-zinc-400">AI Script Generation</span>
            </div>
            <div className="p-2 border-l border-white/10">
              <div className="text-2xl font-black text-white">Zero</div>
              <span className="text-xs font-medium text-zinc-400">Duplicate Pitch Spam</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10 relative z-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-pink-400">Built for 2026 SaaS</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Engineered for High-Yield Creator Partnerships
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Everything brands and creators need to execute seamless, high-ROI sponsorship campaigns without messy chat threads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-card border border-white/8 hover:border-purple-500/40 transition-all duration-300 space-y-4 group hover:-translate-y-1"
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${feat.iconGradient} text-white flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-normal">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10 relative z-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Frictionless Lifecycle</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How CollabSphere Works
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            A 6-step milestone pipeline that takes campaigns from initial concept to cleared payout.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((st) => (
            <div
              key={st.num}
              className="p-5 rounded-2xl glass-card border border-white/8 space-y-2 relative overflow-hidden group hover:border-purple-500/30 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-3xl font-black bg-gradient-to-r from-purple-500/30 to-pink-500/30 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                {st.num}
              </div>
              <h4 className="text-sm font-bold text-white">{st.title}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DUAL WORKSPACES: FOR BRANDS VS FOR CREATORS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* For Brands Card */}
          <div id="brands" className="p-8 rounded-3xl bg-[#0B0B12]/90 border border-purple-500/30 text-white shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(124,58,237,0.15)] space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="space-y-2 relative z-10">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                For Direct-to-Consumer & Agency Brands
              </span>
              <h3 className="text-2xl font-extrabold tracking-tight">Scale Influencer ROI with Zero Friction</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Stop wasting weeks searching Instagram hashtags and negotiating in comment threads. Target creators by verified data and run campaigns on time.
              </p>
            </div>

            <ul className="space-y-3 text-xs text-zinc-300 relative z-10">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Centralized campaign management and structured briefs</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Verified creator discovery with engagement rates & rates</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Duplicate pitch prevention ensures your team never double-contacts</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>AI Content Studio generates hooks and scripts tailored to your products</span>
              </li>
            </ul>

            <button
              onClick={() => handleQuickDemo('brand@auraglow.com', 'Brand')}
              className="w-full py-3.5 rounded-xl btn-primary-gradient text-xs font-bold transition-all relative z-10"
            >
              Launch Brand Dashboard (Demo)
            </button>
          </div>

          {/* For Influencers Card */}
          <div id="influencers" className="p-8 rounded-3xl bg-[#0B0B12]/90 border border-pink-500/30 text-white shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(236,72,153,0.15)] space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="space-y-2 relative z-10">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-500/30">
                For Creators & Influencers
              </span>
              <h3 className="text-2xl font-extrabold tracking-tight">Monetize Your Influence on Professional Terms</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Never chase late payments or negotiate without clear deliverables again. Receive clear brand pitches with guaranteed compensation and deadlines.
              </p>
            </div>

            <ul className="space-y-3 text-xs text-zinc-300 relative z-10">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
                <span>Professional creator profile & media kit visible to top brands</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
                <span>Incoming collaboration inbox with one-click Accept or Decline</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
                <span>Real-time earnings tracking with transparent milestone records</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
                <span>Structured milestones ensure you deliver only what was agreed</span>
              </li>
            </ul>

            <button
              onClick={() => handleQuickDemo('rhea@techverse.com', 'Creator')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(236,72,153,0.35)] transition-all relative z-10"
            >
              Launch Creator Dashboard (Demo)
            </button>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5 relative z-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Ready to experience the future of creator partnerships?
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
          Join CollabSphere today to launch campaigns, discover influencers, and manage deals seamlessly.
        </p>
        <button
          onClick={() => onOpenAuth('register')}
          className="px-8 py-3.5 btn-primary-gradient text-xs font-bold rounded-xl shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all hover:scale-105"
        >
          Create Free Account Now
        </button>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/8 pt-8 text-center text-xs text-zinc-500 relative z-10">
        <div className="flex items-center justify-center gap-2 font-bold text-white mb-1">
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-purple-500 to-pink-500 p-[1px]">
            <div className="w-full h-full rounded-[5px] bg-[#0B0B12] flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-pink-400" />
            </div>
          </div>
          <span>CollabSphere</span>
        </div>
        <p className="text-[11px] text-zinc-500">“Connect. Collaborate. Grow.” • 2026 AI-Powered Collaboration Platform</p>
      </footer>
    </div>
  );
}

export default LandingPage;
