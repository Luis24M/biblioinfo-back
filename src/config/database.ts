import { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables if not already loaded
if (!process.env.MONGODB_URI) {
  dotenv.config();
}

// Verify that the environment variable exists
if (!process.env.MONGODB_URI) {
  console.error('Error: Environment variable MONGODB_URI not defined');
  process.exit(1);
}

export const databaseConfig = {
  uri: process.env.MONGODB_URI as string,
  options: {
    maxPoolSize: 10,
    minPoolSize: 2,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  } as ConnectOptions,
};
