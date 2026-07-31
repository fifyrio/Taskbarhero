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
} from '@/lib/database';

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

  return (
    <div className="tbh-root tbh-grain font-display min-h-screen">
      <div className="tbh-scanline" aria-hidden />
      <Header />
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
        {/* Hero */}
        <section
          aria-labelledby="wiki-hero-heading"
          className="mb-10 border border-line p-6 sm:p-10 bg-[#0f1116] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-gold opacity-40 hidden sm:block">
            {'// TBH_DATABASE_ONLINE'}
          </div>
          <div className="relative z-10 max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-widest text-gold mb-3">
              {'// TASK_BAR_HERO_WIKI'}
            </p>
            <h1
              id="wiki-hero-heading"
              className="font-display text-4xl sm:text-6xl text-gold uppercase mb-4 tracking-tighter font-bold drop-shadow-[0_0_14px_rgba(246,183,60,0.35)]"
            >
              TBH Database
            </h1>
            <p className="font-sans text-sm sm:text-base text-ink/80 leading-relaxed mb-8">
              Every hero, monster, gear, item, rune, skill and stage in TBH: Task Bar Hero —
              {' '}
              {manifest.row_count.toLocaleString()} entries across {manifest.dataset_count} datasets,
              in 16 languages.
            </p>
            <div className="mb-8">
              <SearchBox />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/database"
                prefetch={false}
                className="bg-gold text-surface font-mono text-sm px-8 py-4 font-bold uppercase tracking-wide transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
              >
                Browse database
              </Link>
              <Link
                href="/database/heroes"
                prefetch={false}
                className="border border-line text-ink font-mono text-sm px-8 py-4 font-bold uppercase tracking-wide transition-colors hover:bg-panel hover:border-gold"
              >
                View heroes
              </Link>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none select-none">
            <Icon name="database" className="text-[220px] leading-none" />
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
                className="tbh-lift group border border-line bg-surface hover:border-gold p-5 transition-colors"
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
                    className="tbh-lift group border border-line bg-surface hover:border-gold p-4 text-center transition-colors"
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

        {/* All categories */}
        <section className="mb-12">
          <SectionHeader title="ALL CATEGORIES" tag={`${manifest.dataset_count}`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((g) => (
              <div key={g.group} className="border border-line bg-surface p-4">
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
