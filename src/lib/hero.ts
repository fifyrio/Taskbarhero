// Assembles a player-readable hero profile from the raw game datasets:
// hero row + attribute tree -> active skills (with per-level values), passive
// upgrades, usable gear summary and formatted base stats.

import { getManifest, getRows, Row } from '@/lib/database';

const DATA_LOCALE: Record<string, string> = {
  en: 'en-US', zh: 'zh-Hans', 'zh-TW': 'zh-Hant', de: 'de-DE', es: 'es-ES',
  fr: 'fr-FR', id: 'id-ID', it: 'it-IT', ja: 'ja-JP', ko: 'ko-KR',
  pt: 'pt-BR', ru: 'ru-RU', th: 'th-TH', vi: 'vi-VN',
};

type I18nMap = Record<string, string>;

function pick(i18n: unknown, locale: string): string {
  if (!i18n || typeof i18n !== 'object') return '';
  const map = i18n as I18nMap;
  return map[DATA_LOCALE[locale] ?? 'en-US'] ?? map['en-US'] ?? Object.values(map)[0] ?? '';
}

// ---------------------------------------------------------------------------
// Base stats — labels + display formatting for the raw stat scales used by the
// game data (percent-like stats are stored ×10, speeds ×100).
// ---------------------------------------------------------------------------

export interface HeroStat {
  key: string;
  label: string;
  value: string;
  hint?: string;
}

const STAT_DEFS: { key: string; label: string; format: (v: number) => string; hint?: string }[] = [
  { key: 'MaxHp', label: 'Max HP', format: (v) => String(v) },
  { key: 'AttackDamage', label: 'Attack Damage', format: (v) => String(v) },
  { key: 'Armor', label: 'Armor', format: (v) => String(v) },
  { key: 'AttackSpeed', label: 'Attack Speed', format: (v) => `${(v / 100).toFixed(2)}×`, hint: 'multiplier of base attack rate' },
  { key: 'CastSpeed', label: 'Cast Speed', format: (v) => `${(v / 100).toFixed(2)}×`, hint: 'multiplier of base cast rate' },
  { key: 'CriticalChance', label: 'Critical Chance', format: (v) => `${v}%` },
  { key: 'CriticalDamage', label: 'Critical Damage', format: (v) => `${v / 10}%`, hint: 'damage dealt on a critical hit' },
  { key: 'CooldownReduction', label: 'Cooldown Reduction', format: (v) => `${v}%` },
  { key: 'MovementSpeed', label: 'Movement Speed', format: (v) => String(v) },
];

// ---------------------------------------------------------------------------

export interface HeroSkill {
  key: number;
  name: string;
  description: string;
  slot: 'active' | 'base-attack';
  trigger: string;
  range: number | null;
  damageType: string | null;
  maxLevel: number | null;
  /** Per-level skill values, already ÷10 when the description uses a % placeholder. */
  levels: { level: number; display: string }[];
}

export interface HeroPassive {
  key: number;
  name: string;
  stat: string;
  perLevel: string;
  maxLevel: number;
  total: string;
}

export interface GearSummary {
  gearType: string;
  count: number;
  grades: { grade: string; count: number }[];
  featured: { id: string; name: string; grade: string; icon: string | null; slug: string | null }[];
}

export interface HeroProfile {
  key: string;
  name: string;
  description: string;
  classType: string;
  mainWeapon: string;
  subWeapon: string;
  unlockCost: number | null;
  icon: string | null;
  stats: HeroStat[];
  baseAttack: HeroSkill | null;
  actives: HeroSkill[];
  passives: HeroPassive[];
  gear: GearSummary[];
  otherHeroes: { key: string; name: string; icon: string | null }[];
  source: { url: string; downloadedAt: string };
}

function triggerLabel(skill: Row): string {
  const type = String(skill.ACTIVATIONTYPE ?? '');
  const v = Number(skill.ActivationValue ?? 0);
  if (type === 'COOLDOWN') return `${v}s cooldown`;
  if (type === 'BASEATTACK_COUNT') return `every ${v} basic attacks`;
  if (type === 'BASEATTACK') return 'basic attack';
  return type.toLowerCase().replace(/_/g, ' ');
}

function buildSkill(skill: Row, locale: string, maxLevel: number | null, slot: HeroSkill['slot']): HeroSkill {
  const rawDesc = pick(skill.SkillDescriptionKey_i18n, locale).replace(/\n/g, ' ');
  // The {0} placeholder is the per-level skill value. Values are stored ×10 when
  // the placeholder is used as a percentage ("{0}%"), flat otherwise.
  const isPercent = rawDesc.includes('{0}%');
  const levels = ((skill.levels as { level: number; value: number }[] | null) ?? []).map((l) => ({
    level: l.level,
    display: isPercent ? `${l.value / 10}%` : String(l.value),
  }));
  let description = rawDesc;
  if (levels.length > 0) {
    const range = levels.length > 1
      ? `${levels[0].display}–${levels[levels.length - 1].display}`
      : levels[0].display;
    description = rawDesc.replace('{0}%', range).replace('{0}', range);
  }
  return {
    key: Number(skill.SkillKey),
    name: pick(skill.SkillNameKey_i18n, locale) || `Skill ${skill.SkillKey}`,
    description,
    slot,
    trigger: triggerLabel(skill),
    range: skill.Range == null ? null : Number(skill.Range),
    damageType: skill.DamageType == null ? null : String(skill.DamageType),
    maxLevel,
    levels,
  };
}

