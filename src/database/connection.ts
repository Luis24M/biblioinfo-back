import mongoose from 'mongoose';
import { databaseConfig } from '../config/database';

/**
 * Singleton to maintain MongoDB connection
 */
class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnecting: boolean = false;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  /**
   * Connect to MongoDB database
   */
  public async connect(): Promise<void> {
    // If already connected, return immediately
    if (mongoose.connection.readyState === mongoose.ConnectionStates.connected as number) {
      return;
    }

    // If connection is in progress, wait
    if (this.isConnecting) {
      while (mongoose.connection.readyState !== mongoose.ConnectionStates.connected as number) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (mongoose.connection.readyState === mongoose.ConnectionStates.connected as number) {
          return;
        }
      }
      return;
    }

    this.isConnecting = true;

    try {
      await mongoose.connect(databaseConfig.uri as string, databaseConfig.options);
      console.log(`✅ Connected to MongoDB: ${mongoose.connection.name}`);

      // Connection event handlers
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ Disconnected from MongoDB');
      });

      // In development environments, automatically reconnect
      if (process.env.NODE_ENV !== 'production') {
        mongoose.connection.on('disconnected', () => {
          console.log('🔄 Attempting to reconnect to MongoDB...');
          setTimeout(() => this.connect(), 5000);
        });
      }

    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      this.isConnecting = false;
      throw error;
    }

    this.isConnecting = false;
  }

  /**
   * Close database connection
   */
  public async disconnect(): Promise<void> {
    if (mongoose.connection.readyState !== mongoose.ConnectionStates.disconnected as number) {
      await mongoose.disconnect();
      console.log('🔌 MongoDB connection closed');
    }
  }
}

/**
 * Function to connect to the database
 */
export async function connectToDatabase(): Promise<void> {
  const dbConnection = DatabaseConnection.getInstance();
  await dbConnection.connect();
}

/**
 * Function to close the database connection
 */
export async function closeDatabaseConnection(): Promise<void> {
  const dbConnection = DatabaseConnection.getInstance();
  await dbConnection.disconnect();
}
