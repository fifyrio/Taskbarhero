import { Link } from '@/i18n/routing';
import type { ItemSources, ItemRef } from '@/lib/drops';

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

function SectionTitle({ title, tag }: { title: string; tag?: string }) {
  return (
    <div className="flex items-baseline justify-between mb-3 border-b border-line pb-2">
      <h2 className="font-display text-lg font-bold text-ink uppercase tracking-wide">{title}</h2>
      {tag && <span className="font-mono text-[10px] uppercase tracking-widest text-faint">{tag}</span>}
    </div>
  );
}

export default function ItemSourcesSection({ sources }: { sources: ItemSources }) {
  const { stageDrops, crafting, synthesis, cubeRecipes, usedIn } = sources;
  const hasSources = stageDrops.length > 0 || crafting.length > 0 || synthesis.length > 0 || cubeRecipes.length > 0;
  if (!hasSources && usedIn.length === 0) return null;

  return (
    <>
      {hasSources && (
        <section className="mt-10">
          <SectionTitle title="How to Get" />

          {stageDrops.length > 0 && (
            <div className="space-y-3 mb-6">
              {stageDrops.map((d) => (
                <div key={d.box.id} className="border border-line bg-surface p-4">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <ItemChip item={d.box} />
                    {d.poolShare != null && (
                      <span className="font-mono text-[11px] text-dim">
                        ≈{d.poolShare.toFixed(1)}% of box rolls hit a pool containing this item
                        {d.poolSize > 1 && ` (${d.poolSize} items share the pool)`}
                      </span>
                    )}
                  </div>
                  <ul className="flex flex-wrap gap-x-4 gap-y-1">
                    {d.stages.map((s) => (
                      <li key={`${s.key}-${s.role}`} className="font-mono text-xs">
                        <Link
                          href={`/database/stages/${s.key}`}
                          prefetch={false}
                          className="text-gold hover:underline"
                        >
                          {s.name}
                        </Link>
                        <span className="text-faint">
                          {' '}
                          {s.act != null && `Act ${s.act}${s.stageNo != null ? `-${s.stageNo}` : ''} · `}
                          {s.role === 'boss' ? 'boss' : 'monsters'} {s.chance}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {crafting.length > 0 && (
            <div className="border border-line bg-surface p-4 mb-6">
              <h3 className="font-mono text-[11px] uppercase tracking-widest text-faint mb-2">Crafting</h3>
              <ul className="space-y-2">
                {crafting.map((c) => (
                  <li key={c.recipeKey} className="flex flex-wrap items-center gap-2 font-mono text-xs text-dim">
                    <span className="text-ink">{c.craftingType}</span>
                    <span>Tier {c.tier}:</span>
                    {c.materials.map((m) => (
                      <span key={m.rawKey} className="inline-flex items-center gap-1">
                        {m.item ? <ItemChip item={m.item} /> : m.rawKey}
                        <span>×{m.amount}</span>
                      </span>
                    ))}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {synthesis.length > 0 && (
            <div className="border border-line bg-surface p-4 mb-6">
              <h3 className="font-mono text-[11px] uppercase tracking-widest text-faint mb-2">Synthesis</h3>
              <p className="font-sans text-sm text-dim mb-2">
                Can appear as a synthesis result for these recipe settings:
              </p>
              <ul className="flex flex-wrap gap-2">
                {synthesis.map((s) => (
                  <li
                    key={`${s.synthesisType}-${s.grade}-${s.tier}`}
                    className="font-mono text-[11px] uppercase tracking-wider text-dim border border-line px-2 py-1"
                  >
                    {s.synthesisType} · Tier {s.tier} · {s.grade}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {cubeRecipes.length > 0 && (
            <div className="border border-line bg-surface p-4 mb-6">
              <h3 className="font-mono text-[11px] uppercase tracking-widest text-faint mb-2">Cube Recipes</h3>
              <ul className="flex flex-wrap gap-2">
                {cubeRecipes.map((c) => (
                  <li key={c.name} className="font-mono text-[11px] uppercase tracking-wider text-dim border border-line px-2 py-1">
                    {c.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {usedIn.length > 0 && (
        <section className="mt-10">
          <SectionTitle title="Used In" tag={`${usedIn.length} RECIPES`} />
          <div className="space-y-2">
            {usedIn.map((u) => (
              <div key={u.recipeKey} className="border border-line bg-surface p-4">
                <div className="font-mono text-xs text-dim mb-2">
                  <span className="text-ink">{u.craftingType}</span> · Tier {u.tier} · consumes ×{u.amount}
                </div>
                {u.produces.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-faint mr-1">Can produce:</span>
                    {u.produces.map((p) => (
                      <ItemChip key={p.id} item={p} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
