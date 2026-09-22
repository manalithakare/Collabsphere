import { InfluencerProfile } from '../models/InfluencerProfile.js';
import { User } from '../models/User.js';

export async function getInfluencers(req, res) {
  try {
    const { search, category, location, minFollowers, maxFollowers, maxBudget, platform } = req.query;

    let profiles = await InfluencerProfile.find({});
    const users = await User.find({ role: 'Influencer' });
    const userMap = new Map();
    users.forEach((u) => {
      userMap.set(String(u._id || u.id), u);
    });

    // Merge profile and user info
    let combined = profiles.map((p) => {
      const u = userMap.get(String(p.userId)) || {};
      return {
        _id: p._id || p.id,
        id: p._id || p.id,
        userId: p.userId,
        name: u.name || 'Creator',
        email: u.email || '',
        bio: p.bio || '',
        category: p.category || 'General',
        followers: Number(p.followers) || 0,
        engagementRate: Number(p.engagementRate) || 0,
        location: p.location || '',
        startingPrice: Number(p.startingPrice) || 0,
        instagram: p.instagram || '',
        youtube: p.youtube || '',
        otherLinks: p.otherLinks || '',
        profileImage: p.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces',
        platforms: Array.isArray(p.platforms) ? p.platforms : ['Instagram'],
      };
    });

    // Apply filters
    if (category && category !== 'All') {
      combined = combined.filter((item) => item.category.toLowerCase() === category.toLowerCase());
    }

    if (location && location.trim() !== '') {
      const locTerm = location.toLowerCase().trim();
      combined = combined.filter((item) => item.location.toLowerCase().includes(locTerm));
    }

    if (platform && platform !== 'All') {
      combined = combined.filter((item) =>
        item.platforms.some((pl) => pl.toLowerCase() === platform.toLowerCase())
      );
    }

    if (minFollowers) {
      combined = combined.filter((item) => item.followers >= Number(minFollowers));
    }

    if (maxFollowers) {
      combined = combined.filter((item) => item.followers <= Number(maxFollowers));
    }

    if (maxBudget) {
      combined = combined.filter((item) => item.startingPrice <= Number(maxBudget));
    }

    if (search && search.trim() !== '') {
      const term = search.toLowerCase().trim();
      combined = combined.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.bio.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term) ||
          item.location.toLowerCase().includes(term)
      );
    }

    // Default sort by follower count descending
    combined.sort((a, b) => b.followers - a.followers);

    return res.json({
      success: true,
      count: combined.length,
      influencers: combined,
    });
  } catch (error) {
    console.error('Get influencers error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving influencers.',
      error: error.message,
    });
  }
}

export async function getInfluencerById(req, res) {
  try {
    const { id } = req.params;
    let profile = await InfluencerProfile.findById(id);

    // If not found by profileId, check if it's userId
    if (!profile) {
      profile = await InfluencerProfile.findOne({ userId: id });
    }

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Influencer profile not found.',
      });
    }

    const user = await User.findById(profile.userId);
    const influencer = {
      _id: profile._id || profile.id,
      id: profile._id || profile.id,
      userId: profile.userId,
      name: user ? user.name : 'Creator',
      email: user ? user.email : '',
      bio: profile.bio || '',
      category: profile.category || 'General',
      followers: Number(profile.followers) || 0,
      engagementRate: Number(profile.engagementRate) || 0,
      location: profile.location || '',
      startingPrice: Number(profile.startingPrice) || 0,
      instagram: profile.instagram || '',
      youtube: profile.youtube || '',
      otherLinks: profile.otherLinks || '',
      profileImage: profile.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces',
      platforms: Array.isArray(profile.platforms) ? profile.platforms : ['Instagram'],
      createdAt: profile.createdAt,
    };

    return res.json({
      success: true,
      influencer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving influencer profile.',
      error: error.message,
    });
  }
}

export async function updateMyProfile(req, res) {
  try {
    const userId = req.user.id;
    const {
      name,
      bio,
      category,
      location,
      followers,
      engagementRate,
      startingPrice,
      instagram,
      youtube,
      otherLinks,
      profileImage,
      platforms,
    } = req.body;

    // Update user name if provided
    if (name) {
      await User.findByIdAndUpdate(userId, { name: name.trim() });
    }

    let profile = await InfluencerProfile.findOne({ userId });

    const updateFields = {
      bio: bio !== undefined ? bio : profile?.bio,
      category: category !== undefined ? category : profile?.category,
      location: location !== undefined ? location : profile?.location,
      followers: followers !== undefined ? Number(followers) : profile?.followers,
      engagementRate: engagementRate !== undefined ? Number(engagementRate) : profile?.engagementRate,
      startingPrice: startingPrice !== undefined ? Number(startingPrice) : profile?.startingPrice,
      instagram: instagram !== undefined ? instagram : profile?.instagram,
      youtube: youtube !== undefined ? youtube : profile?.youtube,
      otherLinks: otherLinks !== undefined ? otherLinks : profile?.otherLinks,
      profileImage: profileImage !== undefined ? profileImage : profile?.profileImage,
      platforms: platforms !== undefined ? platforms : profile?.platforms,
    };

    if (profile) {
      profile = await InfluencerProfile.findOneAndUpdate({ userId }, updateFields, { new: true });
    } else {
      profile = await InfluencerProfile.create({
        userId,
        ...updateFields,
      });
    }

    const updatedUser = await User.findById(userId);

    return res.json({
      success: true,
      message: 'Influencer profile updated successfully.',
      user: {
        id: userId,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
      profile,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating profile.',
      error: error.message,
    });
  }
}
