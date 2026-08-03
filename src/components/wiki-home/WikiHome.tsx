import { Link } from '@/i18n/routing';
import Header from '@/components/common/Header';
import { SectionHeader, Icon } from '@/components/tier-home/primitives';
import SearchBox from './SearchBox';
import {
  getManifest,
  getGroupedDatasets,
  getDatasetMeta,
  getRows,
  idField,
  rowName,
  rowIconUrl,
  type Row,
} from '@/lib/database';
import { getSourcedItemIds } from '@/lib/drops';

// Highest gear grades, best first — used to pick homepage featured gear.
const TOP_GRADES = ['COSMIC', 'CELESTIAL', 'BEYOND', 'ARCANA', 'IMMORTAL', 'DIVINE'];

// One featured top-grade item per gear type, deduped by name. Only items with
// an actual drop/craft source — their pages answer "how to get".
function featuredGear(count: number): Row[] {
  const sourced = getSourcedItemIds();
  const items = getRows('items').filter((r) => r.type === 'GEAR' && sourced.has(Number(r.id)));
  const byGrade = new Map<string, Row[]>();
  for (const it of items) {
    const g = String(it.grade);
    byGrade.set(g, [...(byGrade.get(g) ?? []), it]);
  }
  const out: Row[] = [];
  const seenNames = new Set<string>();
  const seenTypes = new Set<string>();
  for (const grade of TOP_GRADES) {
    for (const it of byGrade.get(grade) ?? []) {
      const name = JSON.stringify(it.name);
      const gearType = String(it.gear);
      if (seenNames.has(name) || seenTypes.has(gearType)) continue;
      seenNames.add(name);
      seenTypes.add(gearType);
      out.push(it);
      if (out.length >= count) return out;
    }
    seenTypes.clear();
  }
  return out;
}

// Datasets surfaced as primary browse tiles on the homepage.
const FEATURED_DATASETS = ['heroes', 'gear', 'runes', 'monsters', 'skills', 'stages', 'items', 'pets'];

const GROUP_ICON: Record<string, string> = {
  'Heroes & Combat': 'swords',
  'Items & Gear': 'shield',
  Progression: 'trending_up',
  'Crafting & Economy': 'science',
  'Collection & Storage': 'inventory_2',
  Misc: 'category',
};

