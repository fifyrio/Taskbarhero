import type { Rarity } from '@/types/tier-list';

// The homepage primitives' rarity classes don't cover `common`; map it to a
// neutral border/dot so viewer/builder never render an undefined class.
export const RARITY_BORDER_CLASS: Record<Rarity, string> = {
  common: 'border-line',
  uncommon: 'rarity-uncommon',
  rare: 'rarity-rare',
  legendary: 'rarity-legendary',
  immortal: 'rarity-immortal',
  arcana: 'rarity-arcana',
  divine: 'rarity-divine',
};

export const RARITY_DOT_CLASS: Record<Rarity, string> = {
  common: 'bg-faint',
  uncommon: 'rdot-uncommon',
  rare: 'rdot-rare',
  legendary: 'rdot-legendary',
  immortal: 'rdot-immortal',
  arcana: 'rdot-arcana',
  divine: 'rdot-divine',
};

export function rarityBorder(rarity: Rarity | null | undefined): string {
  return RARITY_BORDER_CLASS[rarity ?? 'common'] ?? 'border-line';
}

export function rarityDot(rarity: Rarity | null | undefined): string {
  return RARITY_DOT_CLASS[rarity ?? 'common'] ?? 'bg-faint';
}

export const TIER_GRADES = ['S', 'A', 'B', 'C', 'D', 'F'] as const;

// Colored tier chip backgrounds for S/A/B/C/D/F (extends homepage S–C map).
export const TIER_CHIP_CLASS: Record<string, string> = {
  S: 'bg-gold text-black',
  A: 'bg-[#fc9c0c] text-black',
  B: 'bg-[#2f8bfc] text-black',
  C: 'bg-[#54fc0c] text-black',
  D: 'bg-panel text-ink',
  F: 'bg-[#fc2424] text-black',
};
