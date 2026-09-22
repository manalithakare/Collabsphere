import { Campaign } from '../models/Campaign.js';
import { Collaboration } from '../models/Collaboration.js';

export async function createCampaign(req, res) {
  try {
    const {
      title,
      productName,
      productDescription = '',
      category,
      campaignType = 'Paid',
      budget = 0,
      deliverables,
      deadline,
      targetAudience = '',
      platform = 'Instagram',
      description = '',
      status = 'Active',
    } = req.body;

    if (!title || !productName || !category || !deliverables || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, product name, category, deliverables, and deadline.',
      });
    }

    const campaign = await Campaign.create({
      brandId: req.user.id,
      title: title.trim(),
      productName: productName.trim(),
      productDescription,
      category,
      campaignType,
      budget: Number(budget) || 0,
      deliverables,
      deadline,
      targetAudience,
      platform,
      description,
      status,
    });

    return res.status(201).json({
      success: true,
      message: 'Campaign created successfully.',
      campaign,
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error creating campaign.',
      error: error.message,
    });
  }
}

export async function getBrandCampaigns(req, res) {
  try {
    const brandId = req.user.id;
    const { search, category, status, platform, campaignType } = req.query;

    const query = { brandId };

    if (category && category !== 'All') {
      query.category = category;
    }
    if (status && status !== 'All') {
      query.status = status;
    }
    if (platform && platform !== 'All') {
      query.platform = platform;
    }
    if (campaignType && campaignType !== 'All') {
      query.campaignType = campaignType;
    }

    let campaigns = await Campaign.find(query);

    if (search && search.trim() !== '') {
      const term = search.toLowerCase().trim();
      campaigns = campaigns.filter(
        (c) =>
          c.title?.toLowerCase().includes(term) ||
          c.productName?.toLowerCase().includes(term) ||
          c.category?.toLowerCase().includes(term)
      );
    }

    // Sort by newest first
    campaigns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Compute stats
    const allBrandCampaigns = await Campaign.find({ brandId });
    const stats = {
      total: allBrandCampaigns.length,
      active: allBrandCampaigns.filter((c) => c.status === 'Active').length,
      draft: allBrandCampaigns.filter((c) => c.status === 'Draft').length,
      completed: allBrandCampaigns.filter((c) => c.status === 'Completed').length,
      totalBudget: allBrandCampaigns.reduce((acc, c) => acc + (Number(c.budget) || 0), 0),
    };

    return res.json({
      success: true,
      campaigns,
      stats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving campaigns.',
      error: error.message,
    });
  }
}

export async function getCampaignById(req, res) {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found.',
      });
    }

    // Get active collaborations for this campaign
    const collaborations = await Collaboration.find({ campaignId: id });

    return res.json({
      success: true,
      campaign,
      collaborations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving campaign details.',
      error: error.message,
    });
  }
}

export async function updateCampaign(req, res) {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found.',
      });
    }

    if (String(campaign.brandId) !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this campaign.',
      });
    }

    const updated = await Campaign.findByIdAndUpdate(id, req.body, { new: true });

    return res.json({
      success: true,
      message: 'Campaign updated successfully.',
      campaign: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error updating campaign.',
      error: error.message,
    });
  }
}

export async function deleteCampaign(req, res) {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found.',
      });
    }

    if (String(campaign.brandId) !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this campaign.',
      });
    }

    await Campaign.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: 'Campaign deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error deleting campaign.',
      error: error.message,
    });
  }
}

export async function updateCampaignStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Draft', 'Active', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'Draft', 'Active', or 'Completed'.",
      });
    }

    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found.' });
    }

    if (String(campaign.brandId) !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to change status.' });
    }

    const updated = await Campaign.findByIdAndUpdate(id, { status }, { new: true });

    return res.json({
      success: true,
      message: `Campaign status changed to ${status}.`,
      campaign: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error updating status.',
      error: error.message,
    });
  }
}
