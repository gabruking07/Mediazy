import fs from 'fs-extra';
import path from 'node:path';
import { listHistory, recordDownload } from '../services/historyService.js';
import { createDownload, fetchInstagramProfileMedia, fetchMediaInfo, getInstagramCookieStatus } from '../services/ytdlpService.js';
import { downloadsDir } from '../utils/files.js';
import { parseSupportedUrl } from '../utils/platform.js';

const allowedTypes = new Set(['video', 'audio', 'subtitles', 'thumbnail']);
const allowedVideoFormats = new Set(['mp4', 'webm', 'mkv']);

const getUnlimitedQuota = () => ({
  used: 0,
  limit: null,
  available: null,
  unlimited: true
});

export const getVideoInfo = async (req, res, next) => {
  try {
    const { normalizedUrl, platform } = parseSupportedUrl(req.body.url);
    const info = await fetchMediaInfo({ url: normalizedUrl, platform });

    res.json(info);
  } catch (error) {
    error.publicMessage = error.statusCode
      ? error.message
      : error.publicMessage || 'Unable to read this video. Check the URL and try again.';
    next(error);
  }
};

export const getInstagramProfileMedia = async (req, res, next) => {
  try {
    const result = await fetchInstagramProfileMedia({ username: req.body.username });
    res.json(result);
  } catch (error) {
    error.publicMessage = error.statusCode
      ? error.message
      : error.publicMessage || 'Instagram profile could not be loaded. Check the username and try again.';
    next(error);
  }
};

export const getInstagramCookieDebug = async (_req, res, next) => {
  try {
    res.json(await getInstagramCookieStatus());
  } catch (error) {
    next(error);
  }
};

export const downloadMedia = async (req, res, next) => {
  try {
    const { normalizedUrl, platform } = parseSupportedUrl(req.body.url);
    const type = allowedTypes.has(req.body.type) ? req.body.type : 'video';
    const quality = req.body.quality || 'best';
    const format = allowedVideoFormats.has(req.body.format) ? req.body.format : 'mp4';
    const quota = getUnlimitedQuota();

    const info = await fetchMediaInfo({ url: normalizedUrl, platform });
    const result = await createDownload({
      url: normalizedUrl,
      platform,
      type,
      quality,
      format,
      title: info.title
    });

    await recordDownload({
      url: normalizedUrl,
      platform,
      title: info.title,
      type,
      quality,
      format,
      fileName: result.fileName,
      fileSize: result.fileSize,
      ...(req.user ? { user: req.user._id } : {}),
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      ...result,
      title: info.title,
      platform,
      type,
      quality,
      format,
      quota
    });
  } catch (error) {
    error.publicMessage = error.statusCode
      ? error.message
      : error.publicMessage || 'Download failed. The platform may be blocking this media or the format is unavailable.';
    next(error);
  }
};

export const serveDownloadFile = async (req, res, next) => {
  const requestedFileName = req.params.fileName;
  const fileName = path.basename(requestedFileName);

  if (fileName !== requestedFileName) {
    const error = new Error('Invalid download file.');
    error.statusCode = 400;
    next(error);
    return;
  }

  const filePath = path.join(downloadsDir, fileName);

  try {
    const stat = await fs.stat(filePath);

    if (!stat.isFile()) {
      const error = new Error('Download file was not found.');
      error.statusCode = 404;
      throw error;
    }

    res.download(filePath, fileName, async (error) => {
      await fs.remove(filePath).catch((cleanupError) => {
        console.error('Download cleanup failed:', cleanupError.message);
      });

      if (error && !res.headersSent) {
        next(error);
      }
    });
  } catch (error) {
    error.statusCode = error.statusCode || 404;
    error.publicMessage = 'Download file was not found or has expired.';
    next(error);
  }
};

export const getQuota = async (req, res, next) => {
  try {
    res.json({ quota: getUnlimitedQuota(), authenticated: Boolean(req.user) });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const history = await listHistory(req.user._id);
    res.json({ history });
  } catch (error) {
    next(error);
  }
};