const FEATURED_GRADES = ['COSMIC', 'CELESTIAL', 'BEYOND', 'ARCANA', 'IMMORTAL', 'DIVINE'];
const GRADE_ORDER = [
  'COMMON', 'UNCOMMON', 'RARE', 'LEGENDARY', 'DIVINE', 'IMMORTAL',
  'ARCANA', 'BEYOND', 'CELESTIAL', 'COSMIC',
];

function gearSummary(gearType: string, locale: string): GearSummary {
  const items = getRows('items').filter((r) => r.gear === gearType);
  const byGrade = new Map<string, Row[]>();
  for (const it of items) {
    const g = String(it.grade ?? 'UNKNOWN');
    const list = byGrade.get(g) ?? [];
    byGrade.set(g, [...list, it]);
  }
  const grades = GRADE_ORDER.filter((g) => byGrade.has(g)).map((g) => ({
    grade: g,
    count: byGrade.get(g)!.length,
  }));
  // Feature a handful of top-grade items, deduped by display name.
  const featured: GearSummary['featured'] = [];
  const seen = new Set<string>();
  for (const grade of FEATURED_GRADES) {
    for (const it of byGrade.get(grade) ?? []) {
      const name = pick(it.name, locale) || String(it.id);
      if (seen.has(name)) continue;
      seen.add(name);
      featured.push({
        id: String(it.id),
        name,
        grade,
        icon: it.icon == null ? null : String(it.icon),
        slug: it.slug == null ? null : String(it.slug),
      });
      if (featured.length >= 6) return { gearType, count: items.length, grades, featured };
    }
  }
  return { gearType, count: items.length, grades, featured };
}

export function getHeroProfile(key: string, locale = 'en'): HeroProfile | null {
  const hero = getRows('heroes').find((r) => String(r.HeroKey) === String(key));
  if (!hero) return null;

  const stats: HeroStat[] = STAT_DEFS
    .filter((d) => hero[d.key] != null)
    .map((d) => ({ key: d.key, label: d.label, value: d.format(Number(hero[d.key])), hint: d.hint }));

  const skillsById = new Map(getRows('skills').map((r) => [Number(r.SkillKey), r]));
  const passivesById = new Map(getRows('passive_skills').map((r) => [Number(r.PassiveSkillKey), r]));
  const attrs = getRows('attributes').filter((a) => String(a.HeroKey) === String(key));

  const baseAttackRow = skillsById.get(Number(hero.SkillKey));
  const baseAttack = baseAttackRow ? buildSkill(baseAttackRow, locale, null, 'base-attack') : null;

  const actives: HeroSkill[] = [];
  const passives: HeroPassive[] = [];
  for (const a of attrs) {
    const maxLevel = Number(a.MaxLevel ?? 0);
    if (a.ATTRIBUTETYPE === 'ACTIVESKILL') {
      const s = skillsById.get(Number(a.Value));
      if (s) actives.push(buildSkill(s, locale, maxLevel, 'active'));
    } else if (a.ATTRIBUTETYPE === 'PASSIVESKILL') {
      const p = passivesById.get(Number(a.Value));
      if (!p) continue;
      const per = Number(p.Value ?? 0);
      const stat = String(p.STATTYPE ?? '');
      // HpRegenPerSec is stored ×100 (100 = 1 HP/s); other passives are flat.
      const fmt = stat === 'HpRegenPerSec' ? (v: number) => `${v / 100} HP/s` : (v: number) => String(v);
      passives.push({
        key: Number(a.AttributeKey),
        name: pick(p.SkillNameKey_i18n, locale) || stat,
        stat,
        perLevel: `+${fmt(per)}`,
        maxLevel,
        total: `+${fmt(per * maxLevel)}`,
      });
    }
  }

  const otherHeroes = getRows('heroes')
    .filter((r) => String(r.HeroKey) !== String(key))
    .map((r) => ({
      key: String(r.HeroKey),
      name: pick(r.HeroNameKey_i18n, locale) || String(r.HeroKey),
      icon: r.icon == null ? null : String(r.icon),
    }));

  const manifest = getManifest();

  return {
    key: String(hero.HeroKey),
    name: pick(hero.HeroNameKey_i18n, locale) || String(hero.HeroKey),
    description: pick(hero.DescriptionKey_i18n, locale).replace(/\n/g, ' '),
    classType: String(hero.ClassType ?? ''),
    mainWeapon: String(hero.MainWeaponGearType ?? ''),
    subWeapon: String(hero.SubWeaponGearType ?? ''),
    unlockCost: hero.UnlockCost == null ? null : Number(hero.UnlockCost),
    icon: hero.icon == null ? null : String(hero.icon),
    stats,
    baseAttack,
    actives,
    passives,
    gear: [hero.MainWeaponGearType, hero.SubWeaponGearType]
      .filter((g): g is string => typeof g === 'string' && g !== '')
      .map((g) => gearSummary(g, locale)),
    otherHeroes,
    source: { url: manifest.source, downloadedAt: manifest.downloaded_at },
  };
}
