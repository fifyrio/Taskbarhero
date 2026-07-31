type Rarity = 'uncommon' | 'rare' | 'legendary' | 'immortal' | 'arcana' | 'divine';
type TierLabel = 'S' | 'A' | 'B' | 'C';

const RARITY_BORDER: Record<Rarity, string> = {
  uncommon: 'rarity-uncommon',
  rare: 'rarity-rare',
  legendary: 'rarity-legendary',
  immortal: 'rarity-immortal',
  arcana: 'rarity-arcana',
  divine: 'rarity-divine',
};

const RARITY_DOT: Record<Rarity, string> = {
  uncommon: 'rdot-uncommon',
  rare: 'rdot-rare',
  legendary: 'rdot-legendary',
  immortal: 'rdot-immortal',
  arcana: 'rdot-arcana',
  divine: 'rdot-divine',
};

const TIER_CLASS: Record<TierLabel, string> = {
  S: 'tier-s',
  A: 'tier-a',
  B: 'tier-b',
  C: 'tier-c',
};

interface IconProps {
  name: string;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  return (
    <span aria-hidden className={`material-symbols-outlined ${className ?? ''}`}>
      {name}
    </span>
  );
}

interface TierBadgeProps {
  tier: TierLabel;
  size?: 'sm' | 'md' | 'lg';
}

export function TierBadge({ tier, size = 'md' }: TierBadgeProps) {
  const dims =
    size === 'lg' ? 'w-10 h-10 text-lg' : size === 'sm' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm';
  return (
    <div
      className={`${dims} ${TIER_CLASS[tier]} flex items-center justify-center font-bold font-mono flex-shrink-0`}
    >
      {tier}
    </div>
  );
}

interface RaritySlotProps {
  rarity: Rarity;
  size?: 'sm' | 'md' | 'lg';
}

export function RaritySlot({ rarity, size = 'md' }: RaritySlotProps) {
  const dims = size === 'lg' ? 'w-12 h-12' : size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  return (
    <div
      className={`${dims} border-2 ${RARITY_BORDER[rarity]} bg-[#0a0c10] flex-shrink-0`}
      aria-hidden
    />
  );
}

interface RarityDotProps {
  rarity: Rarity;
}

export function RarityDot({ rarity }: RarityDotProps) {
  return <div className={`w-2 h-2 rounded-full ${RARITY_DOT[rarity]}`} aria-hidden />;
}

interface SectionHeaderProps {
  title: string;
  tag?: string;
  live?: boolean;
}

export function SectionHeader({ title, tag, live }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <h2 className="font-display text-lg md:text-xl text-ink font-bold uppercase tracking-widest">
        {title}
      </h2>
      <div className="h-px flex-grow bg-line" />
      {tag && (
        <span className={`font-mono text-xs text-gold ${live ? 'animate-pulse' : ''}`}>{tag}</span>
      )}
    </div>
  );
}

export { RARITY_BORDER, RARITY_DOT, TIER_CLASS };
