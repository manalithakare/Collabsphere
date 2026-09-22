import mongoose from 'mongoose';
import { isUsingMongoose } from '../config/db.js';
import { BaseStoreModel } from './storeAdapter.js';

const AIContentIdeaSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    productName: { type: String, required: true },
    inputData: { type: Object, default: {} },
    generatedIdeas: { type: Array, default: [] },
  },
  { timestamps: true }
);

const MongooseAIContentIdea =
  mongoose.models.AIContentIdea || mongoose.model('AIContentIdea', AIContentIdeaSchema);
const storeAIContentIdea = new BaseStoreModel('aiContentIdeas');

export const AIContentIdea = {
  find: (q) => (isUsingMongoose() ? MongooseAIContentIdea.find(q) : storeAIContentIdea.find(q)),
  findOne: (q) => (isUsingMongoose() ? MongooseAIContentIdea.findOne(q) : storeAIContentIdea.findOne(q)),
  findById: (id) => (isUsingMongoose() ? MongooseAIContentIdea.findById(id) : storeAIContentIdea.findById(id)),
  create: (data) => (isUsingMongoose() ? MongooseAIContentIdea.create(data) : storeAIContentIdea.create(data)),
  findByIdAndDelete: (id) =>
    isUsingMongoose()
      ? MongooseAIContentIdea.findByIdAndDelete(id)
      : storeAIContentIdea.findByIdAndDelete(id),
  countDocuments: (q) =>
    isUsingMongoose() ? MongooseAIContentIdea.countDocuments(q) : storeAIContentIdea.countDocuments(q),
};

export default AIContentIdea;
