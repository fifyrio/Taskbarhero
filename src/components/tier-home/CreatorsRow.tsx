import { CREATORS, type Creator } from './mockData';
import { Icon, SectionHeader, RARITY_BORDER } from './primitives';

const RARITY_TEXT: Record<NonNullable<Creator['rarity']>, string> = {
  uncommon: 'text-rarity-uncommon',
  rare: 'text-rarity-rare',
  legendary: 'text-rarity-legendary',
  immortal: 'text-rarity-immortal',
  arcana: 'text-rarity-arcana',
  divine: 'text-rarity-divine',
};

export default function CreatorsRow() {
  return (
    <section aria-labelledby="tbh-creators" className="mb-16">
      <div id="tbh-creators">
        <SectionHeader title="CRIADORES EM DESTAQUE" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {CREATORS.map((c) => {
          const accent = c.gold ? 'text-gold' : c.rarity ? RARITY_TEXT[c.rarity] : 'text-ink';
          const frame = c.gold
            ? 'border-2 border-gold bg-gold/20 text-gold'
            : c.rarity
              ? `border-2 ${RARITY_BORDER[c.rarity]} bg-white/5 ${RARITY_TEXT[c.rarity]}`
              : 'border border-line bg-panel text-faint';
          return (
            <button
              key={c.handle}
              type="button"
              className="bg-panel border border-line p-4 text-center tbh-lift focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
            >
              <span className={`w-16 h-16 mx-auto flex items-center justify-center mb-3 ${frame}`}>
                <Icon name={c.icon} className="text-3xl" />
              </span>
              <span className={`block font-mono text-xs font-bold mb-1 uppercase ${accent}`}>
                {c.handle}
              </span>
              <span className="block text-[9px] text-faint font-mono uppercase">{c.lists}</span>
              <span className="block text-[9px] text-gold font-mono mt-2">{c.followers}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
