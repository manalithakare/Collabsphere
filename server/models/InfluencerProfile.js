import mongoose from 'mongoose';
import { isUsingMongoose } from '../config/db.js';
import { BaseStoreModel } from './storeAdapter.js';

const InfluencerProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    bio: { type: String, default: '' },
    category: { type: String, required: true, index: true },
    followers: { type: Number, default: 0, index: true },
    engagementRate: { type: Number, default: 0 },
    location: { type: String, default: '', index: true },
    startingPrice: { type: Number, default: 0, index: true },
    instagram: { type: String, default: '' },
    youtube: { type: String, default: '' },
    otherLinks: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    platforms: { type: [String], default: ['Instagram'] },
  },
  { timestamps: true }
);

InfluencerProfileSchema.index({ category: 1, location: 1, followers: -1 });

const MongooseInfluencerProfile =
  mongoose.models.InfluencerProfile || mongoose.model('InfluencerProfile', InfluencerProfileSchema);
const storeInfluencerProfile = new BaseStoreModel('influencerProfiles');

export const InfluencerProfile = {
  find: (q) => (isUsingMongoose() ? MongooseInfluencerProfile.find(q) : storeInfluencerProfile.find(q)),
  findOne: (q) => (isUsingMongoose() ? MongooseInfluencerProfile.findOne(q) : storeInfluencerProfile.findOne(q)),
  findById: (id) => (isUsingMongoose() ? MongooseInfluencerProfile.findById(id) : storeInfluencerProfile.findById(id)),
  create: (data) => (isUsingMongoose() ? MongooseInfluencerProfile.create(data) : storeInfluencerProfile.create(data)),
  findOneAndUpdate: (q, update, opt) =>
    isUsingMongoose()
      ? MongooseInfluencerProfile.findOneAndUpdate(q, update, opt)
      : storeInfluencerProfile.findOneAndUpdate(q, update, opt),
  findByIdAndUpdate: (id, update, opt) =>
    isUsingMongoose()
      ? MongooseInfluencerProfile.findByIdAndUpdate(id, update, opt)
      : storeInfluencerProfile.findByIdAndUpdate(id, update, opt),
  findByIdAndDelete: (id) =>
    isUsingMongoose()
      ? MongooseInfluencerProfile.findByIdAndDelete(id)
      : storeInfluencerProfile.findByIdAndDelete(id),
  countDocuments: (q) =>
    isUsingMongoose() ? MongooseInfluencerProfile.countDocuments(q) : storeInfluencerProfile.countDocuments(q),
};

export default InfluencerProfile;
