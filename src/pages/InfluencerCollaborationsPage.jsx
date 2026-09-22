import React, { useState, useEffect } from 'react';
import {
  Handshake,
  Search,
  Filter,
  Building2,
} from 'lucide-react';
import { collaborationApi } from '../services/api.js';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { CollaborationDetailsModal } from '../components/CollaborationDetailsModal.jsx';
import { useToast } from '../context/ToastContext.jsx';

export function InfluencerCollaborationsPage() {
  const { addToast } = useToast();
  const [collaborations, setCollaborations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedCollab, setSelectedCollab] = useState(null);

  async function loadData() {
    try {
      setIsLoading(true);
      const res = await collaborationApi.getInfluencerCollaborations();
      if (res.success) setCollaborations(res.collaborations || []);
    } catch (err) {
      addToast(err.message || 'Error loading collaborations', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered = collaborations.filter((collab) => {
    const matchesStatus = statusFilter === 'All' || collab.status === statusFilter;
    const matchesSearch =
      (collab.brand?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (collab.campaign?.title || '').toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Collaborations</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your active and completed brand collaborations.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by brand or campaign..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

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
      </div>

      {/* Collaborations Table */}
      {isLoading ? (
        <div className="text-center py-12 text-xs text-slate-400">Loading collaborations...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200 p-6">
          <Handshake className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-800">No collaborations found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            When brands send collaboration pitches, they will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-medium">
                <tr>
                  <th className="py-3 pl-4">Brand</th>
                  <th className="py-3">Campaign</th>
                  <th className="py-3">Offer</th>
                  <th className="py-3">Deliverables</th>
                  <th className="py-3">Deadline</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Payout</th>
                  <th className="py-3 text-right pr-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id || item._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 pl-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                          <Building2 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900 block truncate max-w-[130px]">{item.brand?.name}</span>
                          <span className="text-[11px] text-slate-400 truncate max-w-[130px] block">{item.brand?.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3">
                      <span className="font-medium text-slate-800 block truncate max-w-[140px]">{item.campaign?.title}</span>
                      <span className="text-[11px] text-slate-500 truncate max-w-[140px] block">{item.campaign?.productName}</span>
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

export default InfluencerCollaborationsPage;
