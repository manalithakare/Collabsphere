import express from 'express';
import {
  sendCollaborationRequest,
  getBrandCollaborations,
  getInfluencerCollaborations,
  getCollaborationById,
  updateCollaborationStatus,
} from '../controllers/collaborationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/request', authorize('Brand'), sendCollaborationRequest);
router.get('/brand', authorize('Brand'), getBrandCollaborations);
router.get('/influencer', authorize('Influencer'), getInfluencerCollaborations);
router.get('/:id', getCollaborationById);
router.patch('/:id/status', updateCollaborationStatus);

export default router;
