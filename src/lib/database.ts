// File-driven access to the Taskbar Hero game database (data/taskbarhero-database).
// Read-only reference data (45 datasets) powering the wiki. Parsed lazily and cached
// in-module so repeated server renders don't re-read/parse the large JSON files.

import fs from 'fs';
import path from 'path';

const ROOT = path.join(process.cwd(), 'data', 'taskbarhero-database');

export interface DatasetMeta {
  name: string;
  label: string;
  group: string;
  rows: number;
  columns: string[];
  page_url?: string;
  source_url?: string;
  file: string;
}

interface ManifestImage {
  local_path: string;
  error: string | null;
}

interface Manifest {
  source: string;
  downloaded_at: string;
  dataset_count: number;
  row_count: number;
  datasets: DatasetMeta[];
  images?: ManifestImage[];
}

export type Row = Record<string, unknown>;

// Map next-intl locales to the locale codes used inside the game data i18n objects.
const LOCALE_MAP: Record<string, string> = {
  en: 'en-US', zh: 'zh-Hans', 'zh-TW': 'zh-Hant', de: 'de-DE', es: 'es-ES',
  fr: 'fr-FR', id: 'id-ID', it: 'it-IT', ja: 'ja-JP', ko: 'ko-KR',
  pt: 'pt-BR', ru: 'ru-RU', th: 'th-TH', vi: 'vi-VN',
};

let manifestCache: Manifest | null = null;
const rowsCache = new Map<string, Row[]>();

function readJson<T>(rel: string): T {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8')) as T;
}

export function getManifest(): Manifest {
  if (!manifestCache) manifestCache = readJson<Manifest>('manifest.json');
  return manifestCache;
}

export function getDatasets(): DatasetMeta[] {
  return getManifest().datasets;
}

export function getDatasetMeta(name: string): DatasetMeta | null {
  return getDatasets().find((d) => d.name === name) ?? null;
}

// Datasets grouped by their manifest `group`, preserving first-seen order.
export function getGroupedDatasets(): { group: string; datasets: DatasetMeta[] }[] {
  const groups: { group: string; datasets: DatasetMeta[] }[] = [];
  for (const d of getDatasets()) {
    let g = groups.find((x) => x.group === d.group);
    if (!g) {
      g = { group: d.group, datasets: [] };
      groups.push(g);
    }
    g.datasets.push(d);
  }
  return groups;
}

export function getRows(name: string): Row[] {
  const cached = rowsCache.get(name);
  if (cached) return cached;
  const meta = getDatasetMeta(name);
  if (!meta) return [];
  const data = readJson<unknown>(meta.file);
  const rows: Row[] = Array.isArray(data)
    ? (data as Row[])
    : ((data as { rows?: Row[]; data?: Row[] }).rows ?? (data as { data?: Row[] }).data ?? []);
  rowsCache.set(name, rows);
  return rows;
}

// Primary-key column for a dataset (first column by manifest convention, e.g. HeroKey).
export function idField(meta: DatasetMeta): string {
  return meta.columns[0];
}

export function getRow(name: string, key: string): Row | null {
  const meta = getDatasetMeta(name);
  if (!meta) return null;
  const id = idField(meta);
  return getRows(name).find((r) => String(r[id]) === String(key)) ?? null;
}

// Resolve a human-readable name for a row in the requested locale.
// Prefers a `*Name*_i18n` field, then any `*_i18n` field, then a `*Name*` string, then the id.
export function rowName(row: Row, meta: DatasetMeta, locale = 'en'): string {
  const dataLocale = LOCALE_MAP[locale] ?? 'en-US';
  const i18nCols = meta.columns.filter((c) => c.endsWith('_i18n'));
  const nameI18n = i18nCols.find((c) => /name/i.test(c)) ?? i18nCols[0];
  if (nameI18n) {
    const obj = row[nameI18n] as Record<string, string> | undefined;
    if (obj && typeof obj === 'object') {
      const v = obj[dataLocale] ?? obj['en-US'] ?? Object.values(obj)[0];
      if (v) return String(v).replace(/\n/g, ' ');
    }
  }
  const nameCol = meta.columns.find((c) => /name/i.test(c) && !c.endsWith('_i18n'));
  if (nameCol && row[nameCol]) return String(row[nameCol]);
  return String(row[idField(meta)] ?? '');
}

// Curated foreign-key columns → the dataset they reference. A column links when its
// name equals or ends with one of these key names (e.g. NextRuneKey -> runes,
// MainWeaponGearType -> gear_types) and the value exists in the target dataset.
const FK_TARGETS: Record<string, string> = {
  HeroKey: 'heroes',
  MonsterKey: 'monsters',
  SkillKey: 'skills',
  PassiveSkillKey: 'passive_skills',
  RuneKey: 'runes',
  GearKey: 'gear',
  ItemKey: 'items',
  GearType: 'gear_types',
  BuffKey: 'buffs',
  StatusEffectKey: 'status_effects',
  AttributeKey: 'attributes',
  UniqueModKey: 'unique_mods',
  StatModKey: 'stat_mods',
  PetKey: 'pets',
  StageKey: 'stages',
  CurrencyKey: 'currencies',
  DropKey: 'drops',
};
// Longest key names first so e.g. PassiveSkillKey wins over SkillKey.
const FK_KEYS = Object.keys(FK_TARGETS).sort((a, b) => b.length - a.length);

const keySetCache = new Map<string, Set<string>>();
function getKeySet(name: string): Set<string> {
  const cached = keySetCache.get(name);
  if (cached) return cached;
  const meta = getDatasetMeta(name);
  const set = new Set<string>();
  if (meta) {
    const id = idField(meta);
    for (const r of getRows(name)) set.add(String(r[id]));
  }
  keySetCache.set(name, set);
  return set;
}

// Resolve a (column, value) pair to a link target if it's a known foreign key
// whose value exists in the referenced dataset. `selfId` is the current dataset's
// own id column, which must not link to itself.
export function resolveFk(
  column: string,
  value: unknown,
  selfId: string,
): { dataset: string; key: string } | null {
  if (value === null || value === undefined || value === '') return null;
  const key = String(value);
  for (const fk of FK_KEYS) {
    if (column === selfId) continue;
    if (column === fk || column.endsWith(fk)) {
      const dataset = FK_TARGETS[fk];
      if (getKeySet(dataset).has(key)) return { dataset, key };
      return null;
    }
  }
  return null;
}

// Web paths of images that were downloaded locally (now served from public/game/*).
// manifest local_path "images/game/x.png" -> public URL "/game/x.png".
let availableImages: Set<string> | null = null;
function getAvailableImages(): Set<string> {
  if (!availableImages) {
    availableImages = new Set(
      (getManifest().images ?? [])
        .filter((i) => !i.error)
        .map((i) => '/' + i.local_path.replace(/^images\//, '')),
    );
  }
  return availableImages;
}

// Public image URL for a row's icon/portrait, or null when the asset wasn't downloaded.
export function rowIconUrl(row: Row): string | null {
  const raw = (row.icon ?? row.portrait ?? row.dead_icon) as string | undefined;
  if (!raw) return null;
  return getAvailableImages().has(raw) ? raw : null;
}
