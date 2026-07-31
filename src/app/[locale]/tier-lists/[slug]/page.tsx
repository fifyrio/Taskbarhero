import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import Header from '@/components/common/Header';
import { Icon } from '@/components/tier-home/primitives';
import UpvoteButton from '@/components/tier-lists/UpvoteButton';
import { rarityBorder, TIER_GRADES, TIER_CHIP_CLASS } from '@/components/tier-lists/rarity';
import { getTierListBySlug } from '@/lib/tier-lists';
import type { TierListWithItems, TierListItem } from '@/types/tier-list';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://www.taskbarhero.wiki';

async function fetchList(slug: string): Promise<TierListWithItems | null> {
  try {
    const res = await getTierListBySlug(slug);
    return res.success && res.data ? res.data : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string };
}): Promise<Metadata> {
  const list = await fetchList(slug);
  if (!list) {
    return { title: 'Tier list não encontrada | Taskbar Hero' };
  }
  const path =
    locale === 'en'
      ? `/tier-lists/${slug}`
      : `/${locale}/tier-lists/${slug}`;
  const description =
    list.description ?? `Tier list ${list.title} — ranking da comunidade.`;
  return {
    title: `${list.title} | Tier List`,
    description,
    alternates: { canonical: `${BASE_URL}${path}` },
    openGraph: {
      title: list.title,
      description,
      url: `${BASE_URL}${path}`,
      type: 'article',
      images: list.coverUrl ? [{ url: list.coverUrl }] : undefined,
    },
  };
}

function EntityTile({ item }: { item: TierListItem }) {
  const entity = item.entity;
  const name = entity?.name ?? 'Item';
  return (
    <div
      className={`group relative w-16 h-16 border-2 ${rarityBorder(
        entity?.rarity
      )} bg-[#0a0c10] flex-shrink-0 overflow-hidden`}
      title={name}
    >
      {entity?.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={entity.imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="font-mono text-[9px] text-faint uppercase text-center px-1 leading-tight">
            {name.slice(0, 8)}
          </span>
        </div>
      )}
      <span className="absolute bottom-0 inset-x-0 bg-black/70 text-ink font-mono text-[8px] uppercase truncate px-1 opacity-0 group-hover:opacity-100 transition">
        {name}
      </span>
    </div>
  );
}

export default async function TierListViewerPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const list = await fetchList(slug);
  if (!list) notFound();

  const byTier = TIER_GRADES.map((grade) => ({
    grade,
    items: list.items.filter((it) => it.tier === grade),
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: list.title,
    description: list.description ?? undefined,
    url: `${BASE_URL}/tier-lists/${list.slug}`,
    datePublished: list.publishedAt ?? list.createdAt,
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: 'https://schema.org/LikeAction',
      userInteractionCount: list.upvotes,
    },
  };

  return (
    <div className="tbh-root tbh-grain font-display min-h-screen">
      <div className="tbh-scanline" aria-hidden />
      <Header />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/tier-lists"
          className="inline-flex items-center gap-1 font-mono text-[11px] uppercase text-faint hover:text-gold transition mb-6"
        >
          <Icon name="arrow_back" className="text-[14px] leading-none" />
          Voltar
        </Link>

        <header className="border-b border-line pb-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="min-w-0">
              {list.category && (
                <span className="font-mono text-[10px] uppercase tracking-widest text-gold bg-gold/10 px-2 py-1">
                  {list.category}
                </span>
              )}
              <h1 className="font-display text-2xl md:text-4xl font-bold text-ink uppercase tracking-wide mt-3">
                {list.title}
              </h1>
              <div className="flex items-center gap-4 mt-3 font-mono text-[11px] uppercase text-faint">
                <span className="flex items-center gap-1">
                  <Icon name="visibility" className="text-[13px] leading-none" />
                  {list.views}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="forum" className="text-[13px] leading-none" />
                  {list.commentCount}
                </span>
              </div>
            </div>
            <UpvoteButton tierListId={list.id} initialUpvotes={list.upvotes} />
          </div>
          {list.description && (
            <p className="text-faint text-sm mt-4 max-w-2xl leading-relaxed">
              {list.description}
            </p>
          )}
        </header>

        <section aria-label="Tier rows" className="space-y-px bg-line border border-line">
          {byTier.map(({ grade, items }) => (
            <div
              key={grade}
              className="flex items-stretch gap-3 bg-surface p-3 min-h-[92px]"
            >
              <div
                className={`w-16 flex-shrink-0 flex items-center justify-center font-display font-bold text-2xl ${
                  TIER_CHIP_CLASS[grade] ?? 'bg-panel text-ink'
                }`}
              >
                {grade}
              </div>
              <div className="flex flex-wrap items-center gap-2 flex-grow">
                {items.length > 0 ? (
                  items.map((item) => <EntityTile key={item.id} item={item} />)
                ) : (
                  <span className="font-mono text-[10px] uppercase text-faint">
                    — vazio —
                  </span>
                )}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
