import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import Header from '@/components/common/Header';
import { getDatasetMeta, getRow, idField, rowName, rowIconUrl, resolveFk } from '@/lib/database';
import { getHeroProfile } from '@/lib/hero';
import HeroDetail from '@/components/database/HeroDetail';
import { getItemSources, getMonsterGuide, getStageGuide } from '@/lib/drops';
import ItemSourcesSection from '@/components/database/ItemSourcesSection';
import { MonsterAppearances, StageOverview } from '@/components/database/MonsterStageSections';

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
