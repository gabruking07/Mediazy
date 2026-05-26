import '../src/styles.css';
import Providers from './providers.jsx';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mediazy.xyz';
const siteName = 'Mediazy';
const title = 'Mediazy - Free Video Downloader for Reels, Stories, Shorts and Social Media';
const description = 'Download videos, reels, stories, audio, subtitles, and thumbnails from supported social platforms with Mediazy.';

export const metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: title,
    template: `%s | ${siteName}`
  },
  description,
  keywords: [
    'video downloader',
    'Instagram story downloader',
    'Instagram reels downloader',
    'YouTube downloader',
    'Facebook video downloader',
    'TikTok downloader',
    'Twitter video downloader',
    'MP3 downloader',
    'thumbnail downloader'
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: '/'
  },
  icons: {
    icon: '/mediazy.png',
    apple: '/mediazy.png'
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName,
    title,
    description,
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
    title,
    description,
    images: ['/mediazy.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  },
  category: 'technology'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Providers />
      </body>
    </html>
  );
}
