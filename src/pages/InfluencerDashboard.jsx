import React, { useState, useEffect } from 'react';
import {
  Handshake,
  Clock,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  UserCheck,
  Building2,
  Sparkles,
  TrendingUp,
  X,
  Check,
  Calendar,
} from 'lucide-react';
import { collaborationApi, paymentApi } from '../services/api.js';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { CollaborationDetailsModal } from '../components/CollaborationDetailsModal.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export function InfluencerDashboard({ onNavigate }) {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [collaborations, setCollaborations] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState({ totalAmount: 0, paidAmount: 0, pendingAmount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCollab, setSelectedCollab] = useState(null);

  async function loadData() {
    try {
      setIsLoading(true);
      const [collabRes, payRes] = await Promise.all([
        collaborationApi.getInfluencerCollaborations(),
        paymentApi.getAll(),
      ]);

      if (collabRes.success) setCollaborations(collabRes.collaborations || []);
      if (payRes.success && payRes.summary) setPaymentSummary(payRes.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const pendingRequests = collaborations.filter((c) => c.status === 'Pending');
  const activeCollabs = collaborations.filter((c) => c.status === 'Accepted' || c.status === 'In Progress');
  const completedCollabs = collaborations.filter((c) => c.status === 'Completed');
  const totalEarned = paymentSummary.paidAmount;

  async function handleQuickAction(collabId, status) {
    try {
      const res = await collaborationApi.updateStatus(collabId, status);
      if (res.success) {
        addToast(`Collaboration request ${status.toLowerCase()}`, 'success');
        loadData();
      }
    } catch (err) {
      addToast(err.message || 'Action failed', 'error');
    }
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-pink-400 block mb-1">
            Good morning 👋
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Your creator workspace
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Welcome back, {user?.name || 'Creator'}. Here is your live partnership hub.
          </p>
        </div>

        <button
          onClick={() => onNavigate('influencer-profile')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl btn-primary-gradient text-xs font-bold self-start sm:self-auto"
        >
          <UserCheck className="w-4 h-4" />
          <span>Edit Media Kit</span>
        </button>
      </div>

      {/* 4 METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Pending Requests */}
        <div className="p-5 rounded-2xl glass-card border border-white/8 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-5px_rgba(245,158,11,0.25)] space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-600/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-amber-600/20 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">New Requests</span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.3)]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {pendingRequests.length < 10 ? `0${pendingRequests.length}` : pendingRequests.length}
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
            <span className="text-zinc-500">Incoming Pitches</span>
            <span className="text-amber-400 font-semibold">Review needed</span>
          </div>
        </div>

        {/* Active Collaborations */}
        <div className="p-5 rounded-2xl glass-card border border-white/8 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-5px_rgba(124,58,237,0.3)] space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-purple-600/20 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">In Progress</span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-[0_0_12px_rgba(124,58,237,0.3)]">
              <Handshake className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {activeCollabs.length < 10 ? `0${activeCollabs.length}` : activeCollabs.length}
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
            <span className="text-zinc-500">Live Campaigns</span>
            <span className="text-purple-400 font-semibold">Active</span>
          </div>
        </div>

        {/* Completed Collabs */}
        <div className="p-5 rounded-2xl glass-card border border-white/8 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-5px_rgba(16,185,129,0.25)] space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-emerald-600/20 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Completed</span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {completedCollabs.length < 10 ? `0${completedCollabs.length}` : completedCollabs.length}
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
            <span className="text-zinc-500">Verified Deliverables</span>
            <span className="text-emerald-400 font-semibold">100% Rate</span>
          </div>
        </div>

        {/* Total Earned */}
        <div className="p-5 rounded-2xl glass-card border border-white/8 hover:border-pink-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-5px_rgba(236,72,153,0.3)] space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-600/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-pink-600/20 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Total Earned</span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 text-white flex items-center justify-center shadow-[0_0_12px_rgba(236,72,153,0.3)]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            ${totalEarned.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
            <span className="text-zinc-500">${paymentSummary.pendingAmount.toLocaleString()} in escrow</span>
            <span className="text-pink-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Payout
            </span>
          </div>
        </div>
      </div>

      {/* SPECIAL GRADIENT CARD (CREATOR AI STUDIO) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-purple-900/60 via-[#11111A] to-pink-900/60 border border-purple-500/40 shadow-[0_0_35px_-5px_rgba(168,85,247,0.3)] relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-5 group">
        <div className="absolute top-0 left-1/4 w-80 h-32 bg-purple-500/20 rounded-full blur-[70px] pointer-events-none animate-float-slow" />
        <div className="absolute bottom-0 right-1/4 w-80 h-32 bg-pink-500/20 rounded-full blur-[70px] pointer-events-none animate-float-reverse" />

        <div className="space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-200 text-[10px] font-bold tracking-wider uppercase mb-1">
            <Sparkles className="w-3 h-3 text-pink-400 animate-pulse" />
            <span>AI Content Studio</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Need viral angles for your sponsored deals?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
            Input product specs and generate authentic creator speaking scripts, high-retention video hooks, and hashtags.
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

      {/* PENDING REQUESTS INBOX (HIGHLIGHTED) */}
      <div className="p-5 sm:p-6 rounded-2xl glass-card border border-white/8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-white">Pending Proposals</h2>
            {pendingRequests.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                {pendingRequests.length} action required
              </span>
            )}
          </div>
          <button
            onClick={() => onNavigate('influencer-collabs')}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="text-center py-8 text-xs text-zinc-500 bg-[#0B0B12]/50 rounded-xl border border-white/5">
            No pending collaboration requests. Your inbox is up to date!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map((req) => (
              <div
                key={req._id || req.id}
                className="p-4 rounded-xl bg-[#11111A]/90 border border-amber-500/30 space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{req.brand?.name || 'Brand Sponsor'}</h4>
                      <span className="text-[10px] text-zinc-400">
                        {req.campaign?.category} • {req.collaborationType}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">${req.budget}</span>
                </div>

                <div className="p-2 rounded-lg bg-black/40 border border-white/5 text-[11px] text-zinc-300 space-y-1">
                  <span className="text-zinc-500 block text-[10px]">Deliverables requested:</span>
                  <p className="line-clamp-2">{req.deliverables}</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-purple-400" /> Deadline: {req.deadline}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuickAction(req._id || req.id, 'Rejected')}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-[11px] font-semibold transition-colors flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Decline
                    </button>
                    <button
                      onClick={() => handleQuickAction(req._id || req.id, 'Accepted')}
                      className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-bold transition-colors flex items-center gap-1 border border-emerald-500/30"
                    >
                      <Check className="w-3 h-3" /> Accept
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACTIVE COLLABORATIONS */}
      <div className="p-5 sm:p-6 rounded-2xl glass-card border border-white/8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white">Active Campaigns</h2>
            <p className="text-xs text-zinc-400">Current agreements and deliverables</p>
          </div>
          <button
            onClick={() => onNavigate('influencer-collabs')}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeCollabs.length === 0 ? (
          <div className="text-center py-10 text-xs text-zinc-500">
            No active collaborations currently in production.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/8 text-zinc-400 font-semibold">
                  <th className="pb-3 font-semibold">Brand</th>
                  <th className="pb-3 font-semibold">Campaign / Product</th>
                  <th className="pb-3 font-semibold">Compensation</th>
                  <th className="pb-3 font-semibold">Milestone</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {activeCollabs.slice(0, 5).map((collab) => (
                  <tr
                    key={collab._id || collab.id}
                    className="hover:bg-white/[0.03] transition-colors group cursor-pointer"
                    onClick={() => setSelectedCollab(collab)}
                  >
                    <td className="py-3.5 pr-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center font-bold text-white text-xs">
                          {collab.brand?.name?.charAt(0) || 'B'}
                        </div>
                        <span className="font-bold text-white group-hover:text-purple-300 transition-colors">
                          {collab.brand?.name || 'Brand Partner'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 pr-3">
                      <span className="text-zinc-300 font-medium block">
                        {collab.campaign?.title || 'Brand Sponsorship'}
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        {collab.campaign?.productName}
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
                        Manage
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
          onUpdated={loadData}
        />
      )}
    </div>
  );
}

export default InfluencerDashboard;
