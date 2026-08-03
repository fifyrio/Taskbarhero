import { Link } from '@/i18n/routing';
import { Icon } from '@/components/tier-home/primitives';
import type { HeroProfile, HeroSkill } from '@/lib/hero';

// Grade → text color. Falls back to dim for grades without a dedicated token.
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

// ClassType -> large character sprite in /game/ui. Hunter's sprite is named
// after its crossbow archetype ("Abalist") in the game files.
const CLASS_SPRITE: Record<string, string> = {
  Knight: 'Knight',
  Ranger: 'Ranger',
  Sorcerer: 'Sorcerer',
  Priest: 'Priest',
  Hunter: 'Abalist',
  Slayer: 'Slayer',
};

function SectionTitle({ title, tag }: { title: string; tag?: string }) {
  return (
    <div className="flex items-baseline justify-between mb-3 border-b border-line pb-2">
      <h2 className="tbh-banner font-pixel text-[10px] uppercase px-8 py-2.5">{title}</h2>
      {tag && <span className="font-mono text-[10px] uppercase tracking-widest text-faint">{tag}</span>}
    </div>
  );
}

function SkillCard({ skill }: { skill: HeroSkill }) {
  return (
    <article className="tbh-frame p-4">
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <h3 className="font-display text-base font-bold text-gold uppercase tracking-wide">
          {skill.name}
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-wider text-faint shrink-0">
          {skill.trigger}
        </span>
      </div>
      <p className="font-sans text-sm text-ink/85 leading-relaxed mb-3">{skill.description}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-dim">
        {skill.damageType && <span>{skill.damageType}</span>}
        {skill.range != null && <span>Range {skill.range}</span>}
        {skill.maxLevel != null && <span>Max Lv {skill.maxLevel}</span>}
      </div>
      {skill.levels.length > 0 && (
        <details className="mt-3">
          <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-wider text-faint hover:text-gold">
            Per-level values
          </summary>
          <div className="mt-2 overflow-x-auto">
            <table className="font-mono text-xs text-dim border-collapse">
              <tbody>
                <tr>
                  {skill.levels.map((l) => (
                    <th key={l.level} className="border border-line px-2 py-1 font-normal text-faint">
                      Lv{l.level}
                    </th>
                  ))}
                </tr>
                <tr>
                  {skill.levels.map((l) => (
                    <td key={l.level} className="border border-line px-2 py-1 text-ink text-center">
                      {l.display}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </details>
      )}
    </article>
  );
}

export default function HeroDetail({ hero }: { hero: HeroProfile }) {
  return (
    <>
      {/* Hero header */}
      <header className="tbh-frame mb-10 relative overflow-hidden p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
        {CLASS_SPRITE[hero.classType] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/game/ui/Arrage_ChaAnim_${CLASS_SPRITE[hero.classType]}_Large_0.png`}
            alt=""
            width={220}
            height={220}
            className="hidden lg:block absolute right-4 bottom-0 w-[200px] object-contain [image-rendering:pixelated] opacity-90 drop-shadow-[0_0_20px_rgba(246,183,60,0.2)] pointer-events-none select-none"
          />
        )}
        {hero.icon && (
          <div className="w-28 h-28 shrink-0 bg-panel border border-gold/40 flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hero.icon}
              alt={hero.name}
              width={112}
              height={112}
              className="w-full h-full object-contain [image-rendering:pixelated]"
            />
          </div>
        )}
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-widest text-gold mb-1">
            {'// HERO'} · {hero.classType}
          </p>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-ink uppercase tracking-tight mb-3">
            {hero.name}
          </h1>
          <p className="font-sans text-sm sm:text-base text-ink/80 leading-relaxed max-w-xl mb-4">
            {hero.description}
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[11px] uppercase tracking-wider text-dim">
            <span>
              Main: <span className="text-gold">{hero.mainWeapon}</span>
            </span>
            <span>
              Off-hand: <span className="text-gold">{hero.subWeapon}</span>
            </span>
            {hero.unlockCost != null && (
              <span>
                Unlock: <span className="text-gold">{hero.unlockCost.toLocaleString()} gold</span>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Base stats */}
      <section className="mb-10">
        <SectionTitle title="Base Stats" tag="LEVEL 1" />
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-line border border-line">
          {hero.stats.map((s) => (
            <div key={s.key} className="bg-surface px-4 py-3">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-faint">{s.label}</dt>
              <dd className="font-display text-xl font-bold text-ink">{s.value}</dd>
              {s.hint && <p className="font-sans text-[11px] text-faint mt-0.5">{s.hint}</p>}
            </div>
          ))}
        </dl>
      </section>

      {/* Skills */}
      <section className="mb-10">
        <SectionTitle title="Skills" tag={`${hero.actives.length} ACTIVE`} />
        <div className="space-y-3">
          {hero.baseAttack && <SkillCard skill={hero.baseAttack} />}
          {hero.actives.map((s) => (
            <SkillCard key={s.key} skill={s} />
          ))}
        </div>
      </section>

      {/* Passive upgrades */}
      {hero.passives.length > 0 && (
        <section className="mb-10">
          <SectionTitle title="Passive Upgrades" tag={`${hero.passives.length} NODES`} />
          <p className="font-sans text-sm text-dim mb-3">
            Attribute-tree nodes that permanently raise this hero&apos;s stats. Each level costs
            attribute points earned by leveling up.
          </p>
          <div className="overflow-x-auto border border-line">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="bg-panel text-faint uppercase tracking-wider text-left">
                  <th className="px-3 py-2 font-normal">Upgrade</th>
                  <th className="px-3 py-2 font-normal">Per Level</th>
                  <th className="px-3 py-2 font-normal">Max Level</th>
                  <th className="px-3 py-2 font-normal">Fully Leveled</th>
                </tr>
              </thead>
              <tbody>
                {hero.passives.map((p) => (
                  <tr key={p.key} className="border-t border-line/60">
                    <td className="px-3 py-2 text-ink">{p.name}</td>
                    <td className="px-3 py-2 text-dim">{p.perLevel}</td>
                    <td className="px-3 py-2 text-dim">{p.maxLevel}</td>
                    <td className="px-3 py-2 text-gold">{p.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Usable gear */}
      <section className="mb-10">
        <SectionTitle title="Usable Gear" tag={hero.gear.map((g) => g.gearType).join(' + ')} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {hero.gear.map((g) => (
            <div key={g.gearType} className="tbh-frame p-4">
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="font-display text-base font-bold text-ink uppercase tracking-wide">
                  {g.gearType.toLowerCase()}s
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-widest text-faint">
                  {g.count} items
                </span>
              </div>
              <ul className="space-y-1.5 mb-4">
                {g.featured.map((f) => (
                  <li key={f.id}>
                    <Link
                      href={`/database/items/${encodeURIComponent(f.id)}`}
                      prefetch={false}
                      className="flex items-center gap-2.5 group"
                    >
                      <span className="w-7 h-7 shrink-0 bg-panel border border-line flex items-center justify-center overflow-hidden">
                        {f.icon ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={f.icon} alt="" width={28} height={28} className="w-full h-full object-contain [image-rendering:pixelated]" />
                        ) : (
                          <Icon name="shield" className="text-faint text-[14px]" />
                        )}
                      </span>
                      <span className="font-sans text-sm text-ink group-hover:text-gold transition-colors truncate">
                        {f.name}
                      </span>
                      <span className={`ml-auto font-mono text-[10px] uppercase tracking-wider ${GRADE_COLOR[f.grade] ?? 'text-dim'}`}>
                        {f.grade}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-faint mb-3">
                {g.grades.map((gr) => (
                  <span key={gr.grade}>
                    <span className={GRADE_COLOR[gr.grade] ?? ''}>{gr.grade}</span> ×{gr.count}
                  </span>
                ))}
              </div>
              <Link
                href={`/database/items`}
                prefetch={false}
                className="font-mono text-[11px] uppercase tracking-wider text-gold hover:underline"
              >
                Browse all {g.gearType.toLowerCase()}s →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Other heroes */}
      {hero.otherHeroes.length > 0 && (
        <section className="mb-10">
          <SectionTitle title="Other Heroes" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {hero.otherHeroes.map((h) => (
              <Link
                key={h.key}
                href={`/database/heroes/${h.key}`}
                prefetch={false}
                className="tbh-lift group tbh-frame hover:border-gold p-3 text-center transition-colors"
              >
                <span className="block w-10 h-10 mx-auto mb-2 bg-panel border border-line group-hover:border-gold transition-colors overflow-hidden">
                  {h.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={h.icon} alt="" width={40} height={40} className="w-full h-full object-contain [image-rendering:pixelated]" />
                  ) : (
                    <Icon name="person" className="text-gold text-[20px]" />
                  )}
                </span>
                <span className="font-display text-sm font-bold text-ink group-hover:text-gold transition-colors truncate block">
                  {h.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Data provenance */}
      <footer className="border-t border-line pt-4 font-mono text-[11px] text-faint">
        <p>
          Data extracted from TBH: Task Bar Hero game files · snapshot{' '}
          {hero.source.downloadedAt.slice(0, 10)}
        </p>
      </footer>
    </>
  );
}
