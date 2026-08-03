import { Link } from '@/i18n/routing';
import type { MonsterGuide, StageGuide, ItemRef } from '@/lib/drops';

function SectionTitle({ title, tag }: { title: string; tag?: string }) {
  return (
    <div className="flex items-baseline justify-between mb-3 border-b border-line pb-2">
      <h2 className="font-display text-lg font-bold text-ink uppercase tracking-wide">{title}</h2>
      {tag && <span className="font-mono text-[10px] uppercase tracking-widest text-faint">{tag}</span>}
    </div>
  );
}

function ItemChip({ item }: { item: ItemRef }) {
  return (
    <Link
      href={`/database/items/${item.id}`}
      prefetch={false}
      className="inline-flex items-center gap-1.5 border border-line bg-panel px-2 py-1 hover:border-gold group"
    >
      {item.icon && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.icon} alt="" width={18} height={18} className="w-[18px] h-[18px] object-contain [image-rendering:pixelated]" />
      )}
      <span className="font-sans text-xs text-ink group-hover:text-gold transition-colors">{item.name}</span>
    </Link>
  );
}

export function MonsterAppearances({ guide }: { guide: MonsterGuide }) {
  if (guide.appearances.length === 0) return null;
  return (
    <section className="mt-10">
      <SectionTitle title="Appears In" tag={`${guide.appearances.length} STAGES`} />
      <div className="overflow-x-auto border border-line">
        <table className="w-full font-mono text-xs">
          <thead>
            <tr className="bg-panel text-faint uppercase tracking-wider text-left">
              <th className="px-3 py-2 font-normal">Stage</th>
              <th className="px-3 py-2 font-normal">Act</th>
              <th className="px-3 py-2 font-normal">Role</th>
              <th className="px-3 py-2 font-normal">Spawn</th>
              <th className="px-3 py-2 font-normal">Drops Box</th>
            </tr>
          </thead>
          <tbody>
            {guide.appearances.map((a) => (
              <tr key={`${a.key}-${a.boss}`} className="border-t border-line/60">
                <td className="px-3 py-2">
                  <Link href={`/database/stages/${a.key}`} prefetch={false} className="text-gold hover:underline">
                    {a.name}
                  </Link>
                </td>
                <td className="px-3 py-2 text-dim">
                  {a.act != null ? `${a.act}${a.no != null ? `-${a.no}` : ''}` : '—'}
                </td>
                <td className="px-3 py-2 text-dim">{a.boss ? 'BOSS' : 'wave'}</td>
                <td className="px-3 py-2 text-dim">{a.spawnPct != null ? `${a.spawnPct}%` : '—'}</td>
                <td className="px-3 py-2">
                  {a.box ? (
                    <span className="inline-flex items-center gap-2">
                      <ItemChip item={a.box} />
                      {a.boxChance != null && <span className="text-faint">{a.boxChance}%/kill</span>}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function StageOverview({ guide }: { guide: StageGuide }) {
  return (
    <>
      {guide.waveMonsters.length > 0 && (
        <section className="mt-10">
          <SectionTitle title="Monsters" tag={`${guide.waveMonsters.length}`} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {guide.waveMonsters.map((m) => (
              <Link
                key={`${m.key}-${m.boss}`}
                href={`/database/monsters/${m.key}`}
                prefetch={false}
                className="tbh-lift group border border-line bg-surface hover:border-gold p-3 text-center transition-colors"
              >
                <span className="block w-12 h-12 mx-auto mb-2 bg-panel border border-line group-hover:border-gold transition-colors overflow-hidden">
                  {m.portrait && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.portrait} alt="" width={48} height={48} className="w-full h-full object-contain [image-rendering:pixelated]" />
                  )}
                </span>
                <span className="font-display text-sm font-bold text-ink group-hover:text-gold transition-colors truncate block">
                  {m.name}
                </span>
                {m.boss && (
                  <span className="font-mono text-[10px] uppercase tracking-widest text-rarity-immortal">
                    BOSS
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {(guide.drops.length > 0 || guide.firstClear.length > 0 || guide.soulstone) && (
        <section className="mt-10">
          <SectionTitle title="Drops" />
          <div className="space-y-3">
            {guide.drops.map((d) => (
              <div key={`${d.box.id}-${d.role}`} className="border border-line bg-surface p-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <ItemChip item={d.box} />
                  <span className="font-mono text-[11px] text-dim">
                    from {d.role === 'boss' ? 'the boss' : 'monsters'} · {d.chance}% per kill
                  </span>
                </div>
                {d.preview.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-faint mr-1">
                      Can contain:
                    </span>
                    {d.preview.map((p) => (
                      <ItemChip key={p.id} item={p} />
                    ))}
                  </div>
                )}
              </div>
            ))}
            {guide.firstClear.length > 0 && (
              <div className="border border-line bg-surface p-4">
                <span className="font-mono text-[11px] uppercase tracking-wider text-faint mr-2">
                  First clear reward pool:
                </span>
                <span className="inline-flex flex-wrap gap-1.5 align-middle">
                  {guide.firstClear.map((p) => (
                    <ItemChip key={p.id} item={p} />
                  ))}
                </span>
              </div>
            )}
            {guide.soulstone && (
              <div className="border border-line bg-surface p-4">
                <span className="font-mono text-[11px] uppercase tracking-wider text-faint mr-2">
                  Soulstone:
                </span>
                <ItemChip item={guide.soulstone.item} />
                <span className="font-mono text-xs text-dim ml-2">×{guide.soulstone.amount}</span>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
