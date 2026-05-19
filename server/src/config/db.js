import mongoose from 'mongoose';

export const connectDatabase = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn('MONGO_URI is not set. History persistence is disabled.');
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.warn('API will continue without history persistence until MongoDB is available.');
  }
};
