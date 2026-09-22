import mongoose from 'mongoose';
import { isUsingMongoose } from '../config/db.js';
import { BaseStoreModel } from './storeAdapter.js';

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['request', 'accepted', 'rejected', 'status_update', 'payment_update', 'deadline_reminder', 'general'],
      default: 'general',
    },
    relatedId: { type: String, default: null },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

const MongooseNotification =
  mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
const storeNotification = new BaseStoreModel('notifications');

export const Notification = {
  find: (q) => (isUsingMongoose() ? MongooseNotification.find(q) : storeNotification.find(q)),
  findOne: (q) => (isUsingMongoose() ? MongooseNotification.findOne(q) : storeNotification.findOne(q)),
  findById: (id) => (isUsingMongoose() ? MongooseNotification.findById(id) : storeNotification.findById(id)),
  create: (data) => (isUsingMongoose() ? MongooseNotification.create(data) : storeNotification.create(data)),
  findByIdAndUpdate: (id, update, opt) =>
    isUsingMongoose()
      ? MongooseNotification.findByIdAndUpdate(id, update, opt)
      : storeNotification.findByIdAndUpdate(id, update, opt),
  updateMany: async (q, update) =>
    isUsingMongoose() ? MongooseNotification.updateMany(q, update) : storeNotification.updateMany(q, update),
  findByIdAndDelete: (id) =>
    isUsingMongoose()
      ? MongooseNotification.findByIdAndDelete(id)
      : storeNotification.findByIdAndDelete(id),
  countDocuments: (q) =>
    isUsingMongoose() ? MongooseNotification.countDocuments(q) : storeNotification.countDocuments(q),
};

export default Notification;
