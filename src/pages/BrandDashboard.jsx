import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Handshake,
  Clock,
  DollarSign,
  Plus,
  Compass,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Zap,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { campaignApi, collaborationApi, paymentApi } from '../services/api.js';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { CollaborationDetailsModal } from '../components/CollaborationDetailsModal.jsx';

const STATUS_COLORS = {
  Pending: '#F59E0B',
  Accepted: '#06B6D4',
  'In Progress': '#A855F7',
  Completed: '#10B981',
  Rejected: '#F43F5E',
  Cancelled: '#71717A',
};

export function BrandDashboard({ onNavigate, onOpenCreateCampaign }) {
  const [campaigns, setCampaigns] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState({ totalAmount: 0, paidAmount: 0, pendingAmount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCollab, setSelectedCollab] = useState(null);

  async function loadDashboardData() {
    try {
      setIsLoading(true);
      const [cRes, collabRes, payRes] = await Promise.all([
        campaignApi.getMyCampaigns(),
        collaborationApi.getBrandCollaborations(),
        paymentApi.getAll(),
      ]);

      if (cRes.success) setCampaigns(cRes.campaigns || []);
      if (collabRes.success) setCollaborations(collabRes.collaborations || []);
      if (payRes.success && payRes.summary) setPaymentSummary(payRes.summary);
    } catch (err) {
      console.error('Failed to load brand dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const totalCampaigns = campaigns.length;
  const activeCollabs = collaborations.filter((c) => c.status === 'In Progress' || c.status === 'Accepted').length;
  const pendingRequests = collaborations.filter((c) => c.status === 'Pending').length;
  const totalSpent = paymentSummary.paidAmount;

  // Pie chart data
  const statusCounts = collaborations.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
    color: STATUS_COLORS[name] || '#94A3B8',
  }));

  // Bar chart data
  const barData = campaigns.slice(0, 5).map((c) => ({
    name: c.title.length > 12 ? c.title.substring(0, 12) + '...' : c.title,
    budget: c.budget,
  }));

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-purple-400 block mb-1">
            Good morning 👋
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Your collaboration workspace
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time analytics, campaigns, and creator deliverables.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('discovery')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl btn-secondary-glass text-xs font-semibold"
          >
            <Compass className="w-4 h-4 text-purple-400" />
            <span>Discover Creators</span>
          </button>
          <button
            onClick={onOpenCreateCampaign}
            className="flex items-center gap-2 px-4 py-2 rounded-xl btn-primary-gradient text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* 4 PREMIUM STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Stat 1: Campaigns */}
        <div className="p-5 rounded-2xl glass-card border border-white/8 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-5px_rgba(124,58,237,0.3)] space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-purple-600/20 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Campaigns</span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-[0_0_12px_rgba(124,58,237,0.3)]">
              <Megaphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {totalCampaigns < 10 ? `0${totalCampaigns}` : totalCampaigns}
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
            <span className="text-zinc-500">Live & Scheduled</span>
            <span className="text-purple-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
        </div>

        {/* Stat 2: Collaborations */}
        <div className="p-5 rounded-2xl glass-card border border-white/8 hover:border-pink-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-5px_rgba(236,72,153,0.3)] space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-600/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-pink-600/20 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Collaborations</span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-600 text-white flex items-center justify-center shadow-[0_0_12px_rgba(236,72,153,0.3)]">
              <Handshake className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {activeCollabs < 10 ? `0${activeCollabs}` : activeCollabs}
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
            <span className="text-zinc-500">In Production</span>
            <span className="text-pink-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Active
            </span>
          </div>
        </div>

        {/* Stat 3: Pending */}
        <div className="p-5 rounded-2xl glass-card border border-white/8 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-5px_rgba(245,158,11,0.25)] space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-600/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-amber-600/20 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Pending</span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.3)]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {pendingRequests < 10 ? `0${pendingRequests}` : pendingRequests}
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
            <span className="text-zinc-500">Awaiting Creator</span>
            <span className="text-amber-400 font-semibold">Action needed</span>
          </div>
        </div>

        {/* Stat 4: Total Spent */}
        <div className="p-5 rounded-2xl glass-card border border-white/8 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-5px_rgba(16,185,129,0.25)] space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-emerald-600/20 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Total Spent</span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            ${totalSpent.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
            <span className="text-zinc-500">${paymentSummary.pendingAmount.toLocaleString()} escrow</span>
            <span className="text-emerald-400 font-semibold">Protected</span>
          </div>
        </div>
      </div>

      {/* SPECIAL GRADIENT CARD (VISUAL HIGHLIGHT OF DASHBOARD) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-purple-900/60 via-[#11111A] to-pink-900/60 border border-purple-500/40 shadow-[0_0_35px_-5px_rgba(168,85,247,0.3)] relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-5 group">
        {/* Floating gradient glow behind */}
        <div className="absolute top-0 left-1/4 w-80 h-32 bg-purple-500/20 rounded-full blur-[70px] pointer-events-none animate-float-slow" />
        <div className="absolute bottom-0 right-1/4 w-80 h-32 bg-pink-500/20 rounded-full blur-[70px] pointer-events-none animate-float-reverse" />

        <div className="space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200 text-[10px] font-bold tracking-wider uppercase mb-1">
            <Sparkles className="w-3 h-3 text-pink-400 animate-pulse" />
            <span>AI Feature</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            AI Content Studio
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
            Turn your campaign brief into viral video hooks, creator speaking scripts, and hashtags in seconds.
          </p>
        </div>

        <button
          onClick={() => onNavigate('ai-ideas')}
          className="self-start sm:self-auto px-6 py-3 rounded-xl btn-primary-gradient text-xs font-bold flex items-center gap-2 shrink-0 relative z-10 shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:scale-105 transition-transform"
        >
          <span>Generate Ideas</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ANALYTICS & CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Budgets Bar Chart */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl glass-card border border-white/8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">Campaign Budgets</h2>
              <p className="text-xs text-zinc-400">Allocated budget per campaign</p>
            </div>
            <button
              onClick={() => onNavigate('campaigns')}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-60 w-full pt-2">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -15, bottom: 10 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EC4899" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#A1A1AA' }} axisLine={{ stroke: '#27272A' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#A1A1AA' }} axisLine={{ stroke: '#27272A' }} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0B0B12',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.12)',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
                      fontSize: '12px',
                      color: '#FFFFFF',
                    }}
                    formatter={(val) => [`$${val}`, 'Budget']}
                  />
                  <Bar dataKey="budget" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-zinc-500">
                No campaign budgets logged yet
              </div>
            )}
          </div>
        </div>

        {/* Pipeline Pie Chart */}
        <div className="p-5 sm:p-6 rounded-2xl glass-card border border-white/8 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white">Collaboration Pipeline</h2>
            <p className="text-xs text-zinc-400">Breakdown of proposals & deals</p>
          </div>

          <div className="h-44 flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={70}
                    paddingAngle={4}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0B0B12',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.12)',
                      fontSize: '12px',
                      color: '#FFFFFF',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-zinc-500">No active collaborations</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/8">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full shrink-0 shadow-[0_0_6px_currentColor]" style={{ backgroundColor: item.color }} />
                <span className="text-zinc-400 truncate">{item.name}:</span>
                <span className="font-bold text-white ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT COLLABORATIONS TABLE */}
      <div className="p-5 sm:p-6 rounded-2xl glass-card border border-white/8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white">Recent Collaborations</h2>
            <p className="text-xs text-zinc-400">Latest creator pitches and deliverables</p>
          </div>
          <button
            onClick={() => onNavigate('collaborations')}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {collaborations.length === 0 ? (
          <div className="text-center py-10 text-xs text-zinc-500">
            No collaborations recorded yet. Explore creators and send your first pitch!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/8 text-zinc-400 font-semibold">
                  <th className="pb-3 font-semibold">Creator</th>
                  <th className="pb-3 font-semibold">Campaign</th>
                  <th className="pb-3 font-semibold">Compensation</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {collaborations.slice(0, 5).map((collab) => (
                  <tr
                    key={collab._id || collab.id}
                    className="hover:bg-white/[0.03] transition-colors group cursor-pointer"
                    onClick={() => setSelectedCollab(collab)}
                  >
                    <td className="py-3.5 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center font-bold text-white text-xs shrink-0">
                          {collab.influencer?.name?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <span className="font-bold text-white block group-hover:text-purple-300 transition-colors">
                            {collab.influencer?.name || 'Creator'}
                          </span>
                          <span className="text-[11px] text-zinc-500">
                            {collab.influencer?.category || 'Lifestyle'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 pr-3">
                      <span className="text-zinc-300 font-medium block">
                        {collab.campaign?.title || 'Direct Sponsorship'}
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        {collab.deliverables?.substring(0, 24)}...
                      </span>
                    </td>

                    <td className="py-3.5 pr-3 font-bold text-white">
                      ${collab.budget?.toLocaleString() || 0}
                    </td>

                    <td className="py-3.5 pr-3">
                      <StatusBadge status={collab.status} />
                    </td>

                    <td className="py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCollab(collab);
                        }}
                        className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 text-[11px] font-semibold transition-colors border border-white/5"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Collaboration Detail Modal */}
      {selectedCollab && (
        <CollaborationDetailsModal
          isOpen={!!selectedCollab}
          onClose={() => setSelectedCollab(null)}
          collaboration={selectedCollab}
          onUpdated={loadDashboardData}
        />
      )}
    </div>
  );
}

export default BrandDashboard;
