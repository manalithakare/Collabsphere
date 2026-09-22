import mongoose from 'mongoose';
import { isUsingMongoose } from '../config/db.js';
import { BaseStoreModel } from './storeAdapter.js';

const CollaborationSchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true, index: true },
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    influencerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    collaborationType: { type: String, enum: ['Paid', 'Barter'], default: 'Paid' },
    budget: { type: Number, default: 0 },
    deliverables: { type: String, required: true },
    deadline: { type: String, required: true },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'In Progress', 'Completed'],
      default: 'Pending',
      index: true,
    },
  },
  { timestamps: true }
);

CollaborationSchema.index({ campaignId: 1, influencerId: 1 });

const MongooseCollaboration =
  mongoose.models.Collaboration || mongoose.model('Collaboration', CollaborationSchema);
const storeCollaboration = new BaseStoreModel('collaborations');

export const Collaboration = {
  find: (q) => (isUsingMongoose() ? MongooseCollaboration.find(q) : storeCollaboration.find(q)),
  findOne: (q) => (isUsingMongoose() ? MongooseCollaboration.findOne(q) : storeCollaboration.findOne(q)),
  findById: (id) => (isUsingMongoose() ? MongooseCollaboration.findById(id) : storeCollaboration.findById(id)),
  create: (data) => (isUsingMongoose() ? MongooseCollaboration.create(data) : storeCollaboration.create(data)),
  findByIdAndUpdate: (id, update, opt) =>
    isUsingMongoose()
      ? MongooseCollaboration.findByIdAndUpdate(id, update, opt)
      : storeCollaboration.findByIdAndUpdate(id, update, opt),
  findByIdAndDelete: (id) =>
    isUsingMongoose()
      ? MongooseCollaboration.findByIdAndDelete(id)
      : storeCollaboration.findByIdAndDelete(id),
  countDocuments: (q) =>
    isUsingMongoose() ? MongooseCollaboration.countDocuments(q) : storeCollaboration.countDocuments(q),
};

export default Collaboration;
