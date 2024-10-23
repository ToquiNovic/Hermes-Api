import dotenv from 'dotenv';

dotenv.config();

export const databaseConfig = {
  mongourl: process.env.MONGO_URL || 'mongodb://localhost:27017/bitacora',
};

export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h'
};
