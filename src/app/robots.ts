import type { MetadataRoute } from 'next';
import { SITE_URL, INDEXING_ENABLED } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  if (!INDEXING_ENABLED) {
    // Site not ready for search engines: no real domain yet, content still WIP.
    return {
      rules: { userAgent: '*', disallow: '/' },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/auth/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
