import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

// Memory store for embedded database fallback
let memoryDb = {
  users: [],
  influencerProfiles: [],
  campaigns: [],
  collaborations: [],
  payments: [],
  notifications: [],
  aiContentIdeas: [],
};

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch {
    // Ignore error in read-only environment
  }
}

// Load existing persisted data if available
try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    if (raw) {
      memoryDb = { ...memoryDb, ...JSON.parse(raw) };
    }
  }
} catch (err) {
  console.log('Notice: Initializing fresh embedded memory database');
}

export function saveLocalDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryDb, null, 2), 'utf-8');
  } catch (err) {
    // Memory fallback will retain during container lifetime
  }
}

export function getLocalCollection(collectionName) {
  if (!memoryDb[collectionName]) {
    memoryDb[collectionName] = [];
  }
  return memoryDb[collectionName];
}

export function resetLocalDb(seedData) {
  if (seedData) {
    memoryDb = { ...seedData };
    saveLocalDb();
  }
}

let isMongooseConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (uri && uri.trim() !== '') {
    try {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      isMongooseConnected = true;
      console.log('MongoDB successfully connected via Mongoose.');
      return;
    } catch (error) {
      console.warn('MongoDB connection failed, falling back to embedded local document store:', error.message);
    }
  } else {
    console.log('No MONGODB_URI provided in environment. Utilizing embedded document store.');
  }
  isMongooseConnected = false;
}

export function isUsingMongoose() {
  return isMongooseConnected && mongoose.connection.readyState === 1;
}
