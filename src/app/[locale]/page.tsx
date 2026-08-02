import { getTranslations } from 'next-intl/server';
import { SITE_URL } from '@/lib/site';
import { Metadata } from 'next';
import WikiHome from '@/components/wiki-home/WikiHome';
import { WebsiteSchema, BreadcrumbSchema } from '@/components/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'pages.home.seo' });
  const tHero = await getTranslations({ locale, namespace: 'pages.home.hero' });

  // SEO Best Practice: Canonical URL should always point to the production domain
  // to prevent duplicate content issues across different environments (dev, staging, etc.)
  // English locale uses root path without /en prefix, other locales use /{locale} prefix
  const baseUrl = SITE_URL;
  const pathSegment = locale === 'en' ? '' : `/${locale}`;
  const canonicalUrl = `${baseUrl}${pathSegment}`;

  const getOGLocale = (locale: string): string => {
    const localeMap: Record<string, string> = {
      'en': 'en_US',
      'zh': 'zh_CN',
      'zh-TW': 'zh_TW',
      'ja': 'ja_JP',
      'ko': 'ko_KR',
      'id': 'id_ID',
      'de': 'de_DE',
      'fr': 'fr_FR',
      'es': 'es_ES',
      'pt': 'pt_BR',
      'ru': 'ru_RU',
      'ar': 'ar_AR',
      'th': 'th_TH',
      'vi': 'vi_VN',
      'it': 'it_IT'
    };
  
    return localeMap[locale] || 'en_US';
  };

  return {
    title: t('title'),
    description: t('description'),
    keywords: [
      'Task Bar Hero',
      'TBH wiki',
      'TBH database',
      'Task Bar Hero heroes',
      'Task Bar Hero items',
      'Task Bar Hero gear',
      'Task Bar Hero tier list'
    ],
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: canonicalUrl,
      siteName: 'Taskbar Hero',
      images: [
        {
          url: `${baseUrl}/images/logo.png`, // Using logo as default OG image for now
          width: 1200,
          height: 630,
          alt: tHero('title1') + ' ' + tHero('title2'),
        },
      ],
      locale: getOGLocale(locale),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('ogTitle'),
      description: t('ogDescription'),
      images: [`${baseUrl}/images/logo.png`],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function HomePage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const t = await getTranslations({ locale, namespace: 'pages.home.seo' });
  const baseUrl = SITE_URL;
  const pathSegment = locale === 'en' ? '' : `/${locale}`;

  return (
    <>
      <WebsiteSchema
        name="Taskbar Hero"
        url={`${baseUrl}${pathSegment}`}
        description={t('description')}
      />
      <BreadcrumbSchema
        items={[{ name: 'Home', url: `${baseUrl}${pathSegment}` }]}
      />
      <WikiHome locale={locale} />
    </>
  );
}