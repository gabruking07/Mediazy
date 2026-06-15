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
  const downloadPath = `/api/files/${encodeURIComponent(fileName)}`;

  if (!process.env.PUBLIC_BASE_URL) {
    return downloadPath;
  }

  return `${process.env.PUBLIC_BASE_URL.replace(/\/$/, '')}${downloadPath}`;
};

export const publicBaseUrlFromRequest = (req) => {
  const configuredBaseUrl = (process.env.PUBLIC_BASE_URL || '').trim();

  if (configuredBaseUrl && !/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?\/?$/i.test(configuredBaseUrl)) {
    return configuredBaseUrl.replace(/\/$/, '');
  }

  const forwardedHost = req.get('x-forwarded-host');
  const host = forwardedHost ? forwardedHost.split(',')[0].trim() : req.get('host');

  if (!host) {
    return configuredBaseUrl.replace(/\/$/, '');
  }

  const forwardedProto = req.get('x-forwarded-proto');
  const protocol = forwardedProto ? forwardedProto.split(',')[0].trim() : req.protocol;

  return `${protocol}://${host}`;
};
