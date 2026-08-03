import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { getDatasets, getRows } from '@/lib/database';
import { getSourcedItemIds } from '@/lib/drops';

// English-only sitemap covering only substantial pages: core pages, dataset
// indexes, the six curated hero pages, all stages and monsters (both carry
// relationship sections), and items that have at least one drop/craft source.
// Thin item pages (name + icon only) are excluded and served noindex.
export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: 'weekly' as const,
    priority,
  });

  const core = [entry('', 1), entry('/database', 0.9)];

  const heroes = getRows('heroes').map((h) => entry(`/database/heroes/${h.HeroKey}`, 0.9));
  const stages = getRows('stages').map((s) => entry(`/database/stages/${s.StageKey}`, 0.7));
  const monsters = getRows('monsters').map((m) => entry(`/database/monsters/${m.MonsterKey}`, 0.7));

  const sourced = getSourcedItemIds();
  const items = getRows('items')
    .filter((i) => sourced.has(Number(i.id)))
    .map((i) => entry(`/database/items/${i.id}`, 0.6));

  const datasets = getDatasets().map((d) => entry(`/database/${d.name}`, 0.5));

  return [...core, ...heroes, ...stages, ...monsters, ...items, ...datasets];
}
