import dns from 'dns';
// Force Google DNS to guarantee MongoDB Atlas SRV lookup reliability
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import placeRoutes from './routes/placeRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import ttsRoutes from './routes/ttsRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/tts', ttsRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Tourism API with MongoDB Atlas is running...' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server Error' });
});

export default app;
