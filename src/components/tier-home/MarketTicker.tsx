import { TICKER, type TickerItem } from './mockData';
import { Icon, SectionHeader, RARITY_BORDER } from './primitives';

function deltaColor(dir: TickerItem['dir']): string {
  if (dir === 'up') return 'text-rarity-uncommon';
  if (dir === 'down') return 'text-rarity-immortal';
  return 'text-faint';
}

function Chip({ item }: { item: TickerItem }) {
  return (
    <div
      className={`inline-flex items-center gap-3 px-4 py-2 bg-panel border-2 ${RARITY_BORDER[item.rarity]}`}
    >
      <div className="w-6 h-6 bg-white/5 flex items-center justify-center text-ink">
        <Icon name={item.icon} className="text-sm" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold font-mono text-ink">{item.name}</span>
        <span className="font-mono text-xs text-tan">
          {item.price} <span className={deltaColor(item.dir)}>{item.delta}</span>
        </span>
      </div>
    </div>
  );
}

export default function MarketTicker() {
  const doubled = [...TICKER, ...TICKER];
  return (
    <section aria-labelledby="tbh-market" className="mb-16 w-full overflow-hidden">
      <div id="tbh-market">
        <SectionHeader title="MERCADO — MARKET" tag="LIVE_PRICES" live />
      </div>
      <div className="tbh-ticker-wrap bg-[#0a0c10] py-4 border-y border-line">
        <div className="tbh-ticker gap-8">
          {doubled.map((item, i) => (
            <div key={`${item.name}-${i}`} className="mr-8">
              <Chip item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
