const platformMatchers = [
  { platform: 'Instagram', regex: /(^|\.)instagram\.com$/i },
  { platform: 'YouTube', regex: /(^|\.)((youtube\.com)|(youtu\.be))$/i },
  { platform: 'Facebook', regex: /(^|\.)((facebook\.com)|(fb\.watch))$/i },
  { platform: 'TikTok', regex: /(^|\.)tiktok\.com$/i },
  { platform: 'Twitter/X', regex: /(^|\.)(twitter\.com|x\.com)$/i },
  { platform: 'Vimeo', regex: /(^|\.)vimeo\.com$/i },
  { platform: 'Dailymotion', regex: /(^|\.)dailymotion\.com$/i },
  { platform: 'Reddit', regex: /(^|\.)reddit\.com$/i },
  { platform: 'Video', regex: /.+/ }
];

export const parseSupportedUrl = (value) => {
  let parsed;

  try {
    parsed = new URL(value);
  } catch {
    const error = new Error('Please enter a valid video URL.');
    error.statusCode = 400;
    throw error;
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    const error = new Error('Only http and https URLs are supported.');
    error.statusCode = 400;
    throw error;
  }

  const hostname = parsed.hostname.replace(/^www\./i, '');
  const pathname = parsed.pathname.toLowerCase();

  if (/(^|\.)instagram\.com$/i.test(hostname) && pathname.startsWith('/stories/')) {
    const error = new Error('This Instagram URL type is no longer supported.');
    error.statusCode = 410;
    throw error;
  }

  const match = platformMatchers.find((item) => item.regex.test(hostname));

  return {
    normalizedUrl: parsed.toString(),
    platform: match.platform,
    hostname
  };
};

export const isShortFormVideo = ({ platform, url, duration }) => {
  const lowerUrl = url.toLowerCase();

  return (
    lowerUrl.includes('/shorts/') ||
    lowerUrl.includes('/reel/') ||
    lowerUrl.includes('/reels/') ||
    lowerUrl.includes('/status/') ||
    platform === 'TikTok' ||
    Number(duration || 0) <= 90
  );
};
