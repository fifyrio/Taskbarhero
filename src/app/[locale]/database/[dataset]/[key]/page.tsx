import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import Header from '@/components/common/Header';
import { getDatasetMeta, getRow, idField, rowName, rowIconUrl, resolveFk } from '@/lib/database';
import { getHeroProfile } from '@/lib/hero';
import HeroDetail from '@/components/database/HeroDetail';
import {
  getItemSources,
  getItemGuide,
  getMonsterGuide,
  getStageGuide,
  getStageSummary,
  getSourcedItemIds,
} from '@/lib/drops';
import ItemSourcesSection from '@/components/database/ItemSourcesSection';
import ItemHeader from '@/components/database/ItemHeader';
import { MonsterAppearances, StageOverview } from '@/components/database/MonsterStageSections';

// Datasets with curated, player-readable detail pages. Only these are
// candidates for indexing; everything else stays noindex even when
// site-wide indexing is enabled.
const CURATED_DATASETS = new Set(['heroes', 'items', 'monsters', 'stages']);

// Is this entity page substantial enough to index?
function isIndexableEntity(dataset: string, key: string): boolean {
  if (!CURATED_DATASETS.has(dataset)) return false;
  if (dataset === 'heroes' || dataset === 'stages' || dataset === 'monsters') return true;
  return getSourcedItemIds().has(Number(key));
}

export const dynamic = 'force-dynamic';

export function generateMetadata({
  params: { locale, dataset, key },
}: {
  params: { locale: string; dataset: string; key: string };
}): Metadata {
  const meta = getDatasetMeta(dataset);
  const row = getRow(dataset, decodeURIComponent(key));
  const name = meta && row ? rowName(row, meta, locale) : key;
  const baseUrl = SITE_URL;
  const path =
    locale === 'en'
      ? `/database/${dataset}/${key}`
      : `/${locale}/database/${dataset}/${key}`;

  if (dataset === 'heroes') {
    const hero = getHeroProfile(decodeURIComponent(key), locale);
    if (hero) {
      return {
        title: `${hero.name} — Skills, Stats & Gear`,
        description: `${hero.name} (${hero.classType}) guide for TBH: Task Bar Hero — ${hero.description} Base stats, all ${hero.actives.length} active skills with per-level values, passive upgrades and usable ${hero.mainWeapon.toLowerCase()}/${hero.subWeapon.toLowerCase()} gear.`,
        alternates: { canonical: `${baseUrl}${path}` },
      };
    }
  }

  return {
    title: `${name} | ${meta?.label ?? dataset}`,
    description: `${name} — full stats and details from the TBH: Task Bar Hero ${meta?.label ?? dataset} database.`,
    alternates: { canonical: `${baseUrl}${path}` },
    // Thin entity pages stay out of the index even after launch.
    ...(isIndexableEntity(dataset, decodeURIComponent(key))
      ? {}
      : { robots: { index: false, follow: true } }),
  };
}

function isScalar(v: unknown): boolean {
  return v === null || ['string', 'number', 'boolean'].includes(typeof v);
}

