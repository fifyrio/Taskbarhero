import { Link } from '@/i18n/routing';
import type { UniqueModGuide } from '@/lib/unique-mods';

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

export function UniqueModItemChips({ items }: { items: UniqueModGuide['items'] }) {
  if (items.length === 0) {
    return <p className="font-mono text-xs text-faint">No gear currently carries this mod.</p>;
  }
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((it) => (
        <li key={it.id}>
          <Link
            href={`/database/items/${it.id}`}
            prefetch={false}
            className="flex items-center gap-1.5 border border-line bg-panel px-2 py-1 hover:border-gold transition-colors"
          >
            {it.icon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={it.icon}
                alt=""
                width={18}
                height={18}
                className="w-[18px] h-[18px] object-contain [image-rendering:pixelated]"
              />
            )}
            <span className={`font-mono text-xs ${GRADE_COLOR[it.grade] ?? 'text-ink'}`}>
              {it.name}
            </span>
            {it.level != null && (
              <span className="font-mono text-[10px] text-faint">Lv{it.level}</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function UniqueModsList({ guides }: { guides: UniqueModGuide[] }) {
  return (
    <>
      <p className="font-mono text-sm text-dim max-w-[70ch] mb-8 leading-relaxed">
        Unique mods are special effects found only on named gear in TBH: Task Bar Hero —
        cooldown reductions, extra projectiles, element conversions and class-specific
        bonuses. Every mod below links to the exact weapons and armor that roll it.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {guides.map((g) => (
          <article key={g.key} className="tbh-frame p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-faint mb-1">
              #{g.key} · {g.modName}
            </p>
            <h2 className="font-display text-lg font-bold text-ink uppercase tracking-wide mb-1.5">
              <Link
                href={`/database/unique_mods/${g.key}`}
                prefetch={false}
                className="hover:text-gold transition-colors"
              >
                {g.displayName}
              </Link>
            </h2>
            <p className="font-mono text-sm text-gold mb-3">{g.effect}</p>
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-faint mb-2">
              Found on {g.items.length} gear piece{g.items.length === 1 ? '' : 's'}
            </h3>
            <UniqueModItemChips items={g.items} />
          </article>
        ))}
      </div>
    </>
  );
}
