import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import Header from '@/components/common/Header';
import BuilderClient from './BuilderClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const path = locale === 'en' ? '/tier-lists/new' : `/${locale}/tier-lists/new`;
  return {
    title: 'Create Tier List | TBH Wiki',
    description: 'Build your own TBH: Task Bar Hero tier list and share it with the community.',
    alternates: { canonical: `${SITE_URL}${path}` },
    robots: { index: false, follow: true },
  };
}

export default function NewTierListPage() {
  return (
    <div className="tbh-root tbh-grain font-display min-h-screen">
      <div className="tbh-scanline" aria-hidden />
      <Header />
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <BuilderClient />
      </main>
    </div>
  );
}
