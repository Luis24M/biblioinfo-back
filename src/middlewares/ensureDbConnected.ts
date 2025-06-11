import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import { connectToDatabase } from '../database/connection';

export async function ensureDbConnected(req: Request, res: Response, next: NextFunction) {
  if (mongoose.connection.readyState === mongoose.ConnectionStates.connected) {
    return next();
  }

  try {
    console.log('🔌 DB not connected. Attempting connection...');
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('❌ Could not connect to MongoDB on request:', error);
    res.status(503).json({ message: 'Service temporarily unavailable (DB)' });
  }
}
