import '../globals.css';
import { Inter, Instrument_Serif, Barlow, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import Footer from '@/components/common/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import AppToaster from '@/components/common/AppToaster';
import CookieConsent from '@/components/common/CookieConsent';
import GoogleOneTap from '@/components/auth/GoogleOneTap';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-heading',
  display: 'swap',
});

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata = {
  title: 'Taskbar Hero - AI Image Editor',
  description: 'Generate and edit images with the power of AI',
  metadataBase: new URL('https://www.taskbarhero.wiki'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${instrumentSerif.variable} ${barlow.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6420997954410485" crossOrigin="anonymous"></script>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-VSCPE0FT5G"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-VSCPE0FT5G');
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <AppToaster />
            <CookieConsent />
            <GoogleOneTap />
          </AuthProvider>
          <Analytics />
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
