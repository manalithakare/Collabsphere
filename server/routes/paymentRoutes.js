import express from 'express';
import { getPayments, markPaymentAsPaid } from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getPayments);
router.patch('/:id/pay', authorize('Brand'), markPaymentAsPaid);

export default router;
