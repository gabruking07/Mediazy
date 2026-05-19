import mongoose from 'mongoose';
import { DownloadHistory } from '../models/DownloadHistory.js';

export const recordDownload = async (payload) => {
  if (mongoose.connection.readyState !== 1) return null;
  return DownloadHistory.create(payload);
};

export const countDownloadsToday = async (userId) => {
  if (mongoose.connection.readyState !== 1) return 0;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  return DownloadHistory.countDocuments({
    user: userId,
    createdAt: { $gte: startOfToday }
  });
};

export const countGuestDownloads = async ({ ipAddress, userAgent }) => {
  if (mongoose.connection.readyState !== 1 || !ipAddress) return 0;

  return DownloadHistory.countDocuments({
    user: { $exists: false },
    ipAddress,
    ...(userAgent ? { userAgent } : {})
  });
};

export const listHistory = async (userId) => {
  if (mongoose.connection.readyState !== 1) return [];
  return DownloadHistory.find({ user: userId }).sort({ createdAt: -1 }).limit(25).lean();
};
