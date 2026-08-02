import { JsonLd } from './JsonLd';
import { SITE_URL } from '@/lib/site';

interface WebsiteSchemaProps {
  name: string;
  url: string;
  description: string;
  logoUrl?: string;
}

export function WebsiteSchema({
  name,
  url,
  description,
  logoUrl = `${SITE_URL}/images/logo.png`,
}: WebsiteSchemaProps) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            name,
            url,
            description,
            publisher: {
              '@type': 'Organization',
              name,
              url,
              logo: {
                '@type': 'ImageObject',
                url: logoUrl,
              },
            },
          },
          {
            '@type': 'Organization',
            name,
            url,
            logo: {
              '@type': 'ImageObject',
              url: logoUrl,
            },
          },
        ],
      }}
    />
  );
}
