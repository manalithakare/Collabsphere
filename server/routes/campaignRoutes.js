import express from 'express';
import {
  createCampaign,
  getBrandCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  updateCampaignStatus,
} from '../controllers/campaignController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('Brand'), createCampaign);
router.get('/my', authorize('Brand'), getBrandCampaigns);
router.get('/:id', getCampaignById);
router.put('/:id', authorize('Brand'), updateCampaign);
router.delete('/:id', authorize('Brand'), deleteCampaign);
router.patch('/:id/status', authorize('Brand'), updateCampaignStatus);

export default router;
