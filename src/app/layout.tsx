import type { Metadata, Viewport } from 'next';
import './globals.css';
import { site } from '@/data/site';
import TimeProvider from '@/components/providers/TimeProvider';
import Ambient from '@/components/scene/Ambient';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import ScrollReset from '@/components/layout/ScrollReset';
import SoundToggle from '@/components/layout/SoundToggle';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | ${site.role}`, template: `%s | ${site.shortName}'s little home` },
  description: site.description,
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/assets/icons/skill-frontend.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: `${site.name} | ${site.role}`,
    description: site.description,
    url: site.url,
    siteName: `${site.name}'s Cozy Home`,
    images: [
      {
        url: `${site.url}/assets/og/og-image.jpg`,
        secureUrl: `${site.url}/assets/og/og-image.jpg`,
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: `${site.name} — ${site.role}`,
      },
      {
        url: `${site.url}/assets/og/og-image.png`,
        secureUrl: `${site.url}/assets/og/og-image.png`,
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: `${site.name} — ${site.role}`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} | ${site.role}`,
    description: site.description,
    images: [`${site.url}/assets/og/og-image.jpg`],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F9C6D3' },
    { media: '(prefers-color-scheme: dark)', color: '#4E3460' },
  ],
};

/**
 * Runs BEFORE React hydrates so the page never flashes the wrong time of day.
 * Always follows the visitor's local clock automatically.
 */
const themeScript = `(function(){try{
var h=new Date().getHours();
var p=h>=5&&h<7?'dawn':h>=7&&h<17?'day':h>=17&&h<19?'dusk':'night';
var t=p==='night'?'night':'day';
var d=document.documentElement;d.dataset.theme=t;d.dataset.phase=p;
if('scrollRestoration' in history){history.scrollRestoration='manual';}
window.scrollTo(0,0);
}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <meta property="og:image" content={`${site.url}/assets/og/og-image.jpg`} />
        <meta property="og:image:secure_url" content={`${site.url}/assets/og/og-image.jpg`} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Gaegu:wght@400;700&display=swap"
        />
      </head>
      <body>
        <TimeProvider>
          <ScrollReset />
          <Ambient />
          <SiteHeader />
          <main className="relative z-10 w-full">{children}</main>
          <SoundToggle />
          <SiteFooter />
        </TimeProvider>
      </body>
    </html>
  );
}
