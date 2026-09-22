import express from 'express';
import { getInfluencers, getInfluencerById, updateMyProfile } from '../controllers/influencerController.js';
import { protect, optionalProtect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Influencer discovery is visible to all visitors (with optional auth)
router.get('/', optionalProtect, getInfluencers);
router.get('/:id', optionalProtect, getInfluencerById);

// Only an Influencer can edit their own influencer profile
router.put('/profile/me', protect, authorize('Influencer'), updateMyProfile);

export default router;
