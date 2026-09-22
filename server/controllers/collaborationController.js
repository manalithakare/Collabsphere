import { Collaboration } from '../models/Collaboration.js';
import { Campaign } from '../models/Campaign.js';
import { User } from '../models/User.js';
import { InfluencerProfile } from '../models/InfluencerProfile.js';
import { Payment } from '../models/Payment.js';
import { Notification } from '../models/Notification.js';

export async function sendCollaborationRequest(req, res) {
  try {
    const brandId = req.user.id;
    const { campaignId, influencerId, collaborationType = 'Paid', budget = 0, deliverables, deadline, message = '' } =
      req.body;

    if (!campaignId || !influencerId || !deliverables || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: campaignId, influencerId, deliverables, and deadline.',
      });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found.' });
    }

    if (String(campaign.brandId) !== brandId) {
      return res.status(403).json({ success: false, message: 'You can only send requests for your own campaigns.' });
    }

    let resolvedInfluencerId = influencerId;
    let influencer = await User.findById(influencerId);
    if (!influencer) {
      const profile = await InfluencerProfile.findById(influencerId);
      if (profile && profile.userId) {
        influencer = await User.findById(profile.userId);
        resolvedInfluencerId = String(profile.userId);
      }
    }
    if (!influencer || influencer.role !== 'Influencer') {
      return res.status(404).json({ success: false, message: 'Influencer user not found.' });
    }

    // Check duplicate pending or active requests
    const existingCollab = await Collaboration.findOne({
      campaignId,
      influencerId: resolvedInfluencerId,
      status: { $in: ['Pending', 'Accepted', 'In Progress'] },
    });

    if (existingCollab) {
      return res.status(400).json({
        success: false,
        message: `An active or pending collaboration request already exists for this influencer on '${campaign.title}' (Status: ${existingCollab.status}).`,
      });
    }

    const collaboration = await Collaboration.create({
      campaignId,
      brandId,
      influencerId: resolvedInfluencerId,
      collaborationType,
      budget: Number(budget) || 0,
      deliverables,
      deadline,
      message,
      status: 'Pending',
    });

    // If Paid, create pending escrow payment tracking record
    if (collaborationType === 'Paid' && Number(budget) > 0) {
      const existingPay = await Payment.findOne({ collaborationId: String(collaboration._id || collaboration.id) });
      if (!existingPay) {
        await Payment.create({
          collaborationId: String(collaboration._id || collaboration.id),
          amount: Number(budget) || 0,
          status: 'Pending',
        });
      }
    }

    const brandName = req.user.name || 'A Brand';

    // Notify Influencer
    await Notification.create({
      userId: resolvedInfluencerId,
      message: `New collaboration request from ${brandName} for campaign "${campaign.title}" ($${budget || 0})`,
      type: 'request',
      relatedId: String(collaboration._id || collaboration.id),
    });

    return res.status(201).json({
      success: true,
      message: 'Collaboration request sent successfully.',
      collaboration,
    });
  } catch (error) {
    console.error('Send collaboration request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error sending collaboration request.',
      error: error.message,
    });
  }
}

export async function getBrandCollaborations(req, res) {
  try {
    const brandId = req.user.id;
    const { status, campaignId } = req.query;

    const query = { brandId };
    if (status && status !== 'All') {
      query.status = status;
    }
    if (campaignId && campaignId !== 'All') {
      query.campaignId = campaignId;
    }

    const collabs = await Collaboration.find(query);
    const campaigns = await Campaign.find({ brandId });
    const users = await User.find({ role: 'Influencer' });
    const profiles = await InfluencerProfile.find({});
    const payments = await Payment.find({});

    const campaignMap = new Map(campaigns.map((c) => [String(c._id || c.id), c]));
    const userMap = new Map(users.map((u) => [String(u._id || u.id), u]));
    const profileMap = new Map(profiles.map((p) => [String(p.userId), p]));
    const paymentMap = new Map(payments.map((p) => [String(p.collaborationId), p]));

    const populated = collabs.map((c) => {
      const camp = campaignMap.get(String(c.campaignId)) || {};
      const infUser = userMap.get(String(c.influencerId)) || {};
      const infProf = profileMap.get(String(c.influencerId)) || {};
      const pay = paymentMap.get(String(c._id || c.id)) || null;

      return {
        ...c,
        id: c._id || c.id,
        campaign: {
          id: camp._id || camp.id,
          title: camp.title || 'Campaign',
          productName: camp.productName || '',
          category: camp.category || '',
          platform: camp.platform || 'Instagram',
        },
        influencer: {
          id: infUser._id || infUser.id,
          name: infUser.name || 'Creator',
          email: infUser.email || '',
          profileImage: infProf.profileImage || '',
          category: infProf.category || '',
          followers: infProf.followers || 0,
        },
        payment: pay
          ? {
              id: pay._id || pay.id,
              amount: pay.amount,
              status: pay.status,
              paidAt: pay.paidAt,
            }
          : null,
      };
    });

    populated.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.json({
      success: true,
      collaborations: populated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving brand collaborations.',
      error: error.message,
    });
  }
}