export default function WikiHome({ locale }: { locale: string }) {
  const manifest = getManifest();
  const groups = getGroupedDatasets();

  const featured = FEATURED_DATASETS.map((n) => getDatasetMeta(n)).filter(
    (m): m is NonNullable<typeof m> => m !== null,
  );

  const heroesMeta = getDatasetMeta('heroes');
  const heroes = heroesMeta ? getRows('heroes').slice(0, 6) : [];

  const gear = featuredGear(8);
  // First stage of each act as entry points into the stage graph.
  const stageRows = getRows('stages').filter((s) => s.STAGETYPE === 'NORMAL');
  const acts = Array.from(new Set(stageRows.map((s) => Number(s.Act)))).sort((a, b) => a - b);
  const actEntries = acts.map((act) => ({
    act,
    stages: stageRows.filter((s) => Number(s.Act) === act).slice(0, 4),
    total: stageRows.filter((s) => Number(s.Act) === act).length,
  }));

  return (
    <div className="tbh-root tbh-grain font-display min-h-screen">
      <div className="tbh-scanline" aria-hidden />
      <Header />
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
        {/* Hero */}
        <section
          aria-labelledby="wiki-hero-heading"
          className="tbh-window mb-10 relative overflow-hidden"
        >
          {/* Game world art as the window's wallpaper, dimmed for text. */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-[28px] bottom-0 bg-[url('/game/ui/Act3_Bg.png')] bg-cover bg-center [image-rendering:pixelated] opacity-25"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 top-[28px] bottom-0 bg-[linear-gradient(90deg,rgba(11,13,18,0.95)_0%,rgba(11,13,18,0.8)_55%,rgba(11,13,18,0.35)_100%)]"
          />
          <span className="absolute top-0 left-3 h-[28px] flex items-center font-mono text-[10px] uppercase tracking-widest text-dim z-10">
            C:\TBH\database
          </span>
          {/* Knight sprite on the right */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/game/ui/Arrage_ChaAnim_Knight_Large_0.png"
            alt=""
            width={280}
            height={280}
            className="hidden md:block absolute right-6 bottom-0 w-[240px] lg:w-[280px] object-contain [image-rendering:pixelated] drop-shadow-[0_0_24px_rgba(246,183,60,0.25)] pointer-events-none select-none"
          />
          <div className="relative z-10 max-w-2xl p-6 sm:p-10">
            <p className="tbh-banner inline-block font-mono text-[11px] uppercase tracking-widest mb-5">
              Task_Bar_Hero_Wiki
            </p>
            <h1
              id="wiki-hero-heading"
              className="font-pixel text-2xl sm:text-4xl text-gold uppercase mb-5 leading-relaxed drop-shadow-[0_3px_0_rgba(0,0,0,0.8)]"
            >
              TBH Database
            </h1>
            <p className="font-sans text-sm sm:text-base text-ink/85 leading-relaxed mb-8">
              Every hero, monster, gear, item, rune, skill and stage in TBH: Task Bar Hero —
              {' '}
              {manifest.row_count.toLocaleString()} entries across {manifest.dataset_count} datasets.
            </p>
            <div className="mb-8">
              <SearchBox />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/database"
                prefetch={false}
                className="tbh-btn font-pixel text-[11px] px-8 py-4 uppercase text-center"
              >
                Browse database
              </Link>
              <Link
                href="/database/heroes"
                prefetch={false}
                className="tbh-btn-ghost font-pixel text-[11px] px-8 py-4 uppercase text-center"
              >
                View heroes
              </Link>
            </div>
          </div>
        </section>

        {/* Featured datasets */}
        <section className="mb-12">
          <SectionHeader title="BROWSE" tag="DATASETS" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {featured.map((d) => (
              <Link
                key={d.name}
                href={`/database/${d.name}`}
                prefetch={false}
                className="tbh-lift tbh-frame tbh-frame-hover group p-5 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon
                    name={GROUP_ICON[d.group] ?? 'category'}
                    className="text-gold text-[22px]"
                  />
                  <Icon name="chevron_right" className="text-faint text-[18px] group-hover:text-gold transition-colors" />
                </div>
                <div className="font-display text-base font-bold text-ink uppercase tracking-wide group-hover:text-gold transition-colors">
                  {d.label}
                </div>
                <div className="font-mono text-[11px] text-faint uppercase mt-1">
                  {d.rows.toLocaleString()} rows
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured heroes */}
        {heroesMeta && heroes.length > 0 && (
          <section className="mb-12">
            <SectionHeader title="HEROES" tag={`${heroesMeta.rows}`} />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {heroes.map((h) => {
                const key = String(h[idField(heroesMeta)]);
                const icon = rowIconUrl(h);
                return (
                  <Link
                    key={key}
                    href={`/database/heroes/${key}`}
                    prefetch={false}
                    className="tbh-lift tbh-frame tbh-frame-hover group p-4 text-center transition-colors"
                  >
                    <div className="w-12 h-12 mx-auto mb-3 bg-panel border border-line flex items-center justify-center group-hover:border-gold transition-colors overflow-hidden">
                      {icon ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={icon} alt="" width={48} height={48} className="w-full h-full object-contain [image-rendering:pixelated]" />
                      ) : (
                        <Icon name="person" className="text-gold text-[24px]" />
                      )}
                    </div>
                    <div className="font-display text-sm font-bold text-ink group-hover:text-gold transition-colors truncate">
                      {rowName(h, heroesMeta, locale)}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Featured top-grade gear */}
        {gear.length > 0 && (
          <section className="mb-12">
            <SectionHeader title="TOP GEAR" tag="HIGHEST GRADES" />
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {gear.map((g) => {
                const name = rowName(g, getDatasetMeta('items')!, locale);
                return (
                  <Link
                    key={String(g.id)}
                    href={`/database/items/${g.id}`}
                    prefetch={false}
                    className="tbh-lift tbh-frame tbh-frame-hover group p-3 text-center transition-colors"
                  >
                    <span className="block w-10 h-10 mx-auto mb-2 bg-panel border border-line group-hover:border-gold transition-colors overflow-hidden">
                      {g.icon ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={String(g.icon)} alt="" width={40} height={40} className="w-full h-full object-contain [image-rendering:pixelated]" />
                      ) : (
                        <Icon name="shield" className="text-gold text-[20px]" />
                      )}
                    </span>
                    <span className="font-sans text-xs text-ink group-hover:text-gold transition-colors truncate block">
                      {name}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-faint">
                      {String(g.grade)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Stages by act */}
        {actEntries.length > 0 && (
          <section className="mb-12">
            <SectionHeader title="STAGES" tag={`${stageRows.length} NORMAL`} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {actEntries.map((a) => (
                <div key={a.act} className="tbh-frame p-4">
                  <div className="flex items-baseline justify-between mb-3 pb-2 border-b border-line">
                    <h3 className="font-display text-sm font-bold text-ink uppercase tracking-wide">
                      Act {a.act}
                    </h3>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-faint">
                      {a.total} stages
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {a.stages.map((s) => (
                      <li key={String(s.StageKey)}>
                        <Link
                          href={`/database/stages/${s.StageKey}`}
                          prefetch={false}
                          className="font-mono text-xs text-dim hover:text-gold transition-colors"
                        >
                          {a.act}-{String(s.StageNo)} · {rowName(s, getDatasetMeta('stages')!, locale)}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href="/database/stages"
                        prefetch={false}
                        className="font-mono text-[11px] uppercase tracking-wider text-gold hover:underline"
                      >
                        All stages →
                      </Link>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All categories */}
        <section className="mb-12">
          <SectionHeader title="ALL CATEGORIES" tag={`${manifest.dataset_count}`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((g) => (
              <div key={g.group} className="tbh-frame p-4">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-line">
                  <Icon name={GROUP_ICON[g.group] ?? 'category'} className="text-gold text-[18px]" />
                  <h3 className="font-display text-sm font-bold text-ink uppercase tracking-wide">
                    {g.group}
                  </h3>
                </div>
                <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
                  {g.datasets.map((d) => (
                    <li key={d.name}>
                      <Link
                        href={`/database/${d.name}`}
                        prefetch={false}
                        className="font-mono text-xs text-dim hover:text-gold transition-colors"
                      >
                        {d.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
