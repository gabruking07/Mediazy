import { seoPages, siteUrl } from './seo.js';

const pages = Object.values(seoPages);

export default function sitemap() {
  return pages.map((page) => ({
    url: `${siteUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.path === '/' ? 'weekly' : 'monthly',
    priority: page.path === '/' ? 1 : 0.8
  }));
}
