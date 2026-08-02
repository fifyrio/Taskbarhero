import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { Link } from '@/i18n/routing';
import Header from '@/components/common/Header';
import { SectionHeader, Icon } from '@/components/tier-home/primitives';
import TierListCard from '@/components/tier-lists/TierListCard';
import { getRecentTierLists, getTrendingTierLists } from '@/lib/tier-lists';
import type { TierListSummary } from '@/types/tier-list';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const baseUrl = SITE_URL;
  const path = locale === 'en' ? '/tier-lists' : `/${locale}/tier-lists`;
  return {
    title: 'Tier Lists da Comunidade | Taskbar Hero',
    description:
      'Explore, vote e crie tier lists de jogos feitas pela comunidade. Rankings S/A/B/C/D/F com estilo.',
    alternates: { canonical: `${baseUrl}${path}` },
    openGraph: {
      title: 'Tier Lists da Comunidade | Taskbar Hero',
      description:
        'Explore, vote e crie tier lists de jogos feitas pela comunidade.',
      url: `${baseUrl}${path}`,
      type: 'website',
    },
  };
}

async function safeList(
  fn: () => Promise<{ success: boolean; data?: TierListSummary[] }>
): Promise<TierListSummary[]> {
  try {
    const res = await fn();
    return res.success && res.data ? res.data : [];
  } catch {
    return [];
  }
}

export default async function TierListsIndexPage() {
  const [recent, trending] = await Promise.all([
    safeList(getRecentTierLists),
    safeList(getTrendingTierLists),
  ]);

  const hasAny = recent.length > 0 || trending.length > 0;

  return (
    <div className="tbh-root tbh-grain font-display min-h-screen">
      <div className="tbh-scanline" aria-hidden />
      <Header />
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-gold mb-2">
              {'// DATABASE_DE_RANKINGS'}
            </p>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-ink uppercase tracking-wide">
              Tier Lists
            </h1>
          </div>
          <Link
            href="/tier-lists/new"
            className="tbh-lift inline-flex items-center gap-2 bg-gold text-black font-mono text-xs uppercase tracking-widest font-bold px-5 py-3 hover:brightness-110 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <Icon name="add" className="text-[16px] leading-none" />
            Criar tier list
          </Link>
        </header>

        {!hasAny ? (
          <div className="border border-line bg-surface p-12 text-center">
            <Icon name="leaderboard" className="text-gold text-4xl mb-4" />
            <p className="font-display text-xl text-ink font-bold mb-2">
              Nenhuma tier list ainda
            </p>
            <p className="font-mono text-xs text-faint uppercase mb-6">
              Seja o primeiro a publicar um ranking.
            </p>
            <Link
              href="/tier-lists/new"
              className="inline-flex items-center gap-2 bg-gold text-black font-mono text-xs uppercase tracking-widest font-bold px-5 py-3 hover:brightness-110 transition"
            >
              <Icon name="add" className="text-[16px] leading-none" />
              Criar a primeira
            </Link>
          </div>
        ) : (
          <>
            {trending.length > 0 && (
              <section className="mb-14">
                <SectionHeader title="EM ALTA" tag="TRENDING" live />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {trending.map((list) => (
                    <TierListCard key={`t-${list.id}`} list={list} />
                  ))}
                </div>
              </section>
            )}

            {recent.length > 0 && (
              <section className="mb-14">
                <SectionHeader title="RECENTES" tag="RECENT" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recent.map((list) => (
                    <TierListCard key={`r-${list.id}`} list={list} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
