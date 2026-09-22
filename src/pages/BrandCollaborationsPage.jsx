import React, { useState, useEffect } from 'react';
import {
  Handshake,
  Search,
  Filter,
  Compass,
} from 'lucide-react';
import { collaborationApi, campaignApi } from '../services/api.js';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { CollaborationDetailsModal } from '../components/CollaborationDetailsModal.jsx';
import { useToast } from '../context/ToastContext.jsx';

export function BrandCollaborationsPage({ onNavigateToDiscovery }) {
  const { addToast } = useToast();
  const [collaborations, setCollaborations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [campaignFilter, setCampaignFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedCollab, setSelectedCollab] = useState(null);

  async function loadData() {
    try {
      setIsLoading(true);
      const [collabRes, campRes] = await Promise.all([
        collaborationApi.getBrandCollaborations(),
        campaignApi.getMyCampaigns(),
      ]);

      if (collabRes.success) setCollaborations(collabRes.collaborations || []);
      if (campRes.success) setCampaigns(campRes.campaigns || []);
    } catch (err) {
      addToast(err.message || 'Failed to load collaborations', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered = collaborations.filter((collab) => {
    const matchesStatus = statusFilter === 'All' || collab.status === statusFilter;
    const matchesCampaign =
      campaignFilter === 'All' || String(collab.campaignId) === String(campaignFilter);
    const matchesSearch =
      (collab.influencer?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (collab.campaign?.title || '').toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesCampaign && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Collaborations</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track collaboration requests, deliverables, and progress.
          </p>
        </div>
        <button
          onClick={onNavigateToDiscovery}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs self-start sm:self-auto"
        >
          <Compass className="w-4 h-4" />
          <span>Discover Creators</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search creator or campaign..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <select
              value={campaignFilter}
              onChange={(e) => setCampaignFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 max-w-[160px] truncate"
            >
              <option value="All">All Campaigns</option>
              {campaigns.map((c) => (
                <option key={c._id || c.id} value={c._id || c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Collaborations Table */}
      {isLoading ? (
        <div className="text-center py-12 text-xs text-slate-400">Loading collaborations...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200 p-6">
          <Handshake className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-800">No collaborations found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            {collaborations.length === 0
              ? 'You have not sent any pitches yet. Discover creators to pitch your campaigns.'
              : 'Try changing your filter options.'}
          </p>
          {collaborations.length === 0 && (
            <button
              onClick={onNavigateToDiscovery}
              className="mt-3 px-3.5 py-1.5 bg-indigo-600 text-white font-semibold text-xs rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Discover Creators
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[680px]">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-medium">
                <tr>
                  <th className="py-3 pl-4">Creator</th>
                  <th className="py-3">Campaign</th>
                  <th className="py-3">Offer</th>
                  <th className="py-3">Deliverables</th>
                  <th className="py-3">Deadline</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Payment</th>
                  <th className="py-3 text-right pr-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id || item._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 pl-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            item.influencer?.profileImage ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                          }
                          alt=""
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="font-semibold text-slate-900 block truncate max-w-[140px]">{item.influencer?.name}</span>
                          <span className="text-[11px] text-slate-400">
                            {item.influencer?.followers ? `${(item.influencer.followers / 1000).toFixed(0)}k followers` : ''}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3">
                      <span className="font-medium text-slate-800 block truncate max-w-[150px]">{item.campaign?.title}</span>
                      <span className="text-[11px] text-slate-500 truncate max-w-[150px] block">{item.campaign?.productName}</span>
                    </td>

                    <td className="py-3 font-semibold text-slate-900">${item.budget?.toLocaleString() || 0}</td>

                    <td className="py-3 max-w-xs text-slate-600 truncate">{item.deliverables}</td>

                    <td className="py-3 text-slate-500 whitespace-nowrap">{item.deadline}</td>

                    <td className="py-3">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="py-3">
                      {item.payment ? (
                        <StatusBadge status={item.payment.status} type="payment" />
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>

                    <td className="py-3 text-right pr-4">
                      <button
                        onClick={() => setSelectedCollab(item)}
                        className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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

export default BrandCollaborationsPage;
