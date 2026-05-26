export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mediazy.xyz';

export const defaultSeo = {
  title: 'Mediazy - Free Video Downloader for Reels, Stories, Shorts and Social Media',
  description: 'Download videos, reels, stories, audio, subtitles, and thumbnails from supported social platforms with Mediazy.',
  path: '/',
  keywords: [
    'video downloader',
    'free video downloader',
    'online video downloader',
    'Instagram story downloader',
    'Instagram reels downloader',
    'YouTube downloader',
    'Facebook video downloader',
    'TikTok downloader',
    'Twitter video downloader',
    'MP3 downloader',
    'thumbnail downloader'
  ]
};

export const seoPages = {
  home: defaultSeo,
  stories: {
    title: 'Instagram Story Downloader - Download Stories and Highlights',
    description: 'Use Mediazy to download public Instagram stories, highlights, reels, and profile media in a clean browser experience.',
    path: '/instagram-story-downloader',
    keywords: ['Instagram story downloader', 'download Instagram stories', 'Instagram highlights downloader', 'Instagram profile media downloader']
  },
  reels: {
    title: 'Instagram Reels Downloader - Save Public Reels Online',
    description: 'Download public Instagram reels with Mediazy. Paste a reel link, preview the media, and save the file when ready.',
    path: '/instagram-reels-downloader',
    keywords: ['Instagram reels downloader', 'download Instagram reels', 'save Instagram reels', 'Instagram video downloader']
  },
  youtube: {
    title: 'YouTube Video Downloader - Download Videos and Audio',
    description: 'Download supported YouTube videos, audio, thumbnails, and subtitles with Mediazy.',
    path: '/youtube-video-downloader',
    keywords: ['YouTube video downloader', 'YouTube MP3 downloader', 'download YouTube video', 'YouTube thumbnail downloader']
  },
  tiktok: {
    title: 'TikTok Video Downloader - Save TikTok Videos Online',
    description: 'Paste a public TikTok video link into Mediazy to preview and save supported media.',
    path: '/tiktok-video-downloader',
    keywords: ['TikTok video downloader', 'download TikTok video', 'save TikTok video']
  },
  facebook: {
    title: 'Facebook Video Downloader - Save Facebook Videos',
    description: 'Download supported public Facebook videos with Mediazy using a simple browser-based downloader.',
    path: '/facebook-video-downloader',
    keywords: ['Facebook video downloader', 'download Facebook video', 'save Facebook video']
  },
  twitter: {
    title: 'Twitter/X Video Downloader - Download X Videos',
    description: 'Download supported public Twitter and X videos with Mediazy by pasting a post link.',
    path: '/twitter-video-downloader',
    keywords: ['Twitter video downloader', 'X video downloader', 'download Twitter video', 'download X video']
  },
  mp3: {
    title: 'MP3 Downloader - Extract Audio from Supported Videos',
    description: 'Use Mediazy to extract MP3 audio from supported public video links.',
    path: '/mp3-downloader',
    keywords: ['MP3 downloader', 'video to MP3', 'audio downloader', 'extract audio from video']
  },
  thumbnails: {
    title: 'Thumbnail Downloader - Save Video Thumbnails',
    description: 'Download thumbnails from supported public media links with Mediazy.',
    path: '/thumbnail-downloader',
    keywords: ['thumbnail downloader', 'YouTube thumbnail downloader', 'video thumbnail downloader']
  },
  howToUse: {
    title: 'How to Use Mediazy - Download Videos, Audio and Thumbnails',
    description: 'Learn how to paste a media link, preview supported content, choose output type, and save your file with Mediazy.',
    path: '/how-to-use',
    keywords: ['how to download video', 'how to use Mediazy', 'download social media videos']
  },
  contact: {
    title: 'Contact Mediazy Support',
    description: 'Contact Mediazy support for help with supported video, audio, subtitle, thumbnail, story, and reel downloads.',
    path: '/contact',
    keywords: ['Mediazy support', 'video downloader support', 'contact Mediazy']
  }
};

export const metadataForPage = (page) => {
  const data = { ...defaultSeo, ...page };

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    alternates: {
      canonical: data.path
    },
    openGraph: {
      title: data.title,
      description: data.description,
      url: data.path,
      siteName: 'Mediazy',
      type: 'website',
      images: [
        {
          url: '/mediazy.png',
          width: 512,
          height: 512,
          alt: 'Mediazy logo'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
      images: ['/mediazy.png']
    }
  };
};

export const structuredDataForPage = (page) => {
  const data = { ...defaultSeo, ...page };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: 'Mediazy',
        url: siteUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'WebApplication',
        '@id': `${siteUrl}${data.path}#app`,
        name: data.title,
        url: `${siteUrl}${data.path}`,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Any',
        description: data.description,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        }
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}${data.path}#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is Mediazy free to use?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Mediazy provides a browser-based downloader experience for supported public media links.'
            }
          },
          {
            '@type': 'Question',
            name: 'Which downloads are supported?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Mediazy supports available video, audio, subtitle, thumbnail, story, reel, and social media downloads where the source platform allows access.'
            }
          }
        ]
      }
    ]
  };
};
