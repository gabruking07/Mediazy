const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mediazy.xyz';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/files/']
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl
  };
}