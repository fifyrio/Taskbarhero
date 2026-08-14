import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import Header from '@/components/common/Header';
import { SITE_URL } from '@/lib/site';
import { getClassBuild, BUILD_SLUGS } from '@/lib/builds';
import { BreadcrumbSchema, FAQSchema } from '@/components/seo';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return BUILD_SLUGS.map((c) => ({ class: c }));
}

export function generateMetadata({
  params: { locale, class: slug },
}: {
  params: { locale: string; class: string };
}): Metadata {
  const build = getClassBuild(slug, locale);
  if (!build) return {};
  const path = locale === 'en' ? `/builds/${slug}` : `/${locale}/builds/${slug}`;
  const name = build.profile.name;
  return {
    title: `${build.keyword} — Best ${name} Build & Skills (TBH)`,
    description: `The best ${name} build for TBH: Task Bar Hero. ${build.tagline} Stat priority: ${build.statPriority.slice(0, 3).join(' > ')}. Full skills, weapon focus and gear guide.`,
    keywords: [
      `tbh ${name.toLowerCase()} build`,
      `${name.toLowerCase()} build tbh`,
      `task bar hero ${name.toLowerCase()}`,
      'tbh build',
    ],
    alternates: { canonical: `${SITE_URL}${path}` },
  };
}

