import express from 'express';
import {
  generateContentIdeas,
  saveIdea,
  getSavedIdeas,
  deleteSavedIdea,
} from '../controllers/aiController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/generate', authorize('Brand'), generateContentIdeas);
router.post('/save', authorize('Brand'), saveIdea);
router.get('/saved', authorize('Brand'), getSavedIdeas);
router.delete('/saved/:id', authorize('Brand'), deleteSavedIdea);

export default router;