export default function DatasetDetailPage({
  params: { locale, dataset, key },
}: {
  params: { locale: string; dataset: string; key: string };
}) {
  const meta = getDatasetMeta(dataset);
  if (!meta) notFound();
  const row = getRow(dataset, decodeURIComponent(key));
  if (!row) notFound();

  // Heroes get a curated, player-readable page instead of the raw field dump.
  if (dataset === 'heroes') {
    const hero = getHeroProfile(decodeURIComponent(key), locale);
    if (hero) {
      return (
        <div className="tbh-root tbh-grain font-display min-h-screen">
          <div className="tbh-scanline" aria-hidden />
          <Header />
          <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8">
            <nav className="font-mono text-[11px] uppercase tracking-widest text-faint mb-4">
              <Link href="/database" prefetch={false} className="hover:text-gold transition-colors">
                Database
              </Link>
              <span className="mx-2">/</span>
              <Link href="/database/heroes" prefetch={false} className="hover:text-gold transition-colors">
                Heroes
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gold">{hero.name}</span>
            </nav>
            <HeroDetail hero={hero} />
          </main>
        </div>
      );
    }
  }

  const id = idField(meta);
  const name = rowName(row, meta, locale);
  const icon = rowIconUrl(row);

  const scalarEntries = meta.columns
    .filter((c) => !c.endsWith('_i18n') && isScalar(row[c]) && row[c] !== null && row[c] !== '')
    .map((c) => [c, row[c]] as const);

  const complexEntries = meta.columns
    .filter((c) => !c.endsWith('_i18n') && !isScalar(row[c]) && row[c] != null)
    .map((c) => [c, row[c]] as const);

  // Curated datasets show a player-readable layer first; the raw field dump
  // moves into a collapsed "Raw game data" section.
  const itemGuide = dataset === 'items' ? getItemGuide(decodeURIComponent(key), locale) : null;
  const stageSummary = dataset === 'stages' ? getStageSummary(decodeURIComponent(key), locale) : null;
  const hasCuratedHeader = itemGuide != null || stageSummary != null;

  return (
    <div className="tbh-root tbh-grain font-display min-h-screen">
      <div className="tbh-scanline" aria-hidden />
      <Header />
      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8">
        <nav className="font-mono text-[11px] uppercase tracking-widest text-faint mb-4">
          <Link href="/database" prefetch={false} className="hover:text-gold transition-colors">
            Database
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/database/${dataset}`} prefetch={false} className="hover:text-gold transition-colors">
            {meta.label}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gold">{name}</span>
        </nav>

        {itemGuide ? (
          <ItemHeader item={itemGuide} />
        ) : stageSummary ? (
          <header className="tbh-frame mb-8 p-6">
            <p className="font-mono text-[11px] uppercase tracking-widest text-faint mb-1">
              Stage{stageSummary.act != null && ` · Act ${stageSummary.act}${stageSummary.stageNo != null ? `-${stageSummary.stageNo}` : ''}`}
              {stageSummary.level != null && ` · Level ${stageSummary.level}`}
              {stageSummary.type !== 'NORMAL' && ` · ${stageSummary.type}`}
            </p>
            <h1 className="font-display text-2xl md:text-4xl font-bold text-ink uppercase tracking-wide mb-3">
              {stageSummary.name}
            </h1>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-xs text-dim">
              {stageSummary.waveAmount != null && (
                <span>{stageSummary.waveAmount} waves × {stageSummary.waveMonsterAmount ?? '?'} monsters</span>
              )}
              {stageSummary.bossName && (
                <span>
                  Boss: <span className="text-rarity-immortal">{stageSummary.bossName}</span>
                </span>
              )}
              {stageSummary.nextStage && (
                <Link
                  href={`/database/stages/${stageSummary.nextStage.key}`}
                  prefetch={false}
                  className="text-gold hover:underline"
                >
                  Next: {stageSummary.nextStage.name} →
                </Link>
              )}
            </div>
          </header>
        ) : (
          <header className="mb-8 border-b border-line pb-4 flex items-center gap-4">
            {icon && (
              <div className="w-16 h-16 shrink-0 bg-panel border border-line flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={icon} alt={name} width={64} height={64} className="w-full h-full object-contain [image-rendering:pixelated]" />
              </div>
            )}
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-gold mb-1">
                {meta.label} · {id} {String(row[id])}
              </p>
              <h1 className="font-display text-2xl md:text-4xl font-bold text-ink uppercase tracking-wide">
                {name}
              </h1>
            </div>
          </header>
        )}

        {!hasCuratedHeader && (
          <section className="mb-8">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-faint mb-3">Stats</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line">
              {scalarEntries.map(([c, v]) => {
                const fk = resolveFk(c, v, id);
                return (
                  <div key={c} className="bg-surface px-3 py-2">
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-faint truncate">{c}</dt>
                    <dd className="font-mono text-sm truncate">
                      {fk ? (
                        <Link
                          href={`/database/${fk.dataset}/${encodeURIComponent(fk.key)}`}
                          prefetch={false}
                          className="text-gold hover:underline"
                        >
                          {String(v)} ↗
                        </Link>
                      ) : (
                        <span className="text-ink">{String(v)}</span>
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>
        )}

        {dataset === 'items' && (
          <ItemSourcesSection sources={getItemSources(decodeURIComponent(key), locale)} />
        )}

        {dataset === 'monsters' && (() => {
          const guide = getMonsterGuide(decodeURIComponent(key), locale);
          return guide ? <MonsterAppearances guide={guide} /> : null;
        })()}

        {dataset === 'stages' && (() => {
          const guide = getStageGuide(decodeURIComponent(key), locale);
          return guide ? <StageOverview guide={guide} /> : null;
        })()}

        {hasCuratedHeader && (
          <details className="tbh-frame mt-10 mb-8">
            <summary className="cursor-pointer px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-faint hover:text-gold">
              Raw game data
            </summary>
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border-t border-line">
              {scalarEntries.map(([c, v]) => (
                <div key={c} className="bg-surface px-3 py-2">
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-faint truncate">{c}</dt>
                  <dd className="font-mono text-sm truncate text-ink">{String(v)}</dd>
                </div>
              ))}
            </dl>
          </details>
        )}

        {complexEntries.length > 0 && (
          <section>
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-faint mb-3">Details</h2>
            <div className="space-y-3">
              {complexEntries.map(([c, v]) => (
                <details key={c} className="tbh-frame">
                  <summary className="cursor-pointer px-3 py-2 font-mono text-xs uppercase tracking-wider text-dim hover:text-gold">
                    {c}
                  </summary>
                  <pre className="px-3 py-2 text-xs text-dim overflow-x-auto border-t border-line/50 max-h-[400px]">
                    {JSON.stringify(v, null, 2)}
                  </pre>
                </details>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
