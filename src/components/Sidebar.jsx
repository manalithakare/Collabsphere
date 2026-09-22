import React from 'react';
import {
  LayoutDashboard,
  Megaphone,
  Compass,
  Handshake,
  CreditCard,
  Sparkles,
  UserCheck,
  LogOut,
  X,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export function Sidebar({ activeView, setActiveView, isMobileOpen, setIsMobileOpen }) {
  const { user, logout } = useAuth();
  const isBrand = user?.role === 'Brand';

  const brandNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'discovery', label: 'Discover Creators', icon: Compass },
    { id: 'collaborations', label: 'Collaborations', icon: Handshake },
    { id: 'payments', label: 'Payments & Escrow', icon: CreditCard },
    { id: 'ai-ideas', label: 'AI Content Studio', icon: Sparkles, badge: 'AI' },
  ];

  const influencerNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'influencer-collabs', label: 'Collaborations', icon: Handshake },
    { id: 'influencer-profile', label: 'Media Kit & Profile', icon: UserCheck },
    { id: 'payments', label: 'Earnings & Payouts', icon: CreditCard },
    { id: 'ai-ideas', label: 'AI Content Studio', icon: Sparkles, badge: 'AI' },
  ];

  const navItems = isBrand ? brandNavItems : influencerNavItems;

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md md:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-20 bottom-0 left-0 z-40 w-64 bg-[#0B0B12]/92 backdrop-blur-2xl border-r border-white/8 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-[0_0_50px_rgba(0,0,0,0.9)]' : '-translate-x-full'
        }`}
      >
        {/* Navigation list */}
        <div className="p-4 space-y-5 overflow-y-auto">
          {/* Mobile close button header */}
          <div className="flex md:hidden items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Navigation</span>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Role Card */}
          <div className="p-3.5 rounded-2xl glass-card border border-white/10 flex items-center gap-3 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 p-[1px] shrink-0 shadow-[0_0_12px_rgba(168,85,247,0.3)]">
              <div className="w-full h-full rounded-[11px] bg-[#0B0B12] flex items-center justify-center font-bold text-sm text-white">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            <div className="flex-1 min-w-0 z-10">
              <span className="block text-sm font-bold text-white truncate">{user?.name}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399]" />
                <span className="text-[11px] text-zinc-400 font-medium">
                  {user?.role} Workspace
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Workspace Modules
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    if (setIsMobileOpen) setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/20 text-white border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.22)]'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-pink-400' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_8px_rgba(236,72,153,0.4)]'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-white/8 bg-[#0B0B12]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[11px] font-semibold text-zinc-400">CollabSphere AI</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-rose-400 transition-colors py-1 px-2 rounded-lg hover:bg-rose-500/10"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
