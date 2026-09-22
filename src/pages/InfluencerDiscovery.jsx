import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Users,
  MapPin,
  TrendingUp,
  DollarSign,
  Send,
  ExternalLink,
  Instagram,
  Youtube,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  User,
} from 'lucide-react';
import { influencerApi, campaignApi, collaborationApi } from '../services/api.js';
import { Modal } from '../components/Modal.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export function InfluencerDiscovery({ preselectedCampaignId }) {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [influencers, setInfluencers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [platform, setPlatform] = useState('All');
  const [location, setLocation] = useState('');
  const [minFollowers, setMinFollowers] = useState('');
  const [maxBudget, setMaxBudget] = useState('');

  // Modals
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [pitchingInfluencer, setPitchingInfluencer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pitch Form
  const [pitchData, setPitchData] = useState({
    campaignId: preselectedCampaignId || '',
    collaborationType: 'Paid',
    budget: '',
    deliverables: '',
    deadline: '',
    message: '',
  });

  async function loadData() {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category !== 'All') params.append('category', category);
      if (platform !== 'All') params.append('platform', platform);
      if (location) params.append('location', location);
      if (minFollowers) params.append('minFollowers', minFollowers);
      if (maxBudget) params.append('maxBudget', maxBudget);

      const [infRes, campRes] = await Promise.all([
        influencerApi.getAll(params.toString()),
        user?.role === 'Brand' ? campaignApi.getMyCampaigns('status=Active') : Promise.resolve({ success: true, campaigns: [] }),
      ]);

      if (infRes.success) setInfluencers(infRes.influencers || []);
      if (campRes.success) {
        setCampaigns(campRes.campaigns || []);
        if (preselectedCampaignId && campRes.campaigns) {
          const matched = campRes.campaigns.find((c) => (c._id || c.id) === preselectedCampaignId);
          if (matched) {
            setPitchData((prev) => ({
              ...prev,
              campaignId: preselectedCampaignId,
              deliverables: matched.deliverables || '',
              deadline: matched.deadline || '',
              budget: matched.budget || '',
            }));
          }
        }
      }
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Error loading discovery data', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [category, platform]);

  function handleOpenPitch(inf) {
    if (!user) {
      addToast('Please log in as a Brand to pitch creators', 'info');
      return;
    }
    if (user.role !== 'Brand') {
      addToast('Only brands can send collaboration pitches to creators', 'error');
      return;
    }
    setPitchingInfluencer(inf);
    setPitchData((prev) => ({
      ...prev,
      budget: inf.startingPrice || prev.budget,
    }));
  }

  async function handleSendPitch(e) {
    e.preventDefault();
    if (!pitchData.campaignId) {
      addToast('Please select a campaign to link this pitch with', 'error');
      return;
    }
    if (!pitchData.budget || !pitchData.deliverables || !pitchData.deadline) {
      addToast('Please complete all required fields (Budget, Deliverables, Deadline)', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await collaborationApi.sendRequest({
        ...pitchData,
        influencerId: pitchingInfluencer.userId || pitchingInfluencer.id,
      });

      if (res.success) {
        addToast(`Pitch sent to ${pitchingInfluencer.name}!`, 'success');
        setPitchingInfluencer(null);
      }
    } catch (err) {
      addToast(err.message || 'Failed to send collaboration request', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  const hasActiveFilters = search || category !== 'All' || platform !== 'All' || location || minFollowers || maxBudget;

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-purple-400 block mb-1">
            Creator Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Discover Verified Creators
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Search verified influencers with audience metrics, engagement benchmarks, and base rates.
          </p>
        </div>

        {preselectedCampaignId && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-xs text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Targeting creators for selected campaign</span>
          </div>
        )}
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="p-4 sm:p-5 rounded-2xl glass-card border border-white/8 space-y-3.5">
        {/* Row 1: Search & Primary Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadData()}
              placeholder="Search by creator name, niche, bio keywords..."
              className="w-full pl-10 pr-4 py-2.5 input-dark text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-dark px-3 py-2.5 text-xs text-zinc-300"
            >
              <option value="All">All Niches</option>
              <option value="Beauty">Beauty</option>
              <option value="Fashion">Fashion</option>
              <option value="Fitness">Fitness</option>
              <option value="Tech">Tech</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Gaming">Gaming</option>
              <option value="Finance">Finance</option>
            </select>

            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="input-dark px-3 py-2.5 text-xs text-zinc-300"
            >
              <option value="All">All Platforms</option>
              <option value="Instagram">Instagram</option>
              <option value="YouTube">YouTube</option>
            </select>

            <button
              onClick={loadData}
              className="px-4 py-2.5 btn-primary-gradient text-xs font-bold rounded-xl shrink-0"
            >
              Search
            </button>
          </div>
        </div>

        {/* Row 2: Secondary Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/5 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <MapPin className="w-3.5 h-3.5 text-purple-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City (e.g. Mumbai)"
              className="px-2.5 py-1.5 input-dark text-xs w-36"
            />
          </div>

          <div className="flex items-center gap-1.5 text-zinc-400">
            <Users className="w-3.5 h-3.5 text-pink-400" />
            <input
              type="number"
              value={minFollowers}
              onChange={(e) => setMinFollowers(e.target.value)}
              placeholder="Min followers"
              className="px-2.5 py-1.5 input-dark text-xs w-32"
            />
          </div>

          <div className="flex items-center gap-1.5 text-zinc-400">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <input
              type="number"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              placeholder="Max rate ($)"
              className="px-2.5 py-1.5 input-dark text-xs w-28"
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearch('');
                setCategory('All');
                setPlatform('All');
                setLocation('');
                setMinFollowers('');
                setMaxBudget('');
                loadData();
              }}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold ml-auto flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* INFLUENCERS CARDS GRID */}
      {isLoading ? (
        <div className="text-center py-16 text-xs text-zinc-500">
          Loading creator intelligence...
        </div>
      ) : influencers.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl border border-white/8 p-8 space-y-3">
          <Users className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No creators match your filters</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters to see the full directory.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {influencers.map((inf) => {
            const followerStr =
              inf.followers >= 1000000
                ? (inf.followers / 1000000).toFixed(1) + 'M'
                : inf.followers >= 1000
                ? (inf.followers / 1000).toFixed(1) + 'K'
                : inf.followers;

            return (
              <div
                key={inf._id || inf.id}
                className="rounded-2xl glass-card border border-white/8 hover:border-purple-500/50 hover:shadow-[0_12px_35px_-8px_rgba(168,85,247,0.35)] transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1.5"
              >
                <div>
                  {/* Header Cover Banner */}
                  <div className="relative h-20 bg-gradient-to-r from-purple-900/40 via-[#11111A] to-pink-900/30 p-3 border-b border-white/5">
                    {/* Creator Avatar with scaling micro-interaction */}
                    <div className="absolute -bottom-5 left-3.5">
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 p-[1.5px] shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                        <img
                          src={inf.profileImage}
                          alt={inf.name}
                          className="w-full h-full rounded-[14px] object-cover transition-transform duration-300 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    {/* Social badges in top right */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      {inf.platforms?.includes('Instagram') && (
                        <span className="p-1 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/30">
                          <Instagram className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {inf.platforms?.includes('YouTube') && (
                        <span className="p-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          <Youtube className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="pt-8 px-4 pb-3 space-y-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                          {inf.name}
                        </h3>
                        <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                      </div>
                      <span className="text-[11px] text-zinc-400 font-medium">
                        {inf.category} • {inf.location || 'Mumbai'}
                      </span>
                    </div>

                    {inf.bio && (
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {inf.bio}
                      </p>
                    )}

                    {/* Stats Pills Box */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Followers</span>
                        <span className="font-bold text-white">{followerStr}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Engagement</span>
                        <span className="font-bold text-pink-400">{inf.engagementRate || '4.8'}%</span>
                      </div>
                    </div>

                    {/* Starting Rate */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-zinc-500">Starting at</span>
                      <span className="font-extrabold text-white text-sm">
                        ${inf.startingPrice?.toLocaleString() || 500}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="px-4 pb-4 pt-2 border-t border-white/5 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedInfluencer(inf)}
                    className="py-2 rounded-xl btn-secondary-glass text-xs font-semibold text-center flex items-center justify-center gap-1"
                  >
                    <span>Profile</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => handleOpenPitch(inf)}
                    className="py-2 rounded-xl btn-primary-gradient text-xs font-bold text-center flex items-center justify-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Pitch</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW CREATOR MEDIA KIT / PROFILE MODAL */}
      {selectedInfluencer && (
        <Modal
          isOpen={!!selectedInfluencer}
          onClose={() => setSelectedInfluencer(null)}
          title="Creator Media Kit"
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            {/* Header Profile Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-[#11111A] border border-white/8">
              <img
                src={selectedInfluencer.profileImage}
                alt={selectedInfluencer.name}
                className="w-16 h-16 rounded-2xl object-cover border border-purple-500/30"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-bold text-white">{selectedInfluencer.name}</h3>
                  <CheckCircle2 className="w-4 h-4 text-pink-400" />
                </div>
                <p className="text-xs text-purple-300 font-medium">
                  {selectedInfluencer.category} Creator • {selectedInfluencer.location || 'Remote'}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-zinc-400">
                  {selectedInfluencer.socialLinks?.instagram && (
                    <a
                      href={selectedInfluencer.socialLinks.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-pink-400 flex items-center gap-1"
                    >
                      <Instagram className="w-3.5 h-3.5" /> Instagram
                    </a>
                  )}
                  {selectedInfluencer.socialLinks?.youtube && (
                    <a
                      href={selectedInfluencer.socialLinks.youtube}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-rose-400 flex items-center gap-1"
                    >
                      <Youtube className="w-3.5 h-3.5" /> YouTube
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/8">
                <span className="text-[11px] text-zinc-500 block">Total Reach</span>
                <span className="text-lg font-black text-white">
                  {selectedInfluencer.followers?.toLocaleString()}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/8">
                <span className="text-[11px] text-zinc-500 block">Avg Engagement</span>
                <span className="text-lg font-black text-pink-400">
                  {selectedInfluencer.engagementRate || '4.8'}%
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/8">
                <span className="text-[11px] text-zinc-500 block">Starting Base Rate</span>
                <span className="text-lg font-black text-emerald-400">
                  ${selectedInfluencer.startingPrice?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Bio & Content Guidelines */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">About Creator</h4>
              <p className="text-xs text-zinc-300 leading-relaxed bg-[#11111A] p-4 rounded-xl border border-white/8">
                {selectedInfluencer.bio || 'Professional content creator open to authentic sponsorships, product reviews, and brand ambassadorships.'}
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setSelectedInfluencer(null)}
                className="px-4 py-2 rounded-xl btn-secondary-glass text-xs font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const inf = selectedInfluencer;
                  setSelectedInfluencer(null);
                  handleOpenPitch(inf);
                }}
                className="px-5 py-2 rounded-xl btn-primary-gradient text-xs font-bold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Pitch</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* PITCH MODAL */}
      {pitchingInfluencer && (
        <Modal
          isOpen={!!pitchingInfluencer}
          onClose={() => setPitchingInfluencer(null)}
          title={`Pitch Proposal to ${pitchingInfluencer.name}`}
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleSendPitch} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-3">
              <img
                src={pitchingInfluencer.profileImage}
                alt={pitchingInfluencer.name}
                className="w-10 h-10 rounded-xl object-cover border border-purple-500/30"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-white font-bold text-xs block">{pitchingInfluencer.name}</span>
                <span className="text-[11px] text-zinc-400">
                  Starting rate: ${pitchingInfluencer.startingPrice || 500} • {pitchingInfluencer.category}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Link to Campaign <span className="text-pink-500">*</span>
              </label>
              {campaigns.length === 0 ? (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  You have no active campaigns. Please create a campaign first before pitching.
                </div>
              ) : (
                <select
                  value={pitchData.campaignId}
                  onChange={(e) => {
                    const cId = e.target.value;
                    const camp = campaigns.find((c) => (c._id || c.id) === cId);
                    setPitchData((prev) => ({
                      ...prev,
                      campaignId: cId,
                      deliverables: camp?.deliverables || prev.deliverables,
                      deadline: camp?.deadline || prev.deadline,
                      budget: camp?.budget || prev.budget,
                    }));
                  }}
                  className="w-full input-dark px-3 py-2 text-xs"
                  required
                >
                  <option value="">Select campaign...</option>
                  {campaigns.map((camp) => (
                    <option key={camp._id || camp.id} value={camp._id || camp.id}>
                      {camp.title} ({camp.category} - ${camp.budget})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Budget / Payout ($) <span className="text-pink-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={pitchData.budget}
                  onChange={(e) => setPitchData({ ...pitchData, budget: e.target.value })}
                  placeholder="e.g. 1200"
                  className="w-full input-dark px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Deadline <span className="text-pink-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={pitchData.deadline}
                  onChange={(e) => setPitchData({ ...pitchData, deadline: e.target.value })}
                  className="w-full input-dark px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Required Deliverables <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                required
                value={pitchData.deliverables}
                onChange={(e) => setPitchData({ ...pitchData, deliverables: e.target.value })}
                placeholder="e.g. 1 Instagram Reel (30-60s) + 2 Stories with trackable link"
                className="w-full input-dark px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Personalized Pitch Note
              </label>
              <textarea
                rows={3}
                value={pitchData.message}
                onChange={(e) => setPitchData({ ...pitchData, message: e.target.value })}
                placeholder="Hi! We love your style and think our upcoming product line is a natural fit for your audience..."
                className="w-full input-dark px-3 py-2 text-xs"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setPitchingInfluencer(null)}
                className="px-4 py-2 rounded-xl btn-secondary-glass text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || campaigns.length === 0}
                className="px-5 py-2 rounded-xl btn-primary-gradient text-xs font-bold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending Pitch...' : 'Send Formal Pitch'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default InfluencerDiscovery;
