import fs from 'fs-extra';
import path from 'node:path';
import { downloadsDir } from './files.js';

const ttlMinutes = Number(process.env.DOWNLOAD_TTL_MINUTES || 10);
const ttlMs = ttlMinutes * 60 * 1000;

export const cleanupOldDownloads = async () => {
  const entries = await fs.readdir(downloadsDir);
  const now = Date.now();

  await Promise.all(entries.map(async (entry) => {
    if (entry === '.gitkeep') return;

    const filePath = path.join(downloadsDir, entry);
    const stat = await fs.stat(filePath).catch(() => null);

    if (!stat) return;

    if (now - stat.mtimeMs > ttlMs) {
      await fs.remove(filePath);
    }
  }));
};

export const startCleanupJob = () => {
  cleanupOldDownloads().catch((error) => {
    console.error('Initial cleanup failed:', error.message);
  });

  setInterval(() => {
    cleanupOldDownloads().catch((error) => {
      console.error('Scheduled cleanup failed:', error.message);
    });
  }, 60 * 1000);
};
