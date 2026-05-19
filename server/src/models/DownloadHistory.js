import mongoose from 'mongoose';

const downloadHistorySchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true
  },
  platform: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Untitled video'
  },
  type: {
    type: String,
    enum: ['video', 'audio', 'subtitles', 'thumbnail'],
    required: true
  },
  quality: {
    type: String,
    default: 'best'
  },
  fileName: String,
  fileSize: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

export const DownloadHistory = mongoose.model('DownloadHistory', downloadHistorySchema);
