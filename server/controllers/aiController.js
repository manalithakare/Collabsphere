import { generateContentIdeasService } from '../services/geminiService.js';
import { AIContentIdea } from '../models/AIContentIdea.js';

export async function generateContentIdeas(req, res) {
  try {
    const { productName, productDescription, targetAudience, platform, campaignType, tone, contentType } = req.body;

    if (!productName || productName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Product name is required to generate AI content ideas.',
      });
    }

    const ideas = await generateContentIdeasService({
      productName,
      productDescription,
      targetAudience,
      platform,
      campaignType,
      tone,
      contentType,
    });

    return res.json({
      success: true,
      ideas,
    });
  } catch (error) {
    console.error('AI Idea generation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate content ideas. Please try again.',
      error: error.message,
    });
  }
}

export async function saveIdea(req, res) {
  try {
    const userId = req.user.id;
    const { productName, inputData, idea } = req.body;

    if (!productName || !idea) {
      return res.status(400).json({
        success: false,
        message: 'Product name and idea details are required.',
      });
    }

    const saved = await AIContentIdea.create({
      userId,
      productName,
      inputData: inputData || {},
      generatedIdeas: [idea],
    });

    return res.status(201).json({
      success: true,
      message: 'Idea saved to your collection.',
      savedIdea: saved,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error saving AI idea.',
      error: error.message,
    });
  }
}

export async function getSavedIdeas(req, res) {
  try {
    const userId = req.user.id;
    const ideas = await AIContentIdea.find({ userId });
    ideas.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.json({
      success: true,
      savedIdeas: ideas,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving saved ideas.',
      error: error.message,
    });
  }
}

export async function deleteSavedIdea(req, res) {
  try {
    const { id } = req.params;
    const item = await AIContentIdea.findById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Saved idea not found.' });
    }

    if (String(item.userId) !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this idea.' });
    }

    await AIContentIdea.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: 'Saved idea removed successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error deleting saved idea.',
      error: error.message,
    });
  }
}
