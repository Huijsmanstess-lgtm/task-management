import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer | undefined;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/task_management_db';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB(): Promise<mongoose.Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      try {
        // Try to connect to MongoDB Atlas first
        const mongooseInstance = await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB Atlas connected');
        return mongooseInstance;
      } catch (error) {
        console.log('⚠️ MongoDB Atlas connection failed, starting in-memory server...');
        
        // Fallback to in-memory MongoDB
        if (!mongoServer) {
          mongoServer = await MongoMemoryServer.create();
        }
        const mongoUri = mongoServer.getUri();
        const mongooseInstance = await mongoose.connect(mongoUri);
        console.log('✅ In-memory MongoDB connected');
        return mongooseInstance;
      }
    })();
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;

declare global {
  var mongoose: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  };
}
