import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Edit2,
  Trash2,
  Compass,
} from 'lucide-react';
import { campaignApi } from '../services/api.js';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { Modal } from '../components/Modal.jsx';
import { ConfirmationDialog } from '../components/ConfirmationDialog.jsx';
import { useToast } from '../context/ToastContext.jsx';

export function CampaignManagement({ onNavigateToDiscovery }) {
  const { addToast } = useToast();
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [deletingCampaign, setDeletingCampaign] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const initialFormState = {
    title: '',
    productName: '',
    productDescription: '',
    category: 'Beauty',
    campaignType: 'Paid',
    budget: '',
    deliverables: '',
    deadline: '',
    targetAudience: '',
    platform: 'Instagram',
    description: '',
    status: 'Active',
  };

  const [formData, setFormData] = useState(initialFormState);

  async function loadCampaigns() {
    try {
      setIsLoading(true);
      const res = await campaignApi.getMyCampaigns();
      if (res.success) {
        setCampaigns(res.campaigns || []);
      }
    } catch (err) {
      addToast(err.message || 'Failed to load campaigns', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCampaigns();
  }, []);

  function handleOpenCreate() {
    setEditingCampaign(null);
    setFormData(initialFormState);
    setIsCreateModalOpen(true);
  }

  function handleOpenEdit(camp) {
    setEditingCampaign(camp);
    setFormData({
      title: camp.title || '',
      productName: camp.productName || '',
      productDescription: camp.productDescription || '',
      category: camp.category || 'Beauty',
      campaignType: camp.campaignType || 'Paid',
      budget: camp.budget || '',
      deliverables: camp.deliverables || '',
      deadline: camp.deadline || '',
      targetAudience: camp.targetAudience || '',
      platform: camp.platform || 'Instagram',
      description: camp.description || '',
      status: camp.status || 'Active',
    });
    setIsCreateModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.title.trim() || !formData.productName.trim() || !formData.deliverables.trim() || !formData.deadline) {
      addToast('Please fill all mandatory fields (Title, Product, Deliverables, Deadline)', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        budget: Number(formData.budget) || 0,
      };

      if (editingCampaign) {
        const id = editingCampaign._id || editingCampaign.id;
        const res = await campaignApi.update(id, payload);
        if (res.success) {
          addToast('Campaign updated successfully!', 'success');
          setIsCreateModalOpen(false);
          loadCampaigns();
        }
      } else {
        const res = await campaignApi.create(payload);
        if (res.success) {
          addToast('New campaign published successfully!', 'success');
          setIsCreateModalOpen(false);
          loadCampaigns();
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to save campaign', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingCampaign) return;
    try {
      setIsSubmitting(true);
      const id = deletingCampaign._id || deletingCampaign.id;
      const res = await campaignApi.delete(id);
      if (res.success) {
        addToast('Campaign deleted successfully', 'info');
        setDeletingCampaign(null);
        loadCampaigns();
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete campaign', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch =
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campaigns</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Create and manage your marketing campaigns.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Campaign</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Categories</option>
              <option value="Beauty">Beauty</option>
              <option value="Fashion">Fashion</option>
              <option value="Fitness">Fitness</option>
              <option value="Tech">Tech</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Gaming">Gaming</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-xs text-slate-400">Loading campaigns...</div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200 p-6">
          <Megaphone className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-800">No campaigns found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            {campaigns.length === 0
              ? 'Get started by creating your first campaign.'
              : 'Try changing your search keywords or filters.'}
          </p>
          {campaigns.length === 0 && (
            <button
              onClick={handleOpenCreate}
              className="mt-3 px-3.5 py-1.5 bg-indigo-600 text-white font-semibold text-xs rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Campaign
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCampaigns.map((camp) => (
            <div
              key={camp._id || camp.id}
              className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {camp.category} • {camp.platform}
                  </span>
                  <StatusBadge status={camp.status} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">{camp.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Product: <span className="font-medium text-slate-700">{camp.productName}</span>
                  </p>
                </div>

                {camp.description && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                    {camp.description}
                  </p>
                )}

                <div className="space-y-1.5 pt-1 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Budget
                    </span>
                    <span className="font-semibold text-slate-900">${camp.budget?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Deadline
                    </span>
                    <span className="text-slate-700 font-medium">{camp.deadline}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-medium text-slate-400 block mb-0.5">
                    Deliverables:
                  </span>
                  <p className="text-xs text-slate-700 line-clamp-2">
                    {camp.deliverables}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onNavigateToDiscovery(camp._id || camp.id)}
                  className="flex-1 py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Discover Creators</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(camp)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit Campaign"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingCampaign(camp)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Campaign"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Campaign Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={editingCampaign ? 'Edit Campaign' : 'Create Campaign'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="md:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">
                Campaign Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Summer Skincare Product Launch"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                placeholder="e.g. Vitamin C Daily Serum"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 text-xs"
              >
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
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Collaboration Type</label>
              <select
                value={formData.campaignType}
                onChange={(e) => setFormData({ ...formData, campaignType: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 text-xs"
              >
                <option value="Paid">Paid Deal</option>
                <option value="Barter / Gifting">Product Gifting</option>
                <option value="Affiliate">Affiliate / Revenue Share</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Budget ($)</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="e.g. 2500"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Primary Platform</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 text-xs"
              >
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
                <option value="TikTok">TikTok</option>
                <option value="Twitter/X">Twitter/X</option>
                <option value="LinkedIn">LinkedIn</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Deadline <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">
                Deliverables <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.deliverables}
                onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                placeholder="e.g. 1 Instagram Reel (30-60s) + 2 Stories with link sticker"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">Target Audience</label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="e.g. Females 18-34 interested in skincare & wellness"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">Campaign Description</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Briefly describe the key messaging, hashtags, and guidelines..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 text-xs"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 shadow-xs"
            >
              {isSubmitting ? 'Saving...' : editingCampaign ? 'Update Campaign' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!deletingCampaign}
        onClose={() => setDeletingCampaign(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Campaign"
        message={`Are you sure you want to delete "${deletingCampaign?.title}"? This cannot be undone.`}
        confirmText="Delete"
        isDanger={true}
      />
    </div>
  );
}

export default CampaignManagement;
