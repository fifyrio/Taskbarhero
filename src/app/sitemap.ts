import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { getDatasets, getRows } from '@/lib/database';

// English-only sitemap: core pages, one URL per dataset index, plus the six
// curated hero pages (strongest landing pages). Other detail pages (25k+) are
// intentionally excluded until they carry player-readable content.
export default function sitemap(): MetadataRoute.Sitemap {
  const core: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/database`, changeFrequency: 'weekly', priority: 0.9 },
  ];

  const datasets: MetadataRoute.Sitemap = getDatasets().map((d) => ({
    url: `${SITE_URL}/database/${d.name}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const heroes: MetadataRoute.Sitemap = getRows('heroes').map((h) => ({
    url: `${SITE_URL}/database/heroes/${h.HeroKey}`,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...core, ...heroes, ...datasets];
}