export default function ClassBuildPage({
  params: { locale, class: slug },
}: {
  params: { locale: string; class: string };
}) {
  const build = getClassBuild(slug, locale);
  if (!build) notFound();

  const { profile } = build;
  const path = locale === 'en' ? `/builds/${slug}` : `/${locale}/builds/${slug}`;
  const name = profile.name;

  const faqs = [
    {
      question: `What is the best ${name} build in TBH: Task Bar Hero?`,
      answer: `${build.overview} Prioritise stats in this order: ${build.statPriority.join(' > ')}.`,
    },
    {
      question: `What stats should a ${name} prioritise?`,
      answer: `For the ${name} (${build.role}), roll gear and invest passives toward ${build.statPriority.join(' > ')}.`,
    },
    {
      question: `What weapons does the ${name} use?`,
      answer: `The ${name} equips a ${profile.mainWeapon.toLowerCase()} as its main weapon and a ${profile.subWeapon.toLowerCase()} off-hand${
        build.weaponFocus[1].stat ? `, which scales ${build.weaponFocus[1].stat}` : ''
      }.`,
    },
  ];

  return (
    <div className="tbh-root tbh-grain font-display min-h-screen">
      <div className="tbh-scanline" aria-hidden />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Builds', url: `${SITE_URL}${locale === 'en' ? '' : `/${locale}`}/builds` },
          { name: `${name} Build`, url: `${SITE_URL}${path}` },
        ]}
      />
      <FAQSchema items={faqs} />
      <Header />
      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8">
        <nav className="font-mono text-[11px] uppercase tracking-widest text-faint mb-4">
          <Link href="/builds" prefetch={false} className="hover:text-gold transition-colors">
            Builds
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gold">{name}</span>
        </nav>

        {/* Header */}
        <header className="tbh-frame mb-8 p-6 flex flex-col sm:flex-row gap-5 sm:items-center">
          {profile.icon && (
            <div className="w-20 h-20 shrink-0 bg-panel border border-line flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.icon}
                alt={name}
                width={80}
                height={80}
                className="w-full h-full object-contain [image-rendering:pixelated]"
              />
            </div>
          )}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-gold mb-1">
              {build.role} · Task Bar Hero
            </p>
            <h1 className="font-display text-2xl md:text-4xl font-bold text-ink uppercase tracking-wide mb-2">
              {name} Build
            </h1>
            <p className="font-sans text-sm text-ink/85 leading-relaxed max-w-xl">{build.tagline}</p>
          </div>
        </header>

        {/* Overview */}
        <section className="mb-8">
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-faint mb-3">Overview</h2>
          <p className="font-sans text-sm sm:text-base text-ink/90 leading-relaxed max-w-2xl">
            {build.overview}
          </p>
        </section>

        {/* Stat priority + weapon focus */}
        <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-faint mb-3">
              Stat priority
            </h2>
            <ol className="space-y-1.5">
              {build.statPriority.map((s, i) => (
                <li key={s} className="flex items-center gap-3 font-sans text-sm">
                  <span className="font-pixel text-[11px] text-gold w-6 shrink-0">{i + 1}.</span>
                  <span className="text-ink">{s}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-faint mb-3">
              Weapon &amp; off-hand
            </h2>
            <ul className="space-y-2">
              {build.weaponFocus.map((w) => (
                <li key={w.slot} className="tbh-frame px-4 py-3">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-faint">
                    {w.slot}
                  </div>
                  <div className="font-display text-sm font-bold text-ink uppercase tracking-wide">
                    {w.gearType.charAt(0) + w.gearType.slice(1).toLowerCase()}
                  </div>
                  {w.stat && (
                    <div className="font-mono text-[11px] text-dim mt-0.5">Scales {w.stat}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Base stats */}
        <section className="mb-8">
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-faint mb-3">
            Base stats
          </h2>
          <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-line border border-line">
            {profile.stats.map((s) => (
              <div key={s.key} className="bg-surface px-3 py-2">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-faint truncate">
                  {s.label}
                </dt>
                <dd className="font-mono text-sm text-ink">{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Skills */}
        {profile.actives.length > 0 && (
          <section className="mb-8">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-faint mb-3">
              Active skills
            </h2>
            <div className="space-y-3">
              {profile.actives.map((sk) => (
                <div key={sk.key} className="tbh-frame p-4">
                  <div className="flex items-baseline justify-between gap-3 mb-1">
                    <h3 className="font-display text-sm font-bold text-ink uppercase tracking-wide">
                      {sk.name}
                    </h3>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-faint shrink-0">
                      {sk.trigger}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-dim leading-relaxed">{sk.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured gear */}
        {profile.gear.some((g) => g.featured.length > 0) && (
          <section className="mb-8">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-faint mb-3">
              Top gear
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {profile.gear
                .flatMap((g) => g.featured)
                .slice(0, 12)
                .map((it) => (
                  <Link
                    key={it.id}
                    href={`/database/items/${it.id}`}
                    prefetch={false}
                    className="tbh-lift tbh-frame tbh-frame-hover group p-3 text-center transition-colors"
                  >
                    <span className="block w-10 h-10 mx-auto mb-2 bg-panel border border-line group-hover:border-gold transition-colors overflow-hidden">
                      {it.icon ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={it.icon}
                          alt=""
                          width={40}
                          height={40}
                          className="w-full h-full object-contain [image-rendering:pixelated]"
                        />
                      ) : null}
                    </span>
                    <span className="font-sans text-xs text-ink group-hover:text-gold transition-colors truncate block">
                      {it.name}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-faint">
                      {it.grade}
                    </span>
                  </Link>
                ))}
            </div>
          </section>
        )}

        {/* Community tier lists CTA */}
        <section className="tbh-frame p-6 mb-8 text-center">
          <h2 className="font-display text-lg font-bold text-ink uppercase tracking-wide mb-2">
            Rank the best {name} setups
          </h2>
          <p className="font-sans text-sm text-dim mb-4 max-w-lg mx-auto">
            Builds are only as good as the community agrees. Vote on tier lists or publish your own
            {' '}{name} ranking.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tier-lists"
              prefetch={false}
              className="tbh-btn font-pixel text-[11px] px-8 py-4 uppercase"
            >
              Browse tier lists
            </Link>
            <Link
              href={`/database/heroes/${build.heroKey}`}
              prefetch={false}
              className="tbh-btn-ghost font-pixel text-[11px] px-8 py-4 uppercase"
            >
              {name} full data
            </Link>
          </div>
        </section>

        {/* Other classes */}
        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-faint mb-3">
            Other class builds
          </h2>
          <div className="flex flex-wrap gap-2">
            {BUILD_SLUGS.filter((s) => s !== slug).map((s) => (
              <Link
                key={s}
                href={`/builds/${s}`}
                prefetch={false}
                className="tbh-frame px-3 py-1.5 font-mono text-xs text-dim hover:text-gold transition-colors capitalize"
              >
                {s} build
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
