import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import Header from '@/components/common/Header';
import { SITE_URL } from '@/lib/site';
import { BreadcrumbSchema } from '@/components/seo';

export const dynamic = 'force-dynamic';

const TOOLS = [
  {
    href: '/tools/grades',
    title: 'Grades & Rarity',
    blurb: 'Every gear grade from Common to Cosmic — mod slots, alchemy value and cube EXP.',
  },
  {
    href: '/database',
    title: 'TBH Index',
    blurb: 'The full searchable database of heroes, items, monsters, runes, skills and stages.',
  },
  {
    href: '/builds',
    title: 'Class Builds',
    blurb: 'Stat priorities, weapon focus and skills for all six classes.',
  },
  {
    href: '/tier-lists',
    title: 'Tier Lists',
    blurb: 'Community S–F rankings you can vote on or build yourself.',
  },
];

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Metadata {
  const path = locale === 'en' ? '/tools' : `/${locale}/tools`;
  return {
    title: 'TBH Tools — Task Bar Hero Index, Grades & Calculators',
    description:
      'Task Bar Hero tools and references — the TBH index, gear grade & rarity tables, class builds and community tier lists.',
    keywords: ['tbh tools', 'tbh index', 'tbh grades', 'task bar hero tools'],
    alternates: { canonical: `${SITE_URL}${path}` },
  };
}

export default function ToolsIndexPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const path = locale === 'en' ? '/tools' : `/${locale}/tools`;
  return (
    <div className="tbh-root tbh-grain font-display min-h-screen">
      <div className="tbh-scanline" aria-hidden />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Tools', url: `${SITE_URL}${path}` },
        ]}
      />
      <Header />
      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8">
        <nav className="font-mono text-[11px] uppercase tracking-widest text-faint mb-4">
          <Link href="/" prefetch={false} className="hover:text-gold transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gold">Tools</span>
        </nav>
        <header className="mb-8 border-b border-line pb-5">
          <p className="font-mono text-[11px] uppercase tracking-widest text-gold mb-2">
            Task Bar Hero
          </p>
          <h1 className="font-display text-2xl md:text-4xl font-bold text-ink uppercase tracking-wide mb-3">
            TBH Tools
          </h1>
          <p className="font-sans text-sm sm:text-base text-ink/85 leading-relaxed max-w-2xl">
            References and tools for <strong className="text-ink">TBH: Task Bar Hero</strong> —
            grade tables, the full game index, builds and tier lists.
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TOOLS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              prefetch={false}
              className="tbh-lift tbh-frame tbh-frame-hover group p-5 transition-colors"
            >
              <h2 className="font-display text-lg font-bold text-ink uppercase tracking-wide group-hover:text-gold transition-colors mb-1">
                {t.title}
              </h2>
              <p className="font-sans text-xs text-dim leading-relaxed">{t.blurb}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
