import mongoose from 'mongoose';
import { isUsingMongoose } from '../config/db.js';
import { BaseStoreModel } from './storeAdapter.js';

const CampaignSchema = new mongoose.Schema(
  {
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    productName: { type: String, required: true },
    productDescription: { type: String, default: '' },
    category: { type: String, required: true, index: true },
    campaignType: { type: String, enum: ['Paid', 'Barter'], default: 'Paid' },
    budget: { type: Number, default: 0 },
    deliverables: { type: String, required: true },
    deadline: { type: String, required: true },
    targetAudience: { type: String, default: '' },
    platform: { type: String, enum: ['Instagram', 'YouTube', 'Both'], default: 'Instagram' },
    description: { type: String, default: '' },
    status: { type: String, enum: ['Draft', 'Active', 'Completed'], default: 'Active', index: true },
  },
  { timestamps: true }
);

const MongooseCampaign = mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);
const storeCampaign = new BaseStoreModel('campaigns');

export const Campaign = {
  find: (q) => (isUsingMongoose() ? MongooseCampaign.find(q) : storeCampaign.find(q)),
  findOne: (q) => (isUsingMongoose() ? MongooseCampaign.findOne(q) : storeCampaign.findOne(q)),
  findById: (id) => (isUsingMongoose() ? MongooseCampaign.findById(id) : storeCampaign.findById(id)),
  create: (data) => (isUsingMongoose() ? MongooseCampaign.create(data) : storeCampaign.create(data)),
  findByIdAndUpdate: (id, update, opt) =>
    isUsingMongoose()
      ? MongooseCampaign.findByIdAndUpdate(id, update, opt)
      : storeCampaign.findByIdAndUpdate(id, update, opt),
  findByIdAndDelete: (id) =>
    isUsingMongoose() ? MongooseCampaign.findByIdAndDelete(id) : storeCampaign.findByIdAndDelete(id),
  countDocuments: (q) =>
    isUsingMongoose() ? MongooseCampaign.countDocuments(q) : storeCampaign.countDocuments(q),
};

export default Campaign;
