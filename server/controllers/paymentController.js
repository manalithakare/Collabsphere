import { Payment } from '../models/Payment.js';
import { Collaboration } from '../models/Collaboration.js';
import { Campaign } from '../models/Campaign.js';
import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';

export async function getPayments(req, res) {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    // Fetch relevant collaborations
    const collabQuery = role === 'Brand' ? { brandId: userId } : { influencerId: userId };
    const collabs = await Collaboration.find(collabQuery);
    const collabIds = collabs.map((c) => String(c._id || c.id));

    const payments = await Payment.find({ collaborationId: { $in: collabIds } });
    const campaigns = await Campaign.find({});
    const users = await User.find({});

    const campaignMap = new Map(campaigns.map((c) => [String(c._id || c.id), c]));
    const userMap = new Map(users.map((u) => [String(u._id || u.id), u]));
    const collabMap = new Map(collabs.map((c) => [String(c._id || c.id), c]));

    const populated = payments.map((p) => {
      const collab = collabMap.get(String(p.collaborationId)) || {};
      const campaign = campaignMap.get(String(collab.campaignId)) || {};
      const brand = userMap.get(String(collab.brandId)) || {};
      const influencer = userMap.get(String(collab.influencerId)) || {};

      return {
        id: p._id || p.id,
        _id: p._id || p.id,
        collaborationId: p.collaborationId,
        amount: Number(p.amount) || 0,
        status: p.status,
        paidAt: p.paidAt,
        createdAt: p.createdAt,
        collaboration: {
          id: collab._id || collab.id,
          deliverables: collab.deliverables || '',
          deadline: collab.deadline || '',
          status: collab.status || '',
        },
        campaign: {
          title: campaign.title || 'Campaign',
          productName: campaign.productName || '',
        },
        counterparty:
          role === 'Brand'
            ? { name: influencer.name || 'Influencer', email: influencer.email }
            : { name: brand.name || 'Brand', email: brand.email },
      };
    });

    populated.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Calculate totals
    const totalAmount = populated.reduce((acc, p) => acc + p.amount, 0);
    const paidAmount = populated.filter((p) => p.status === 'Paid').reduce((acc, p) => acc + p.amount, 0);
    const pendingAmount = populated.filter((p) => p.status === 'Pending').reduce((acc, p) => acc + p.amount, 0);

    return res.json({
      success: true,
      payments: populated,
      summary: {
        totalAmount,
        paidAmount,
        pendingAmount,
        totalTransactions: populated.length,
      },
    });
  } catch (error) {
    console.error('Get payments error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving payments.',
      error: error.message,
    });
  }
}

export async function markPaymentAsPaid(req, res) {
  try {
    const { id } = req.params; // payment id or collaborationId
    const brandId = req.user.id;

    let payment = await Payment.findById(id);
    if (!payment) {
      payment = await Payment.findOne({ collaborationId: id });
    }

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }

    const collab = await Collaboration.findById(payment.collaborationId);
    if (!collab) {
      return res.status(404).json({ success: false, message: 'Associated collaboration not found.' });
    }

    // Verify ownership: only the Brand can mark payment as paid
    if (String(collab.brandId) !== brandId) {
      return res.status(403).json({
        success: false,
        message: 'Only the sponsoring Brand can mark this payment as paid.',
      });
    }

    const updated = await Payment.findByIdAndUpdate(
      payment._id || payment.id,
      {
        status: 'Paid',
        paidAt: new Date(),
      },
      { new: true }
    );

    const campaign = await Campaign.findById(collab.campaignId);

    // Notify Influencer of payment receipt
    await Notification.create({
      userId: collab.influencerId,
      message: `Payment of $${payment.amount} for "${campaign ? campaign.title : 'campaign'}" has been marked as Paid by ${req.user.name || 'Brand'}!`,
      type: 'payment_update',
      relatedId: String(updated._id || updated.id),
    });

    return res.json({
      success: true,
      message: 'Payment has been successfully marked as Paid.',
      payment: updated,
    });
  } catch (error) {
    console.error('Mark payment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error marking payment as paid.',
      error: error.message,
    });
  }
}
