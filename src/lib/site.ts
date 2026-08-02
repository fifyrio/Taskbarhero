// Single source of truth for the site's public origin.
// IMPORTANT: taskbarhero.wiki belongs to a third party (our data source) — never
// point canonical/OG/sitemap URLs there. Official domain: taskbarherowiki.co.

export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://taskbarherowiki.co';

export const SITE_NAME = 'TBH Wiki';

// Flip to true (via env) once the real domain is live and content is ready.
export const INDEXING_ENABLED = process.env.NEXT_PUBLIC_ENABLE_INDEXING === 'true';
