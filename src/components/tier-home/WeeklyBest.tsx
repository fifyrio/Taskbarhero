import { WEEKLY_BEST } from './mockData';
import { SectionHeader, RaritySlot } from './primitives';

export default function WeeklyBest() {
  return (
    <section aria-labelledby="tbh-weekly" className="mb-16">
      <div id="tbh-weekly">
        <SectionHeader title="MELHORES DA SEMANA" />
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {WEEKLY_BEST.map((item) => (
          <article
            key={item.rank}
            className={`flex-shrink-0 w-64 p-4 relative overflow-hidden group transition-colors ${
              item.featured
                ? 'bg-[#0f1116] border border-gold/30 hover:border-gold'
                : 'bg-[#0a0c10] border border-line hover:border-gold'
            }`}
          >
            <div
              className={`absolute -right-2 -top-4 font-display text-7xl italic select-none pointer-events-none ${
                item.featured ? 'text-gold/10' : 'text-faint/10'
              }`}
            >
              {item.rank}
            </div>
            <div className="relative z-10">
              <div
                className={`font-mono text-[10px] mb-1 ${item.featured ? 'text-gold' : 'text-faint'}`}
              >
                {item.pct}
              </div>
              <h4 className="font-display text-base text-ink mb-4">{item.title}</h4>
              <div className="flex gap-1">
                {item.slots.map((rarity, i) => (
                  <RaritySlot key={`${rarity}-${i}`} rarity={rarity} size="sm" />
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
