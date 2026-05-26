import mongoose from 'mongoose';
import { DownloadHistory } from '../models/DownloadHistory.js';

export const recordDownload = async (payload) => {
  if (mongoose.connection.readyState !== 1) return null;
  return DownloadHistory.create(payload);
};

export const listHistory = async (userId) => {
  if (mongoose.connection.readyState !== 1) return [];
  return DownloadHistory.find({ user: userId }).sort({ createdAt: -1 }).limit(25).lean();
};
