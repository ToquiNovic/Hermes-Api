import mongoose from 'mongoose';
import { databaseConfig } from '../config/index.js';

// Función para conectar a MongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect(databaseConfig.mongourl);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};