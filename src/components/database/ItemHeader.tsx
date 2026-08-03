import { Link } from '@/i18n/routing';
import type { ItemGuide } from '@/lib/drops';

const GRADE_COLOR: Record<string, string> = {
  COMMON: 'text-dim',
  UNCOMMON: 'text-rarity-uncommon',
  RARE: 'text-rarity-rare',
  LEGENDARY: 'text-rarity-legendary',
  DIVINE: 'text-rarity-divine',
  IMMORTAL: 'text-rarity-immortal',
  ARCANA: 'text-rarity-arcana',
  BEYOND: 'text-rarity-rare',
  CELESTIAL: 'text-rarity-divine',
  COSMIC: 'text-rarity-arcana',
};

const TYPE_LABEL: Record<string, string> = {
  GEAR: 'Gear',
  MATERIAL: 'Material',
  STAGEBOX: 'Drop Box',
};

export default function ItemHeader({ item }: { item: ItemGuide }) {
  return (
    <header className="tbh-frame relative mb-8 p-6 flex flex-col sm:flex-row gap-5">
      {item.icon && (
        <div className="w-20 h-20 shrink-0 bg-panel border border-line flex items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.icon} alt={item.name} width={80} height={80} className="w-full h-full object-contain [image-rendering:pixelated]" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[11px] uppercase tracking-widest text-faint mb-1">
          {item.itemType && (TYPE_LABEL[item.itemType] ?? item.itemType)}
          {item.gearType && <> · {item.gearType.toLowerCase()}</>}
          {item.level != null && <> · Level {item.level}</>}
          {' '}· #{item.id}
        </p>
        <h1 className="font-display text-2xl md:text-4xl font-bold text-ink uppercase tracking-wide mb-2">
          {item.name}
        </h1>
        {item.grade && (
          <p className={`font-mono text-xs uppercase tracking-widest mb-3 ${GRADE_COLOR[item.grade] ?? 'text-dim'}`}>
            {item.grade}
          </p>
        )}
        {(item.baseStats.length > 0 || item.inherentStats.length > 0) && (
          <ul className="space-y-0.5 mb-3">
            {item.baseStats.map((s) => (
              <li key={s} className="font-mono text-sm text-ink">{s}</li>
            ))}
            {item.inherentStats.map((s) => (
              <li key={s} className="font-mono text-sm text-rarity-rare">{s}</li>
            ))}
          </ul>
        )}
        {item.usableHeroes.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-faint">Used by:</span>
            {item.usableHeroes.map((h) => (
              <Link
                key={h.key}
                href={`/database/heroes/${h.key}`}
                prefetch={false}
                className="inline-flex items-center gap-1.5 border border-line bg-panel px-2 py-1 hover:border-gold group"
              >
                {h.icon && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={h.icon} alt="" width={18} height={18} className="w-[18px] h-[18px] object-contain [image-rendering:pixelated]" />
                )}
                <span className="font-sans text-xs text-ink group-hover:text-gold transition-colors">
                  {h.name}
                </span>
                <span className="font-mono text-[9px] uppercase text-faint">{h.slot}</span>
              </Link>
            ))}
          </div>
        )}
        {item.versions.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-faint">
              Other versions:
            </span>
            {item.versions.slice(0, 12).map((v) => (
              <Link
                key={v.id}
                href={`/database/items/${v.id}`}
                prefetch={false}
                className={`font-mono text-[10px] uppercase border border-line px-1.5 py-0.5 hover:border-gold ${GRADE_COLOR[v.grade ?? ''] ?? 'text-dim'}`}
              >
                {v.level != null ? `Lv${v.level}` : v.id} {v.grade?.slice(0, 3)}
              </Link>
            ))}
            {item.versions.length > 12 && (
              <span className="font-mono text-[10px] text-faint">
                +{item.versions.length - 12} more
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
