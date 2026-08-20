// Curated, player-readable layer over the raw `unique_mods` dataset.
// Each unique mod gets a display name, a plain-English effect derived from its
// params (Raw_Divide1000 → value/1000, Divided → shown as-is or 1/n), and the
// list of gear items that carry it (gear.UniqueModKey → items by id).

import { getDatasetMeta, getRows, type Row } from './database';

export interface UniqueModItem {
  id: number;
  name: string;
  grade: string;
  icon: string | null;
  level: number | null;
}

export interface UniqueModGuide {
  key: number;
  modName: string; // raw identifier, e.g. SkillCooldownReduce
  displayName: string; // e.g. "Shield Charge — Cooldown Reduce"
  effect: string;
  items: UniqueModItem[];
}

const LOCALE_MAP: Record<string, string> = {
  en: 'en-US', zh: 'zh-Hans', 'zh-TW': 'zh-Hant', de: 'de-DE', es: 'es-ES',
  fr: 'fr-FR', id: 'id-ID', it: 'it-IT', ja: 'ja-JP', ko: 'ko-KR',
  pt: 'pt-BR', ru: 'ru-RU', th: 'th-TH', vi: 'vi-VN',
};

// CamelCase identifier → spaced words ("ShieldChargeKillCooldown" → "Shield Charge Kill Cooldown").
function words(identifier: string): string {
  return identifier.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
}

function exchange(value: unknown, type: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (type === 'Raw_Divide1000') return String(Number(value) / 1000);
  if (type === 'DamageAttribute') return String(value);
  return String(value);
}

// Params of the generic Skill* mods: Param1 = SkillKey, Param2 = magnitude.
interface ParsedParams {
  skillKey: string | null;
  value: string | null;
}

function skillNameByKey(): Map<string, string> {
  const map = new Map<string, string>();
  for (const s of getRows('skills')) {
    const i18n = s['SkillNameKey_i18n'] as Record<string, string> | undefined;
    const name = i18n?.['en-US'];
    if (name) map.set(String(s['SkillKey']), name);
  }
  return map;
}

// Plain-English effect for the generic Skill* mod families.
function skillFamilyEffect(mod: string, skill: string, value: string | null): string | null {
  switch (mod) {
    case 'SkillCooldownReduce':
      return `Reduces ${skill}'s cooldown by ${value ?? '?'}s.`;
    case 'SkillMultiStrikeCountUp':
      return `${skill} strikes ${value ?? '1'} additional time.`;
    case 'SkillBaseAttackCountReduce':
      return `${skill} needs ${value ?? '1'} fewer basic attack to trigger.`;
    case 'SkillProjectileCountUp':
      return `${skill} fires ${value ?? '1'} extra projectile.`;
    case 'SkillElementChange':
      return `Converts ${skill}'s damage to ${value ?? '?'} element.`;
    default:
      return null;
  }
}

// Hand-written glosses for the bespoke (non Skill*-family) mods, interpolating
// the exchanged param values. Interpretations follow the mod identifier; exact
// in-game wording may differ slightly.
const BESPOKE_EFFECTS: Record<string, (p: (string | null)[]) => string> = {
  ShieldChargeKillCooldown: () => 'Kills with Shield Charge reduce its remaining cooldown.',
  SkewerShotBleedingStrike: (p) => `Skewer Shot deals ${p[0] ?? '?'}× damage to Bleeding enemies.`,
  ArrowRainCriticalCooldown: (p) => `Arrow Rain critical hits reduce its cooldown by 1/${p[0] ?? '?'}.`,
  FlameHydraBerserk: (p) => `Flame Hydra gains a Berserk effect (×${p[0] ?? '?'} for ${p[1] ?? '?'}).`,
  IceOrbFreezeToCold: (p) => `Ice Orb's Freeze becomes Cold (value ${p[0] ?? '?'}).`,
  SnowstormEnhanceFrozenEnemy: (p) => `Snowstorm deals ${p[0] ?? '?'}× damage to Frozen enemies.`,
  WrathOfHeavenHeal: () => 'Wrath of Heaven also heals allies.',
  ExplosiveBoltHalf: (p) => `Explosive Bolt values are halved (${p[0] ?? '?'} / ${p[1] ?? '?'}).`,
  ChargeTrapExplosiveCooldown: (p) => `Explosive kills with Charge Trap reduce its cooldown by 1/${p[0] ?? '?'}.`,
  CrossbowTurretCooldown: (p) => `Reduces Crossbow Turret's cooldown by ${p[0] ?? '?'}s.`,
  CrossbowTurretAddAmount: (p) => `Deploys ${p[0] ?? '1'} extra Crossbow Turret.`,
  AxeSpinBleedingChance: (p) => `Axe Spin has a ${p[0] != null ? Number(p[0]) * 100 : '?'}% chance to inflict Bleeding.`,
  WaveMoveSlowestPartyExcludeSelf: () => 'Wave movement follows the slowest party member (excluding self).',
  WaveMoveFastestPartyMember: () => 'Wave movement follows the fastest party member.',
  SlayerLowHpAttackSpeed: (p) => `Slayer gains attack speed while at low HP (${p[0] != null ? Number(p[0]) * 100 : '?'}% per stack).`,
  SorcererLightningShock: () => "Sorcerer's Lightning damage applies Shock.",
  WhirlwindFireIgnite: () => "Whirlwind's Fire damage can Ignite enemies.",
};

