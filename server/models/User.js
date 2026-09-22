import mongoose from 'mongoose';
import { isUsingMongoose } from '../config/db.js';
import { BaseStoreModel } from './storeAdapter.js';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Brand', 'Influencer'], required: true },
  },
  { timestamps: true }
);

const MongooseUser = mongoose.models.User || mongoose.model('User', UserSchema);
const storeUser = new BaseStoreModel('users');

export const User = {
  find: (q) => (isUsingMongoose() ? MongooseUser.find(q) : storeUser.find(q)),
  findOne: (q) => (isUsingMongoose() ? MongooseUser.findOne(q) : storeUser.findOne(q)),
  findById: (id) => (isUsingMongoose() ? MongooseUser.findById(id) : storeUser.findById(id)),
  create: (data) => (isUsingMongoose() ? MongooseUser.create(data) : storeUser.create(data)),
  findByIdAndUpdate: (id, update, opt) =>
    isUsingMongoose() ? MongooseUser.findByIdAndUpdate(id, update, opt) : storeUser.findByIdAndUpdate(id, update, opt),
  findByIdAndDelete: (id) =>
    isUsingMongoose() ? MongooseUser.findByIdAndDelete(id) : storeUser.findByIdAndDelete(id),
  countDocuments: (q) => (isUsingMongoose() ? MongooseUser.countDocuments(q) : storeUser.countDocuments(q)),
};

export default User;
