import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { InfluencerProfile } from '../models/InfluencerProfile.js';
import { Notification } from '../models/Notification.js';

const JWT_SECRET = process.env.JWT_SECRET || 'collabsphere_jwt_super_secret_development_key';

function signToken(userId, role) {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '7d' });
}

export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password, and role.',
      });
    }

    if (!['Brand', 'Influencer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be either 'Brand' or 'Influencer'.",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
    });

    const userId = String(newUser._id || newUser.id);

    // If registered as Influencer, automatically create influencer profile
    let influencerProfile = null;
    if (role === 'Influencer') {
      influencerProfile = await InfluencerProfile.create({
        userId,
        bio: 'Passionate digital creator ready to collaborate on authentic brand stories.',
        category: 'Lifestyle',
        followers: 10000,
        engagementRate: 3.5,
        location: 'Mumbai, India',
        startingPrice: 5000,
        platforms: ['Instagram'],
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces',
      });
    }

    // Welcome notification
    await Notification.create({
      userId,
      message: `Welcome to CollabSphere, ${name}! Start exploring collaborations now.`,
      type: 'general',
    });

    const token = signToken(userId, role);

    const { password: _, ...userSafe } = newUser;

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: { ...userSafe, id: userId },
      influencerProfile,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration.',
      error: error.message,
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const userId = String(user._id || user.id);
    const token = signToken(userId, user.role);

    let influencerProfile = null;
    if (user.role === 'Influencer') {
      influencerProfile = await InfluencerProfile.findOne({ userId });
    }

    const { password: _, ...userSafe } = user;

    return res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: { ...userSafe, id: userId },
      influencerProfile,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login.',
      error: error.message,
    });
  }
}

export async function getMe(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    let influencerProfile = null;
    if (user.role === 'Influencer') {
      influencerProfile = await InfluencerProfile.findOne({ userId });
    }

    const { password: _, ...userSafe } = user;

    return res.json({
      success: true,
      user: { ...userSafe, id: userId },
      influencerProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving current session.',
      error: error.message,
    });
  }
}
