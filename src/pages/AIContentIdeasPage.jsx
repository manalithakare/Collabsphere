import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Bookmark,
  Trash2,
  RefreshCw,
  Zap,
  Lightbulb,
  FileText,
} from 'lucide-react';
import { aiApi } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';

export function AIContentIdeasPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'saved'

  // Generator inputs
  const [formData, setFormData] = useState({
    productName: 'HydraGlow 15% Vitamin C Serum',
    productDescription: 'Gentle radiance serum that fades dark spots and strengthens the skin barrier.',
    targetAudience: 'Skincare enthusiasts aged 18-35 dealing with dullness.',
    platform: 'Instagram',
    campaignType: 'Product Launch',
    tone: 'Educational & Honest',
    contentType: 'Reels / Shorts',
  });

  const [ideas, setIdeas] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Saved ideas
  const [savedIdeas, setSavedIdeas] = useState([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);

  async function loadSavedIdeas() {
    try {
      setIsLoadingSaved(true);
      const res = await aiApi.getSavedIdeas();
      if (res.success) {
        setSavedIdeas(res.savedIdeas || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingSaved(false);
    }
  }

  useEffect(() => {
    if (activeTab === 'saved') {
      loadSavedIdeas();
    }
  }, [activeTab]);

  async function handleGenerate(e) {
    if (e) e.preventDefault();
    if (!formData.productName.trim()) {
      addToast('Please enter a product name', 'error');
      return;
    }

    try {
      setIsGenerating(true);
      const res = await aiApi.generateIdeas(formData);
      if (res.success && res.ideas) {
        setIdeas(res.ideas);
        addToast('Generated 3 content briefs!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to generate ideas', 'error');
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSaveIdea(idea) {
    try {
      const res = await aiApi.saveIdea({
        productName: formData.productName,
        inputData: formData,
        idea,
      });
      if (res.success) {
        addToast('Idea saved to library!', 'success');
        if (activeTab === 'saved') loadSavedIdeas();
      }
    } catch (err) {
      addToast(err.message || 'Error saving idea', 'error');
    }
  }

  async function handleDeleteSaved(id) {
    try {
      await aiApi.deleteSavedIdea(id);
      addToast('Saved idea removed', 'info');
      setSavedIdeas((prev) => prev.filter((item) => (item._id || item.id) !== id));
    } catch (err) {
      addToast(err.message || 'Failed to delete idea', 'error');
    }
  }

  function handleCopy(text, identifier) {
    navigator.clipboard.writeText(text);
    setCopiedId(identifier);
    addToast('Copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2500);
  }

  function handlePreloadExample(type) {
    if (type === 'skincare') {
      setFormData({
        productName: 'HydraGlow 15% Vitamin C Serum',
        productDescription: 'Gentle radiance serum that fades dark spots and strengthens the skin barrier.',
        targetAudience: 'Skincare enthusiasts aged 18-35 dealing with dullness.',
        platform: 'Instagram',
        campaignType: 'Product Launch',
        tone: 'Educational & Honest',
        contentType: 'Reels / Shorts',
      });
    } else if (type === 'protein') {
      setFormData({
        productName: 'Volt Pure Whey Isolate',
        productDescription: '27g ultra-filtered protein per scoop with digestive enzymes and zero added sugar.',
        targetAudience: 'Gym-goers and fitness enthusiasts hitting daily protein targets.',
        platform: 'Instagram',
        campaignType: 'Brand Awareness',
        tone: 'High Energy & Inspiring',
        contentType: 'Reels / Shorts',
      });
    } else if (type === 'desk') {
      setFormData({
        productName: 'ErgoLift Pro Desk Mat',
        productDescription: 'Waterproof vegan leather desk mat with magnetic modular cable organizers.',
        targetAudience: 'Remote workers, designers, and software engineers.',
        platform: 'YouTube',
        campaignType: 'Product Launch',
        tone: 'Minimalist & Aesthetic',
        contentType: 'Reels / Shorts',
      });
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Ideas</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Generate high-converting creator briefs and concepts with AI.
          </p>
        </div>

        {/* Tab Switch */}
        <div className="flex p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'generator' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Generator
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'saved' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Saved Library
          </button>
        </div>
      </div>

      {activeTab === 'generator' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Form (5 cols) */}
          <div className="lg:col-span-5 p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-semibold text-slate-900">Campaign Details</h3>
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <span>Presets:</span>
                <button
                  type="button"
                  onClick={() => handlePreloadExample('skincare')}
                  className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                >
                  Beauty
                </button>
                <button
                  type="button"
                  onClick={() => handlePreloadExample('protein')}
                  className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                >
                  Fitness
                </button>
                <button
                  type="button"
                  onClick={() => handlePreloadExample('desk')}
                  className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                >
                  Tech
                </button>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="e.g. HydraGlow Vitamin C Serum"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Product Description & Benefits
                </label>
                <textarea
                  rows={2}
                  value={formData.productDescription}
                  onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                  placeholder="What problem does it solve? Key ingredients or features..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Target Audience</label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  placeholder="e.g. Skincare enthusiasts 18-35"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Platform</label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 text-xs"
                  >
                    <option value="Instagram">Instagram Reels</option>
                    <option value="YouTube">YouTube Shorts</option>
                    <option value="TikTok">TikTok</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Goal</label>
                  <select
                    value={formData.campaignType}
                    onChange={(e) => setFormData({ ...formData, campaignType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 text-xs"
                  >
                    <option value="Product Launch">Product Launch</option>
                    <option value="Brand Awareness">Brand Awareness</option>
                    <option value="Discounts / Sales">Discount / Sale</option>
                    <option value="Tutorial / Education">How-To Tutorial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tone</label>
                  <select
                    value={formData.tone}
                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 text-xs"
                  >
                    <option value="Educational & Honest">Educational & Honest</option>
                    <option value="High Energy & Inspiring">High Energy</option>
                    <option value="Humorous & Relatable">Relatable</option>
                    <option value="Minimalist & Aesthetic">Minimalist</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Format</label>
                  <select
                    value={formData.contentType}
                    onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 text-xs"
                  >
                    <option value="Reels / Shorts">Short Video</option>
                    <option value="Unboxing & First Impression">Unboxing</option>
                    <option value="Day In The Life Integration">Day in the Life</option>
                    <option value="Myth Buster / Comparison">Comparison</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 mt-3"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating Ideas...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate AI Briefs</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Output (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {isGenerating ? (
              <div className="p-12 rounded-xl bg-white border border-slate-200/80 text-center space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <h4 className="text-sm font-semibold text-slate-900">Crafting Content Briefs</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Generating hooks, talking points, scripts, and captions for {formData.productName}...
                </p>
              </div>
            ) : ideas.length === 0 ? (
              <div className="p-12 rounded-xl bg-white border border-dashed border-slate-200 text-center space-y-3">
                <Lightbulb className="w-8 h-8 text-slate-300 mx-auto" />
                <h4 className="text-sm font-semibold text-slate-800">No content ideas generated yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Fill in your product details on the left and click "Generate AI Briefs".
                </p>
                <button
                  onClick={() => handleGenerate()}
                  className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-colors"
                >
                  Generate Sample Briefs
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    Generated Briefs ({ideas.length})
                  </span>
                  <button
                    onClick={() => handleGenerate()}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Regenerate</span>
                  </button>
                </div>

                {ideas.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-3 text-xs"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
                          Concept #{idx + 1}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-900 mt-1">{item.title}</h4>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleSaveIdea(item)}
                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
                          title="Save to Library"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleCopy(
                              `Title: ${item.title}\n\nHook: ${item.hook}\n\nConcept: ${item.concept}\n\nScript:\n${item.script}\n\nCTA: ${item.callToAction}\n\nCaption:\n${item.caption}\n\nHashtags:\n${item.hashtags?.join(' ')}`,
                              `all-${idx}`
                            )
                          }
                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
                          title="Copy Full Brief"
                        >
                          {copiedId === `all-${idx}` ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Hook Box */}
                    <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-lg space-y-0.5">
                      <span className="text-[10px] font-semibold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-600" /> 3-Second Hook
                      </span>
                      <p className="font-medium text-amber-950 text-xs leading-relaxed">{item.hook}</p>
                    </div>

                    {/* Concept */}
                    <div>
                      <span className="text-[11px] font-medium text-slate-400 block mb-0.5">
                        Creative Concept
                      </span>
                      <p className="text-slate-700 leading-relaxed font-normal">{item.concept}</p>
                    </div>

                    {/* Script Breakdown */}
                    <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <FileText className="w-3 h-3 text-indigo-600" /> Creator Script
                        </span>
                        <button
                          onClick={() => handleCopy(item.script, `script-${idx}`)}
                          className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold"
                        >
                          {copiedId === `script-${idx}` ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <p className="text-slate-700 whitespace-pre-line leading-relaxed font-mono text-[11px]">
                        {item.script}
                      </p>
                    </div>

                    {/* Call to Action */}
                    <div className="flex items-center justify-between pt-0.5">
                      <div>
                        <span className="text-[10px] font-medium text-slate-400 block">
                          Call to Action
                        </span>
                        <span className="font-semibold text-slate-900">{item.callToAction}</span>
                      </div>
                    </div>

                    {/* Caption & Hashtags */}
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-slate-400">
                          Suggested Caption
                        </span>
                        <button
                          onClick={() => handleCopy(item.caption, `cap-${idx}`)}
                          className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold"
                        >
                          {copiedId === `cap-${idx}` ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <p className="text-slate-600 italic bg-slate-50 p-2 rounded-lg">{item.caption}</p>

                      {item.hashtags && item.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {item.hashtags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded font-medium"
                            >
                              {tag.startsWith('#') ? tag : `#${tag}`}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Saved Library View */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Saved Creator Briefs</h3>
              <p className="text-xs text-slate-400">Concepts saved for your active campaigns</p>
            </div>
            <button
              onClick={loadSavedIdeas}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Refresh
            </button>
          </div>

          {isLoadingSaved ? (
            <div className="text-center py-12 text-xs text-slate-400">Loading saved ideas...</div>
          ) : savedIdeas.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200 p-6">
              <Bookmark className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-slate-800">No saved ideas</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Save ideas using the bookmark icon in the generator.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedIdeas.map((saved) => {
                const idea = saved.generatedIdeas?.[0] || {};
                const id = saved._id || saved.id;

                return (
                  <div
                    key={id}
                    className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-2.5 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
                          {saved.productName}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-900 mt-1">{idea.title}</h4>
                      </div>
                      <button
                        onClick={() => handleDeleteSaved(id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Delete Idea"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-2 bg-amber-50 rounded-lg text-amber-900 font-medium">
                      Hook: {idea.hook}
                    </div>

                    <p className="text-slate-600 line-clamp-2">{idea.concept}</p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        Saved {new Date(saved.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() =>
                          handleCopy(
                            `Title: ${idea.title}\nHook: ${idea.hook}\nConcept: ${idea.concept}\nScript: ${idea.script}\nCTA: ${idea.callToAction}`,
                            `saved-${id}`
                          )
                        }
                        className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      >
                        {copiedId === `saved-${id}` ? 'Copied' : 'Copy Brief'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AIContentIdeasPage;
