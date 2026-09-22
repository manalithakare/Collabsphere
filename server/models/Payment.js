import mongoose from 'mongoose';
import { isUsingMongoose } from '../config/db.js';
import { BaseStoreModel } from './storeAdapter.js';

const PaymentSchema = new mongoose.Schema(
  {
    collaborationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Collaboration', required: true, index: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending', index: true },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const MongoosePayment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
const storePayment = new BaseStoreModel('payments');

export const Payment = {
  find: (q) => (isUsingMongoose() ? MongoosePayment.find(q) : storePayment.find(q)),
  findOne: (q) => (isUsingMongoose() ? MongoosePayment.findOne(q) : storePayment.findOne(q)),
  findById: (id) => (isUsingMongoose() ? MongoosePayment.findById(id) : storePayment.findById(id)),
  create: (data) => (isUsingMongoose() ? MongoosePayment.create(data) : storePayment.create(data)),
  findOneAndUpdate: (q, update, opt) =>
    isUsingMongoose() ? MongoosePayment.findOneAndUpdate(q, update, opt) : storePayment.findOneAndUpdate(q, update, opt),
  findByIdAndUpdate: (id, update, opt) =>
    isUsingMongoose()
      ? MongoosePayment.findByIdAndUpdate(id, update, opt)
      : storePayment.findByIdAndUpdate(id, update, opt),
  findByIdAndDelete: (id) =>
    isUsingMongoose() ? MongoosePayment.findByIdAndDelete(id) : storePayment.findByIdAndDelete(id),
  countDocuments: (q) =>
    isUsingMongoose() ? MongoosePayment.countDocuments(q) : storePayment.countDocuments(q),
};

export default Payment;