export async function getInfluencerCollaborations(req, res) {
  try {
    const influencerId = req.user.id;
    const { status } = req.query;

    const query = { influencerId };
    if (status && status !== 'All') {
      query.status = status;
    }

    const collabs = await Collaboration.find(query);
    const campaigns = await Campaign.find({});
    const brands = await User.find({ role: 'Brand' });
    const payments = await Payment.find({});

    const campaignMap = new Map(campaigns.map((c) => [String(c._id || c.id), c]));
    const brandMap = new Map(brands.map((b) => [String(b._id || b.id), b]));
    const paymentMap = new Map(payments.map((p) => [String(p.collaborationId), p]));

    const populated = collabs.map((c) => {
      const camp = campaignMap.get(String(c.campaignId)) || {};
      const brand = brandMap.get(String(c.brandId)) || {};
      const pay = paymentMap.get(String(c._id || c.id)) || null;

      return {
        ...c,
        id: c._id || c.id,
        campaign: {
          id: camp._id || camp.id,
          title: camp.title || 'Campaign',
          productName: camp.productName || '',
          productDescription: camp.productDescription || '',
          category: camp.category || '',
          platform: camp.platform || 'Instagram',
        },
        brand: {
          id: brand._id || brand.id,
          name: brand.name || 'Brand Partner',
          email: brand.email || '',
        },
        payment: pay
          ? {
              id: pay._id || pay.id,
              amount: pay.amount,
              status: pay.status,
              paidAt: pay.paidAt,
            }
          : null,
      };
    });

    populated.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.json({
      success: true,
      collaborations: populated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving influencer collaborations.',
      error: error.message,
    });
  }
}

export async function getCollaborationById(req, res) {
  try {
    const { id } = req.params;
    const collab = await Collaboration.findById(id);

    if (!collab) {
      return res.status(404).json({ success: false, message: 'Collaboration record not found.' });
    }

    // Role check: Only the involved Brand or Influencer can access
    const isOwner = String(collab.brandId) === req.user.id || String(collab.influencerId) === req.user.id;
    if (!isOwner) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this collaboration.' });
    }

    const campaign = await Campaign.findById(collab.campaignId);
    const brand = await User.findById(collab.brandId);
    const influencer = await User.findById(collab.influencerId);
    const influencerProfile = await InfluencerProfile.findOne({ userId: collab.influencerId });
    const payment = await Payment.findOne({ collaborationId: String(collab._id || collab.id) });

    return res.json({
      success: true,
      collaboration: {
        ...collab,
        id: collab._id || collab.id,
        campaign,
        brand: brand ? { id: brand._id || brand.id, name: brand.name, email: brand.email } : null,
        influencer: influencer
          ? {
              id: influencer._id || influencer.id,
              name: influencer.name,
              email: influencer.email,
              profile: influencerProfile,
            }
          : null,
        payment,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving collaboration details.',
      error: error.message,
    });
  }
}

export async function updateCollaborationStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const collab = await Collaboration.findById(id);
    if (!collab) {
      return res.status(404).json({ success: false, message: 'Collaboration record not found.' });
    }

    const isBrand = String(collab.brandId) === userId;
    const isInfluencer = String(collab.influencerId) === userId;

    if (!isBrand && !isInfluencer) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this collaboration.' });
    }

    const validStatuses = ['Pending', 'Accepted', 'Rejected', 'In Progress', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid collaboration status.' });
    }

    // Role-specific transition rules
    if (collab.status === 'Pending') {
      if (!isInfluencer && status !== 'Rejected') {
        return res.status(403).json({
          success: false,
          message: 'Only the requested influencer can Accept or Reject this pending collaboration.',
        });
      }
    }

    const updated = await Collaboration.findByIdAndUpdate(id, { status }, { new: true });
    const campaign = await Campaign.findById(collab.campaignId);

    // If accepted, ensure a Payment record exists if Paid
    if (status === 'Accepted' && collab.collaborationType === 'Paid') {
      const existingPay = await Payment.findOne({ collaborationId: id });
      if (!existingPay) {
        await Payment.create({
          collaborationId: id,
          amount: collab.budget || 0,
          status: 'Pending',
        });
      }
    }

    // Send notifications based on status change
    const campaignTitle = campaign ? campaign.title : 'Collaboration';

    if (status === 'Accepted') {
      await Notification.create({
        userId: collab.brandId,
        message: `${req.user.name || 'Influencer'} accepted your collaboration request for "${campaignTitle}".`,
        type: 'accepted',
        relatedId: id,
      });
    } else if (status === 'Rejected') {
      await Notification.create({
        userId: collab.brandId,
        message: `${req.user.name || 'Influencer'} declined the collaboration request for "${campaignTitle}".`,
        type: 'rejected',
        relatedId: id,
      });
    } else if (status === 'In Progress') {
      const recipientId = isBrand ? collab.influencerId : collab.brandId;
      await Notification.create({
        userId: recipientId,
        message: `Collaboration for "${campaignTitle}" is now marked as In Progress. Deliverables underway!`,
        type: 'status_update',
        relatedId: id,
      });
    } else if (status === 'Completed') {
      const recipientId = isBrand ? collab.influencerId : collab.brandId;
      await Notification.create({
        userId: recipientId,
        message: `Collaboration for "${campaignTitle}" has been marked as Completed! Great work!`,
        type: 'status_update',
        relatedId: id,
      });
    }

    return res.json({
      success: true,
      message: `Collaboration status updated to ${status}.`,
      collaboration: updated,
    });
  } catch (error) {
    console.error('Update collaboration status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating collaboration status.',
      error: error.message,
    });
  }
}
