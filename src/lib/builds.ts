// Class build guides for TBH: Task Bar Hero. Built on top of the raw hero data
// (src/lib/hero.ts) plus each weapon's base sub-stat (from the gear_types
// dataset), so the stat/gear priorities are derived from the actual game data
// rather than invented. Editorial one-liners describe the class role.

import { getRows } from '@/lib/database';
import { getHeroProfile, type HeroProfile } from '@/lib/hero';

// Weapon gear type -> the base sub-stat it scales, resolved from gear_types.
// e.g. ORB -> CooldownReduction, BOLT -> CriticalDamage, ARROW -> AttackSpeed.
const STAT_LABELS: Record<string, string> = {
  AttackDamage: 'Attack Damage',
  AttackSpeed: 'Attack Speed',
  CriticalChance: 'Critical Chance',
  CriticalDamage: 'Critical Damage',
  CooldownReduction: 'Cooldown Reduction',
  BlockChance: 'Block Chance',
  MaxHp: 'Max HP',
  Armor: 'Armor',
  MovementSpeed: 'Movement Speed',
};

function weaponStat(gearType: string): string | null {
  const gt = getRows('gear_types').find((r) => String(r.GearType) === gearType);
  if (!gt) return null;
  const stat = gt.BaseStat1_STATTYPE ? String(gt.BaseStat1_STATTYPE) : null;
  return stat ? STAT_LABELS[stat] ?? stat : null;
}

export interface ClassBuild {
  slug: string;
  heroKey: number;
  /** Primary target keyword, e.g. "TBH Sorcerer Build". */
  keyword: string;
  role: string;
  /** One-line playstyle summary shown in the class hero + index card. */
  tagline: string;
  /** 2–3 sentence overview of how the build plays. */
  overview: string;
  /** Ordered stat priority for gear rolls and passive investment. */
  statPriority: string[];
  /** What to look for on each weapon slot. */
  weaponFocus: { slot: string; gearType: string; stat: string | null }[];
  profile: HeroProfile;
}

// slug -> hero + hand-written role framing. Only the six playable classes.
const CLASS_DEFS: Record<
  string,
  {
    heroKey: number;
    role: string;
    tagline: string;
    overview: string;
    statPriority: string[];
  }
> = {
  sorcerer: {
    heroKey: 301,
    role: 'AoE Caster',
    tagline: 'Highest crit ceiling in the game — a glass-cannon area mage.',
    overview:
      'The Sorcerer trades survivability for the game\'s highest base Critical Chance and Critical Damage, deleting whole waves with area magic. The STAFF + ORB pairing leans on Cooldown Reduction, so you cast your big spells more often. Play at max range and never get caught in melee.',
    statPriority: ['Critical Damage', 'Critical Chance', 'Cooldown Reduction', 'Attack Damage', 'Max HP'],
  },
  ranger: {
    heroKey: 201,
    role: 'Ranged DPS',
    tagline: 'Fast, precise single-target archer with strong crit scaling.',
    overview:
      'The Ranger is an agile bow user with high base Critical Chance and the fastest attack cadence of the ranged classes. BOW + ARROW both push Attack Speed, so stack it to ramp your sustained DPS, then convert hits into crits. A popular solo class because it clears from safety.',
    statPriority: ['Attack Speed', 'Critical Chance', 'Critical Damage', 'Attack Damage', 'Movement Speed'],
  },
  priest: {
    heroKey: 401,
    role: 'Support / Bruiser',
    tagline: 'Holy support with the bulk to hold a frontline.',
    overview:
      'The Priest restores allies while carrying respectable HP and Armor for a caster. SCEPTER + TOME pushes Max HP, making it the sturdiest of the magic classes. Build enough survivability to stay in range, then prioritise cooldown and cast speed to keep restoration flowing.',
    statPriority: ['Max HP', 'Cooldown Reduction', 'Cast Speed', 'Armor', 'Attack Damage'],
  },
  knight: {
    heroKey: 101,
    role: 'Tank',
    tagline: 'Shielded frontline tank with the highest base defense.',
    overview:
      'The Knight is the durability pick: top base Armor and HP behind a SWORD + SHIELD kit that scales Block Chance. Stack survivability first so you can body enemy waves, then add Attack Speed and crit to turn tankiness into steady damage.',
    statPriority: ['Armor', 'Max HP', 'Block Chance', 'Attack Speed', 'Critical Damage'],
  },
  hunter: {
    heroKey: 501,
    role: 'Tactical DPS',
    tagline: 'Crossbow specialist built around massive critical hits.',
    overview:
      'The Hunter uses traps and a crossbow, with high base Critical Chance and a BOLT off-hand that scales Critical Damage — the strongest crit-damage identity in the game. Build pure crit and let each shot hit like a truck; kite with traps when swarmed.',
    statPriority: ['Critical Damage', 'Critical Chance', 'Attack Damage', 'Attack Speed', 'Max HP'],
  },
  slayer: {
    heroKey: 601,
    role: 'Melee Bruiser',
    tagline: 'Rage-fuelled berserker with the highest crit damage multiplier.',
    overview:
      'The Slayer is a wild melee bruiser: high HP and Armor for a DPS class, an AXE + HATCHET kit that stacks raw Attack Damage, and the single highest base Critical Damage of any hero. Build damage and enough bulk to dive the pack and stay swinging.',
    statPriority: ['Attack Damage', 'Critical Damage', 'Critical Chance', 'Max HP', 'Attack Speed'],
  },
};

// Display order on the index page: the four highest-searched classes first.
export const BUILD_SLUGS = ['sorcerer', 'ranger', 'priest', 'knight', 'hunter', 'slayer'] as const;

export function getClassBuild(slug: string, locale = 'en'): ClassBuild | null {
  const def = CLASS_DEFS[slug];
  if (!def) return null;
  const profile = getHeroProfile(String(def.heroKey), locale);
  if (!profile) return null;
  return {
    slug,
    heroKey: def.heroKey,
    keyword: `TBH ${profile.name} Build`,
    role: def.role,
    tagline: def.tagline,
    overview: def.overview,
    statPriority: def.statPriority,
    weaponFocus: [
      { slot: 'Main weapon', gearType: profile.mainWeapon, stat: weaponStat(profile.mainWeapon) },
      { slot: 'Off-hand', gearType: profile.subWeapon, stat: weaponStat(profile.subWeapon) },
    ],
    profile,
  };
}

export function getAllClassBuilds(locale = 'en'): ClassBuild[] {
  return BUILD_SLUGS.map((s) => getClassBuild(s, locale)).filter(
    (b): b is ClassBuild => b !== null,
  );
}
