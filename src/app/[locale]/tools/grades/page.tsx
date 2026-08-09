import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import Header from '@/components/common/Header';
import { SITE_URL } from '@/lib/site';
import { getRows } from '@/lib/database';
import { BreadcrumbSchema, FAQSchema } from '@/components/seo';

export const dynamic = 'force-dynamic';

// Display colour per grade. Some grades have design tokens; the rest use hex.
const GRADE_COLOR: Record<string, string> = {
  COMMON: '#9aa4b2',
  UNCOMMON: '#54fc0c',
  RARE: '#2f8bfc',
  LEGENDARY: '#fc9c0c',
  IMMORTAL: '#fc2424',
  ARCANA: '#b40cfc',
  BEYOND: '#ff4fd8',
  CELESTIAL: '#4fe0ff',
  DIVINE: '#fce454',
  COSMIC: '#ffffff',
};

const title = (g: string) => g.charAt(0) + g.slice(1).toLowerCase();

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Metadata {
  const path = locale === 'en' ? '/tools/grades' : `/${locale}/tools/grades`;
  return {
    title: 'TBH Grades & Rarity — Full Task Bar Hero Grade List',
    description:
      'Every gear grade and rarity in TBH: Task Bar Hero from Common to Cosmic — mod slots, alchemy gold and cube EXP for each tier, in order.',
    keywords: ['tbh grades', 'tbh rarity', 'tbh grade list', 'task bar hero rarity', 'tbh gear grades'],
    alternates: { canonical: `${SITE_URL}${path}` },
  };
}

export default function GradesToolPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const path = locale === 'en' ? '/tools/grades' : `/${locale}/tools/grades`;
  const grades = getRows('grades');
  const order = Object.keys(GRADE_COLOR);
  const sorted = [...grades].sort(
    (a, b) => order.indexOf(String(a.GRADE)) - order.indexOf(String(b.GRADE)),
  );

  const faqs = [
    {
      question: 'What are the gear grades in TBH: Task Bar Hero?',
      answer: `From lowest to highest, TBH gear grades are: ${sorted
        .map((g) => title(String(g.GRADE)))
        .join(', ')}.`,
    },
    {
      question: 'What is the highest rarity in Task Bar Hero?',
      answer:
        'Cosmic is the highest grade in TBH: Task Bar Hero, above Divine, Celestial and Beyond.',
    },
  ];

  return (
    <div className="tbh-root tbh-grain font-display min-h-screen">
      <div className="tbh-scanline" aria-hidden />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Tools', url: `${SITE_URL}${locale === 'en' ? '' : `/${locale}`}/tools` },
          { name: 'Grades & Rarity', url: `${SITE_URL}${path}` },
        ]}
      />
      <FAQSchema items={faqs} />
      <Header />
      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8">
        <nav className="font-mono text-[11px] uppercase tracking-widest text-faint mb-4">
          <Link href="/tools" prefetch={false} className="hover:text-gold transition-colors">
            Tools
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gold">Grades &amp; Rarity</span>
        </nav>

        <header className="mb-6 border-b border-line pb-5">
          <p className="font-mono text-[11px] uppercase tracking-widest text-gold mb-2">
            Task Bar Hero
          </p>
          <h1 className="font-display text-2xl md:text-4xl font-bold text-ink uppercase tracking-wide mb-3">
            TBH Grades &amp; Rarity
          </h1>
          <p className="font-sans text-sm sm:text-base text-ink/85 leading-relaxed max-w-2xl">
            Every gear grade in <strong className="text-ink">TBH: Task Bar Hero</strong>, lowest to
            highest. Higher grades unlock more mod slots (decoration, engraving, inscription) and are
            worth far more alchemy gold and cube EXP when salvaged.
          </p>
        </header>

        <div className="overflow-x-auto tbh-frame">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="font-mono text-[10px] uppercase tracking-widest text-faint border-b border-line">
                <th className="px-3 py-2.5">Grade</th>
                <th className="px-3 py-2.5 text-right">Mod slots</th>
                <th className="px-3 py-2.5 text-right">Decoration</th>
                <th className="px-3 py-2.5 text-right">Engraving</th>
                <th className="px-3 py-2.5 text-right">Inscription</th>
                <th className="px-3 py-2.5 text-right">Alchemy gold</th>
                <th className="px-3 py-2.5 text-right">Cube EXP</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              {sorted.map((g) => {
                const grade = String(g.GRADE);
                return (
                  <tr key={grade} className="border-b border-line/50 hover:bg-panel/40">
                    <td className="px-3 py-2.5">
                      <span
                        className="font-display font-bold uppercase tracking-wide"
                        style={{ color: GRADE_COLOR[grade] }}
                      >
                        {title(grade)}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right text-ink">
                      {Number(g.InherentSlotAmount ?? 0)}
                    </td>
                    <td className="px-3 py-2.5 text-right text-dim">
                      {Number(g.ExtraSlotAmount_Decoration ?? 0)}
                    </td>
                    <td className="px-3 py-2.5 text-right text-dim">
                      {Number(g.ExtraSlotAmount_Engraving ?? 0)}
                    </td>
                    <td className="px-3 py-2.5 text-right text-dim">
                      {Number(g.ExtraSlotAmount_Inscription ?? 0)}
                    </td>
                    <td className="px-3 py-2.5 text-right text-ink">
                      {Number(g.BaseAlchemyGold ?? 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-right text-ink">
                      {Number(g.BaseCubeExp ?? 0).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <section className="tbh-frame p-6 mt-8 text-center">
          <h2 className="font-display text-lg font-bold text-ink uppercase tracking-wide mb-2">
            Rank gear by grade
          </h2>
          <p className="font-sans text-sm text-dim mb-4 max-w-lg mx-auto">
            See which high-grade gear the community rates best, or browse the full item database.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tier-lists"
              prefetch={false}
              className="tbh-btn font-pixel text-[11px] px-8 py-4 uppercase"
            >
              Gear tier lists
            </Link>
            <Link
              href="/database/items"
              prefetch={false}
              className="tbh-btn-ghost font-pixel text-[11px] px-8 py-4 uppercase"
            >
              Item database
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
