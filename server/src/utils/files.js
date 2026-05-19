import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const downloadsDir = path.resolve(__dirname, '../../downloads');

export const ensureDownloadDir = async () => {
  await fs.ensureDir(downloadsDir);
};

export const publicDownloadUrl = (fileName) => {
  const baseUrl = process.env.PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
  return `${baseUrl.replace(/\/$/, '')}/api/files/${encodeURIComponent(fileName)}`;
};
