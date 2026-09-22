import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Instagram,
  Youtube,
  Save,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { influencerApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export function InfluencerProfileEdit() {
  const { user, influencerProfile, refreshUser, updateInfluencerProfileState } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: influencerProfile?.bio || '',
    category: influencerProfile?.category || 'Tech',
    location: influencerProfile?.location || '',
    followers: influencerProfile?.followers || '',
    engagementRate: influencerProfile?.engagementRate || '',
    startingPrice: influencerProfile?.startingPrice || '',
    instagram: influencerProfile?.instagram || '',
    youtube: influencerProfile?.youtube || '',
    otherLinks: influencerProfile?.otherLinks || '',
    profileImage: influencerProfile?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces',
    platforms: influencerProfile?.platforms || ['Instagram'],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (influencerProfile || user) {
      setFormData({
        name: user?.name || '',
        bio: influencerProfile?.bio || '',
        category: influencerProfile?.category || 'Tech',
        location: influencerProfile?.location || '',
        followers: influencerProfile?.followers || '',
        engagementRate: influencerProfile?.engagementRate || '',
        startingPrice: influencerProfile?.startingPrice || '',
        instagram: influencerProfile?.instagram || '',
        youtube: influencerProfile?.youtube || '',
        otherLinks: influencerProfile?.otherLinks || '',
        profileImage:
          influencerProfile?.profileImage ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces',
        platforms: influencerProfile?.platforms || ['Instagram'],
      });
    }
  }, [influencerProfile, user]);

  function handlePlatformToggle(platformName) {
    const exists = formData.platforms.includes(platformName);
    const updated = exists
      ? formData.platforms.filter((p) => p !== platformName)
      : [...formData.platforms, platformName];
    setFormData({ ...formData, platforms: updated.length ? updated : [platformName] });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await influencerApi.updateMyProfile(formData);
      if (res.success) {
        addToast('Profile updated successfully!', 'success');
        updateInfluencerProfileState(res.profile);
        refreshUser();
      }
    } catch (err) {
      addToast(err.message || 'Error updating profile', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your creator profile and media kit details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2.5">
              Creator Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Creator Name / Handle</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rhea Sen"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Primary Niche</label>
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
                  <option value="Gaming">Gaming</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">Bio / Media Kit Summary</label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell brands about your content style, audience demographics, or previous work..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Profile Photo (URL)</label>
                <input
                  type="url"
                  value={formData.profileImage}
                  onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Location / Base City</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Bengaluru, India"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Total Followers</label>
                <input
                  type="number"
                  min="0"
                  value={formData.followers}
                  onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
                  placeholder="e.g. 150000"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Engagement Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.engagementRate}
                  onChange={(e) => setFormData({ ...formData, engagementRate: e.target.value })}
                  placeholder="e.g. 4.8"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Base Rate ($)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.startingPrice}
                  onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                  placeholder="e.g. 1500"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Active Platforms</label>
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => handlePlatformToggle('Instagram')}
                    className={`px-3 py-1.5 rounded-lg border font-medium text-xs flex items-center gap-1.5 transition-colors ${
                      formData.platforms.includes('Instagram')
                        ? 'bg-pink-50 border-pink-300 text-pink-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Instagram</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePlatformToggle('YouTube')}
                    className={`px-3 py-1.5 rounded-lg border font-medium text-xs flex items-center gap-1.5 transition-colors ${
                      formData.platforms.includes('YouTube')
                        ? 'bg-red-50 border-red-300 text-red-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <Youtube className="w-3.5 h-3.5" />
                    <span>YouTube</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Instagram URL</label>
                <input
                  type="url"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="https://instagram.com/yourhandle"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">YouTube URL</label>
                <input
                  type="url"
                  value={formData.youtube}
                  onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                  placeholder="https://youtube.com/@channel"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Card */}
        <div className="space-y-3">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-400">
            <Eye className="w-3.5 h-3.5" />
            <span>Card Preview</span>
          </div>

          <div className="rounded-xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-slate-100 to-indigo-50/50 p-3 relative">
              <div className="absolute -bottom-5 left-3">
                <img
                  src={formData.profileImage}
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-xs"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="pt-7 px-3.5 pb-3.5 space-y-2">
              <div className="flex items-start justify-between gap-1">
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className="text-sm font-semibold text-slate-900">{formData.name || 'Your Name'}</h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  </div>
                  <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded inline-block mt-0.5">
                    {formData.category}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">Base Rate</span>
                  <span className="text-xs font-semibold text-slate-900">${formData.startingPrice || 0}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">
                {formData.bio || 'Your bio will appear here to prospective brand partners.'}
              </p>

              {formData.location && (
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <MapPin className="w-3 h-3" />
                  <span>{formData.location}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-lg text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Followers</span>
                  <span className="font-semibold text-slate-900">
                    {formData.followers ? Number(formData.followers).toLocaleString() : '0'}
                  </span>
                </div>
                <div className="border-l border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-medium">Engagement</span>
                  <span className="font-semibold text-emerald-600">{formData.engagementRate || 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfluencerProfileEdit;
