import fs from 'fs-extra';
import path from 'node:path';
import { countDownloadsToday, countGuestDownloads, listHistory, recordDownload } from '../services/historyService.js';
import { createDownload, fetchMediaInfo } from '../services/ytdlpService.js';
import { downloadsDir } from '../utils/files.js';
import { parseSupportedUrl } from '../utils/platform.js';

const allowedTypes = new Set(['video', 'audio', 'subtitles', 'thumbnail']);

const getDailyDownloadLimit = () => Number(process.env.DAILY_DOWNLOAD_LIMIT || 10);
const getGuestDownloadLimit = () => Number(process.env.GUEST_DOWNLOAD_LIMIT || 10);

const getDownloadQuota = async (userId) => {
  const limit = getDailyDownloadLimit();
  const used = await countDownloadsToday(userId);

  return {
    used,
    limit,
    available: Math.max(limit - used, 0)
  };
};

const getGuestQuota = async (req) => {
  const limit = getGuestDownloadLimit();
  const used = await countGuestDownloads({
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  });

  return {
    used,
    limit,
    available: Math.max(limit - used, 0)
  };
};

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

export const downloadMedia = async (req, res, next) => {
  try {
    const { normalizedUrl, platform } = parseSupportedUrl(req.body.url);
    const type = allowedTypes.has(req.body.type) ? req.body.type : 'video';
    const quality = req.body.quality || 'best';
    const quota = req.user
      ? await getDownloadQuota(req.user._id)
      : await getGuestQuota(req);

    if (quota.used >= quota.limit) {
      const error = new Error(req.user
        ? `Daily download limit reached. You can download ${quota.limit} files per day.`
        : `Guest download limit reached. Please log in to download more than ${quota.limit} files.`);
      error.statusCode = 429;
      throw error;
    }

    const info = await fetchMediaInfo({ url: normalizedUrl, platform });
    const result = await createDownload({
      url: normalizedUrl,
      platform,
      type,
      quality,
      title: info.title
    });

    await recordDownload({
      url: normalizedUrl,
      platform,
      title: info.title,
      type,
      quality,
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
      quota: {
        ...quota,
        used: quota.used + 1,
        available: Math.max(quota.available - 1, 0)
      }
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
    const quota = req.user
      ? await getDownloadQuota(req.user._id)
      : await getGuestQuota(req);

    res.json({ quota, authenticated: Boolean(req.user) });
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
