import '../src/styles.css';
import Script from 'next/script';
import Providers from './providers.jsx';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mediazy.xyz';
const siteName = 'Mediazy';
const title = 'Mediazy - Free Video Downloader for Reels, Shorts and Social Media';
const description = 'Download videos, reels, audio, subtitles, and thumbnails from supported social platforms with Mediazy.';
const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

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
        {adsenseClientId && (
          <>
            <Script
              async
              crossOrigin="anonymous"
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
              strategy="afterInteractive"
            />
            <Script id="mediazy-ads-refresh" strategy="afterInteractive">
              {`
                window.MediazyAds = window.MediazyAds || {};
                window.MediazyAds.refresh = function () {
                  try {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                  } catch (error) {}
                };
              `}
            </Script>
          </>
        )}
        {children}
        <Providers />
      </body>
    </html>
  );
}
