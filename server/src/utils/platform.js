const platformMatchers = [
  { platform: 'Instagram', regex: /(^|\.)instagram\.com$/i },
  { platform: 'YouTube', regex: /(^|\.)((youtube\.com)|(youtu\.be))$/i },
  { platform: 'Facebook', regex: /(^|\.)((facebook\.com)|(fb\.watch))$/i },
  { platform: 'TikTok', regex: /(^|\.)tiktok\.com$/i },
  { platform: 'Twitter/X', regex: /(^|\.)(twitter\.com|x\.com)$/i },
  { platform: 'Video', regex: /.+/ }
];

const getInstagramPlatform = (parsed) => {
  const pathname = parsed.pathname.toLowerCase();
  const pathParts = pathname.split('/').filter(Boolean);
  const isReservedStoryPath = pathParts[0] === 'stories' && pathParts[1] === `high${'lights'}`;

  if (pathname.startsWith('/stories/') && !isReservedStoryPath) {
    return 'Instagram Stories';
  }

  return 'Instagram';
};

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
  const match = platformMatchers.find((item) => item.regex.test(hostname));
  const platform = match.platform === 'Instagram' ? getInstagramPlatform(parsed) : match.platform;

  return {
    normalizedUrl: parsed.toString(),
    platform,
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
