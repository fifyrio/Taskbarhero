// Lightweight in-memory search index over the meaningful game datasets.
// Built lazily on first query and cached for the lifetime of the server process.

import { getDatasetMeta, getRows, idField, rowName, rowIconUrl } from '@/lib/database';

// Datasets worth searching (named entities); skips scaling/level/group/index tables.
const SEARCHABLE = [
  'heroes', 'monsters', 'skills', 'passive_skills', 'buffs', 'status_effects',
  'items', 'gear', 'gear_types', 'materials', 'unique_mods', 'stat_mods',
  'runes', 'stages', 'pets', 'skins', 'currencies', 'attributes',
];

export interface SearchEntry {
  dataset: string;
  label: string;
  key: string;
  name: string;
  nameLower: string;
  icon: string | null;
}

let index: SearchEntry[] | null = null;

function buildIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];
  for (const name of SEARCHABLE) {
    const meta = getDatasetMeta(name);
    if (!meta) continue;
    const id = idField(meta);
    for (const row of getRows(name)) {
      const display = rowName(row, meta, 'en');
      entries.push({
        dataset: name,
        label: meta.label,
        key: String(row[id]),
        name: display,
        nameLower: display.toLowerCase(),
        icon: rowIconUrl(row),
      });
    }
  }
  return entries;
}

export interface SearchResult {
  dataset: string;
  label: string;
  key: string;
  name: string;
  icon: string | null;
}

export function search(query: string, limit = 24): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  if (!index) index = buildIndex();

  const starts: SearchEntry[] = [];
  const contains: SearchEntry[] = [];
  for (const e of index) {
    const pos = e.nameLower.indexOf(q);
    if (pos === 0 || e.key === q) starts.push(e);
    else if (pos > 0) contains.push(e);
    if (starts.length >= limit) break;
  }
  // Prefix matches rank first, then substring matches.
  return [...starts, ...contains].slice(0, limit).map((e) => ({
    dataset: e.dataset,
    label: e.label,
    key: e.key,
    name: e.name,
    icon: e.icon,
  }));
}
