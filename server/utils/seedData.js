import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { InfluencerProfile } from '../models/InfluencerProfile.js';
import { Campaign } from '../models/Campaign.js';
import { Collaboration } from '../models/Collaboration.js';
import { Payment } from '../models/Payment.js';
import { Notification } from '../models/Notification.js';

export async function seedDatabaseIfEmpty() {
  try {
    const userCount = await User.countDocuments({});
    if (userCount > 0) {
      console.log(`Database already populated (${userCount} users).`);
      return;
    }

    console.log('Seeding initial realistic CollabSphere demo data...');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // 1. Seed Brands
    const brand1 = await User.create({
      name: 'Aura Glow Skincare (Priya Sharma)',
      email: 'brand@auraglow.com',
      password: passwordHash,
      role: 'Brand',
    });

    const brand2 = await User.create({
      name: 'Volt Nutrition (Rohan Verma)',
      email: 'contact@voltnutrition.in',
      password: passwordHash,
      role: 'Brand',
    });

    const brand1Id = String(brand1._id || brand1.id);
    const brand2Id = String(brand2._id || brand2.id);

    // 2. Seed Influencers
    const influencersData = [
      {
        name: 'Rhea Sen (TechWithRhea)',
        email: 'rhea@techverse.com',
        bio: 'Tech reviewer, unboxings, clean desk setups, and developer life gear.',
        category: 'Tech',
        followers: 145000,
        engagementRate: 4.8,
        location: 'Bengaluru, India',
        startingPrice: 18000,
        platforms: ['YouTube', 'Instagram'],
        profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces',
        instagram: 'https://instagram.com/techwithrhea',
        youtube: 'https://youtube.com/@techwithrhea',
      },
      {
        name: 'Kabir Mehta',
        email: 'kabir@fashionflow.com',
        bio: 'Minimalist menswear styling, urban aesthetic lookbooks, and luxury grooming.',
        category: 'Fashion',
        followers: 320000,
        engagementRate: 5.2,
        location: 'Mumbai, India',
        startingPrice: 25000,
        platforms: ['Instagram'],
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces',
        instagram: 'https://instagram.com/kabirmehta_style',
        youtube: '',
      },
      {
        name: 'Ananya Iyer',
        email: 'ananya@fitlife.in',
        bio: 'Holistic strength training, vegetarian high-protein diet tips, and mobility.',
        category: 'Fitness',
        followers: 88000,
        engagementRate: 6.1,
        location: 'Pune, India',
        startingPrice: 12000,
        platforms: ['Instagram', 'YouTube'],
        profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=faces',
        instagram: 'https://instagram.com/ananyaiyerfit',
        youtube: 'https://youtube.com/@ananyafit',
      },
      {
        name: 'Aarav Kapoor',
        email: 'aarav@foodiejourney.com',
        bio: 'Street food discoverer, artisanal recipes, and restaurant kitchen deep-dives.',
        category: 'Food',
        followers: 210000,
        engagementRate: 3.9,
        location: 'Delhi NCR, India',
        startingPrice: 16000,
        platforms: ['Instagram', 'YouTube'],
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces',
        instagram: 'https://instagram.com/aaravfoodtrails',
        youtube: 'https://youtube.com/@aaravkitchen',
      },
      {
        name: 'Meera Nair',
        email: 'meera@wanderlust.in',
        bio: 'Solo offbeat travel, sustainable homestays, drone cinematography, and culture.',
        category: 'Travel',
        followers: 175000,
        engagementRate: 4.4,
        location: 'Goa, India',
        startingPrice: 20000,
        platforms: ['Instagram'],
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces',
        instagram: 'https://instagram.com/meera_wander',
        youtube: '',
      },
      {
        name: 'Tanya Deshmukh',
        email: 'tanya@glowup.com',
        bio: 'Dermatologist-approved skincare breakdowns, glass-skin tutorials, and honest SPF reviews.',
        category: 'Beauty',
        followers: 195000,
        engagementRate: 5.8,
        location: 'Mumbai, India',
        startingPrice: 22000,
        platforms: ['Instagram'],
        profileImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=faces',
        instagram: 'https://instagram.com/tanyaglows',
        youtube: '',
      },
      {
        name: 'Dev Rajput',
        email: 'dev@gamerzone.in',
        bio: 'Competitive esports highlights, PC build guides, and gaming gear testing.',
        category: 'Gaming',
        followers: 450000,
        engagementRate: 7.5,
        location: 'Hyderabad, India',
        startingPrice: 35000,
        platforms: ['YouTube'],
        profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&crop=faces',
        instagram: '',
        youtube: 'https://youtube.com/@devgamerindia',
      },
      {
        name: 'Vikram Singhania',
        email: 'vikram@wealthwisely.in',
        bio: 'Demystifying personal finance, index funds, smart budgeting, and tax hacks for Gen-Z.',
        category: 'Finance',
        followers: 110000,
        engagementRate: 4.1,
        location: 'Ahmedabad, India',
        startingPrice: 15000,
        platforms: ['YouTube', 'Instagram'],
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces',
        instagram: 'https://instagram.com/vikramfinance',
        youtube: 'https://youtube.com/@wealthwisely',
      },
    ];

    const createdInfluencerUsers = [];

    for (const inf of influencersData) {
      const user = await User.create({
        name: inf.name,
        email: inf.email,
        password: passwordHash,
        role: 'Influencer',
      });
      const userId = String(user._id || user.id);
      createdInfluencerUsers.push(user);

      await InfluencerProfile.create({
        userId,
        bio: inf.bio,
        category: inf.category,
        followers: inf.followers,
        engagementRate: inf.engagementRate,
        location: inf.location,
        startingPrice: inf.startingPrice,
        platforms: inf.platforms,
        profileImage: inf.profileImage,
        instagram: inf.instagram,
        youtube: inf.youtube,
      });

      await Notification.create({
        userId,
        message: 'Welcome to CollabSphere! Complete your creator media kit to get discovered by premium brands.',
        type: 'general',
      });
    }

    // 3. Seed Campaigns
    const c1 = await Campaign.create({
      brandId: brand1Id,
      title: 'HydraGlow 15% Vitamin C Serum Launch',
      productName: 'HydraGlow Vitamin C Serum',
      productDescription: 'Dermatologically tested serum targeting hyperpigmentation and instant barrier radiance.',
      category: 'Beauty',
      campaignType: 'Paid',
      budget: 50000,
      deliverables: '1 Dedicated Instagram Reel (30-45s) + 2 Story Frames with swipe-up/sticker link',
      deadline: '2026-10-15',
      targetAudience: 'Skincare enthusiasts aged 18-35 looking for gentle active ingredients',
      platform: 'Instagram',
      description: 'Highlight the light texture, non-sticky finish, and visible glow within 7 days.',
      status: 'Active',
    });

    const c2 = await Campaign.create({
      brandId: brand1Id,
      title: 'Barrier Repair Ceramide Moisturizer Festive Campaign',
      productName: 'Ceramide Rich Gel Cream',
      productDescription: 'Winter hydration locked with 5 essential ceramides and hyaluronic acid.',
      category: 'Beauty',
      campaignType: 'Paid',
      budget: 35000,
      deliverables: '1 GRWM Reel featuring product before makeup application',
      deadline: '2026-10-30',
      targetAudience: 'College students and working professionals dealing with dry skin',
      platform: 'Instagram',
      description: 'Focus on prep-and-prime benefits under festive makeup.',
      status: 'Active',
    });

    const c3 = await Campaign.create({
      brandId: brand2Id,
      title: 'Volt Pure Whey Isolate Monsoon Strength Challenge',
      productName: 'Volt Whey Isolate 2kg Chocolate',
      productDescription: '27g ultra-filtered protein per scoop, zero added sugar, digestive enzymes.',
      category: 'Fitness',
      campaignType: 'Paid',
      budget: 60000,
      deliverables: '1 High-energy Gym Reel + 1 YouTube Shorts workout smoothie recipe',
      deadline: '2026-10-20',
      targetAudience: 'Fitness enthusiasts, bodybuilders, crossfitters aged 20-40',
      platform: 'Both',
      description: 'Showcase mixability test in shaker and real-time macros breakdown.',
      status: 'Active',
    });

    const c1Id = String(c1._id || c1.id);
    const c3Id = String(c3._id || c3.id);

    const rheaUser = createdInfluencerUsers[0];
    const kabirUser = createdInfluencerUsers[1];
    const ananyaUser = createdInfluencerUsers[2];
    const tanyaUser = createdInfluencerUsers[5];

    const rheaId = String(rheaUser._id || rheaUser.id);
    const kabirId = String(kabirUser._id || kabirUser.id);
    const ananyaId = String(ananyaUser._id || ananyaUser.id);
    const tanyaId = String(tanyaUser._id || tanyaUser.id);

    // 4. Seed Collaborations
    // Collab 1: Aura Glow -> Tanya Deshmukh (In Progress)
    const collab1 = await Collaboration.create({
      campaignId: c1Id,
      brandId: brand1Id,
      influencerId: tanyaId,
      collaborationType: 'Paid',
      budget: 22000,
      deliverables: '1 Dedicated Reel showing 7-day before/after texture + 2 Stories',
      deadline: '2026-10-10',
      message: 'Hi Tanya! Love your scientific skincare breakdowns. We would love to feature our new Vitamin C with you!',
      status: 'In Progress',
    });
    const collab1Id = String(collab1._id || collab1.id);
    await Payment.create({
      collaborationId: collab1Id,
      amount: 22000,
      status: 'Pending',
    });
    await Notification.create({
      userId: tanyaId,
      message: 'Aura Glow Skincare approved your script draft! Collab is In Progress.',
      type: 'status_update',
      relatedId: collab1Id,
    });

    // Collab 2: Aura Glow -> Kabir Mehta (Pending request)
    const collab2 = await Collaboration.create({
      campaignId: c1Id,
      brandId: brand1Id,
      influencerId: kabirId,
      collaborationType: 'Paid',
      budget: 25000,
      deliverables: '1 Men Grooming Reel integrating morning skincare routine',
      deadline: '2026-10-14',
      message: 'Hey Kabir, your minimalist styling matches our clean aesthetic. Excited to partner!',
      status: 'Pending',
    });
    const collab2Id = String(collab2._id || collab2.id);
    await Notification.create({
      userId: kabirId,
      message: 'New collaboration request from Aura Glow Skincare for campaign "HydraGlow 15% Vitamin C" ($25000)',
      type: 'request',
      relatedId: collab2Id,
    });

    // Collab 3: Volt Nutrition -> Ananya Iyer (Completed & Paid)
    const collab3 = await Collaboration.create({
      campaignId: c3Id,
      brandId: brand2Id,
      influencerId: ananyaId,
      collaborationType: 'Paid',
      budget: 15000,
      deliverables: '1 Post-workout shake recipe Reel + macro tips',
      deadline: '2026-09-18',
      message: 'Ananya, your vegetarian high-protein content is super inspiring. Let us partner on our new Chocolate Isolate!',
      status: 'Completed',
    });
    const collab3Id = String(collab3._id || collab3.id);
    await Payment.create({
      collaborationId: collab3Id,
      amount: 15000,
      status: 'Paid',
      paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });
    await Notification.create({
      userId: ananyaId,
      message: 'Payment of $15000 for "Volt Pure Whey Isolate Monsoon Strength Challenge" has been marked as Paid by Volt Nutrition!',
      type: 'payment_update',
      relatedId: collab3Id,
    });

    // Collab 4: Volt Nutrition -> Rhea Sen (Accepted)
    const collab4 = await Collaboration.create({
      campaignId: c3Id,
      brandId: brand2Id,
      influencerId: rheaId,
      collaborationType: 'Paid',
      budget: 18000,
      deliverables: '1 Tech developer work-from-home wellness setup reel featuring energy shake',
      deadline: '2026-10-25',
      message: 'Rhea, love how you balance coding with fitness. Let us fuel your desk work!',
      status: 'Accepted',
    });
    const collab4Id = String(collab4._id || collab4.id);
    await Payment.create({
      collaborationId: collab4Id,
      amount: 18000,
      status: 'Pending',
    });
    await Notification.create({
      userId: brand2Id,
      message: 'Rhea Sen (TechWithRhea) accepted your collaboration request for "Volt Pure Whey Isolate".',
      type: 'accepted',
      relatedId: collab4Id,
    });

    console.log('Seed demo data created successfully!');
  } catch (error) {
    console.error('Error seeding demo data:', error);
  }
}
