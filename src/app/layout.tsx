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
    icon: '/favicon.svg',
  },
  openGraph: {
    title: `${site.name} | ${site.role}`,
    description: site.description,
    images: ['/assets/og/og-image.png'],
    type: 'website',
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
 * Uses the visitor's local clock. KEEP IN SYNC with src/lib/time.ts.
 */
const themeScript = `(function(){try{
var m=localStorage.getItem('cozy-mode')||'auto';
var h=new Date().getHours();
var p=h>=5&&h<7?'dawn':h>=7&&h<17?'day':h>=17&&h<19?'dusk':'night';
var t=p==='night'?'night':'day';
if(m==='day'){p='day';t='day';}else if(m==='night'){p='night';t='night';}
var d=document.documentElement;d.dataset.theme=t;d.dataset.phase=p;
if('scrollRestoration' in history){history.scrollRestoration='manual';}
window.scrollTo(0,0);
}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
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
