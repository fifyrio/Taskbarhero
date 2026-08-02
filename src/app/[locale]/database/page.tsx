import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { Link } from '@/i18n/routing';
import Header from '@/components/common/Header';
import { SectionHeader, Icon } from '@/components/tier-home/primitives';
import { getGroupedDatasets, getManifest } from '@/lib/database';

export const dynamic = 'force-dynamic';

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Metadata {
  const baseUrl = SITE_URL;
  const path = locale === 'en' ? '/database' : `/${locale}/database`;
  return {
    title: 'Database | Taskbar Hero Wiki',
    description:
      'Complete TBH: Task Bar Hero database — heroes, monsters, gear, items, runes, skills, stages and more.',
    alternates: { canonical: `${baseUrl}${path}` },
  };
}

export default function DatabaseOverviewPage() {
  const groups = getGroupedDatasets();
  const manifest = getManifest();

  return (
    <div className="tbh-root tbh-grain font-display min-h-screen">
      <div className="tbh-scanline" aria-hidden />
      <Header />
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
        <header className="mb-10">
          <p className="font-mono text-[11px] uppercase tracking-widest text-gold mb-2">
            {'// GAME_DATABASE'}
          </p>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-ink uppercase tracking-wide">
            Database
          </h1>
          <p className="font-mono text-xs text-faint uppercase mt-3">
            {manifest.dataset_count} datasets · {manifest.row_count.toLocaleString()} rows
          </p>
        </header>

        {groups.map((g) => (
          <section key={g.group} className="mb-12">
            <SectionHeader title={g.group.toUpperCase()} tag={`${g.datasets.length}`} />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {g.datasets.map((d) => (
                <Link
                  key={d.name}
                  href={`/database/${d.name}`}
                  prefetch={false}
                  className="tbh-lift group border border-line bg-surface hover:border-gold p-4 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display text-sm font-bold text-ink uppercase tracking-wide group-hover:text-gold transition-colors">
                      {d.label}
                    </span>
                    <Icon name="chevron_right" className="text-faint text-[18px] group-hover:text-gold transition-colors" />
                  </div>
                  <span className="font-mono text-[11px] text-faint uppercase">
                    {d.rows.toLocaleString()} rows
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