let guideCache: Map<string, UniqueModGuide[]> | null = null;

function buildGuides(locale: string): UniqueModGuide[] {
  const dataLocale = LOCALE_MAP[locale] ?? 'en-US';
  const meta = getDatasetMeta('unique_mods');
  if (!meta) return [];

  const skillNames = skillNameByKey();

  // gear.UniqueModKey → carrying items (item id === GearKey).
  const itemsById = new Map<string, Row>();
  for (const it of getRows('items')) itemsById.set(String(it['id']), it);
  const carriers = new Map<string, UniqueModItem[]>();
  for (const g of getRows('gear')) {
    const modKey = g['UniqueModKey'];
    if (modKey == null) continue;
    const item = itemsById.get(String(g['GearKey']));
    if (!item) continue;
    const nameObj = item['name'] as Record<string, string> | null;
    const list = carriers.get(String(modKey)) ?? [];
    list.push({
      id: Number(item['id']),
      name: nameObj?.[dataLocale] ?? nameObj?.['en-US'] ?? String(item['id']),
      grade: String(item['grade'] ?? 'COMMON'),
      icon: typeof item['icon'] === 'string' ? (item['icon'] as string) : null,
      level: item['level'] != null ? Number(item['level']) : null,
    });
    carriers.set(String(modKey), list);
  }

  return getRows('unique_mods').map((m) => {
    const modName = String(m['UniqueMod'] ?? '');
    const key = Number(m['UniqueModKey']);
    const params: ParsedParams & { rest: (string | null)[] } = {
      skillKey: null,
      value: null,
      rest: [],
    };
    for (let i = 1; i <= 5; i++) {
      const raw = m[`Param${i}`];
      const type = m[`Param${i}ExchangeType`];
      if (raw == null) continue;
      params.rest.push(exchange(raw, type));
    }

    let displayName = words(modName);
    let effect: string;

    if (modName.startsWith('Skill')) {
      const skillKey = String(m['Param1'] ?? '');
      const skill = skillNames.get(skillKey) ?? `Skill ${skillKey}`;
      const value = exchange(m['Param2'], m['Param2ExchangeType']);
      displayName = `${skill} — ${words(modName.replace(/^Skill/, ''))}`;
      effect = skillFamilyEffect(modName, skill, value) ?? `${words(modName)} (${params.rest.join(' / ')}).`;
    } else {
      const bespoke = BESPOKE_EFFECTS[modName];
      effect = bespoke
        ? bespoke(params.rest)
        : `${words(modName)}${params.rest.length ? ` (${params.rest.join(' / ')})` : ''}.`;
    }

    const items = (carriers.get(String(key)) ?? [])
      .slice()
      .sort((a, b) => (a.level ?? 0) - (b.level ?? 0));

    return { key, modName, displayName, effect, items };
  });
}

export function getUniqueModGuides(locale = 'en'): UniqueModGuide[] {
  if (!guideCache) guideCache = new Map();
  const cached = guideCache.get(locale);
  if (cached) return cached;
  const guides = buildGuides(locale);
  guideCache.set(locale, guides);
  return guides;
}

export function getUniqueModGuide(key: string, locale = 'en'): UniqueModGuide | null {
  return getUniqueModGuides(locale).find((g) => String(g.key) === String(key)) ?? null;
}
