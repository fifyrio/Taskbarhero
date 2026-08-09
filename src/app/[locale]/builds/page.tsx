import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import Header from '@/components/common/Header';
import { SITE_URL } from '@/lib/site';
import { getAllClassBuilds } from '@/lib/builds';
import { BreadcrumbSchema } from '@/components/seo';

export const dynamic = 'force-dynamic';

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Metadata {
  const path = locale === 'en' ? '/builds' : `/${locale}/builds`;
  return {
    title: 'TBH Builds — Best Task Bar Hero Class Builds & Tier List',
    description:
      'The best TBH: Task Bar Hero builds for every class — Sorcerer, Ranger, Priest, Knight, Hunter and Slayer. Stat priorities, weapon focus, skills and community tier lists.',
    keywords: [
      'tbh build',
      'tbh builds',
      'task bar hero build',
      'tbh best build',
      'tbh class tier list',
    ],
    alternates: { canonical: `${SITE_URL}${path}` },
  };
}

export default function BuildsIndexPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const builds = getAllClassBuilds(locale);
  const path = locale === 'en' ? '/builds' : `/${locale}/builds`;

  return (
    <div className="tbh-root tbh-grain font-display min-h-screen">
      <div className="tbh-scanline" aria-hidden />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Builds', url: `${SITE_URL}${path}` },
        ]}
      />
      <Header />
      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8">
        <nav className="font-mono text-[11px] uppercase tracking-widest text-faint mb-4">
          <Link href="/" prefetch={false} className="hover:text-gold transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gold">Builds</span>
        </nav>

        <header className="mb-8 border-b border-line pb-5">
          <p className="font-mono text-[11px] uppercase tracking-widest text-gold mb-2">
            Task Bar Hero
          </p>
          <h1 className="font-display text-2xl md:text-4xl font-bold text-ink uppercase tracking-wide mb-3">
            TBH Builds
          </h1>
          <p className="font-sans text-sm sm:text-base text-ink/85 leading-relaxed max-w-2xl">
            Class builds for <strong className="text-ink">TBH: Task Bar Hero</strong>. Each guide
            covers stat priority, weapon and gear focus, and every active/passive skill — with data
            pulled straight from the game. Vote on the best setups in the{' '}
            <Link href="/tier-lists" prefetch={false} className="text-gold hover:underline">
              community tier lists
            </Link>
            .
          </p>
        </header>

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {builds.map((b) => (
              <Link
                key={b.slug}
                href={`/builds/${b.slug}`}
                prefetch={false}
                className="tbh-lift tbh-frame tbh-frame-hover group p-5 flex gap-4 items-start transition-colors"
              >
                <div className="w-14 h-14 shrink-0 bg-panel border border-line group-hover:border-gold transition-colors flex items-center justify-center overflow-hidden">
                  {b.profile.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={b.profile.icon}
                      alt=""
                      width={56}
                      height={56}
                      className="w-full h-full object-contain [image-rendering:pixelated]"
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <h2 className="font-display text-lg font-bold text-ink uppercase tracking-wide group-hover:text-gold transition-colors">
                      {b.profile.name}
                    </h2>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-faint">
                      {b.role}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-dim leading-relaxed">{b.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
