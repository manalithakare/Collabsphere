import express from 'express';
import path from 'path';

import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import { connectDB } from './server/config/db.js';
import { seedDatabaseIfEmpty } from './server/utils/seedData.js';

import authRoutes from './server/routes/authRoutes.js';
import campaignRoutes from './server/routes/campaignRoutes.js';
import influencerRoutes from './server/routes/influencerRoutes.js';
import collaborationRoutes from './server/routes/collaborationRoutes.js';
import paymentRoutes from './server/routes/paymentRoutes.js';
import notificationRoutes from './server/routes/notificationRoutes.js';
import aiRoutes from './server/routes/aiRoutes.js';

dotenv.config();

const __dirname = process.cwd();

async function startServer() {
  const app = express();
const PORT = process.env.PORT || 3000;

  // Body parsing middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize Database connection and seed data
  await connectDB();
  await seedDatabaseIfEmpty();

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'CollabSphere Backend API',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/campaigns', campaignRoutes);
  app.use('/api/influencers', influencerRoutes);
  app.use('/api/collaborations', collaborationRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/ai', aiRoutes);

  // Centralized Error Handler for API
  app.use('/api', (err: any, req: any, res: any, next: any) => {
    console.error('Unhandled API Error:', err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  });

  // Vite development middleware vs production static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CollabSphere server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting CollabSphere server:', err);
});
