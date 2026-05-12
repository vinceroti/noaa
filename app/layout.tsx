import './globals.css';
import '@/config/fontAwesome';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import SnowfallBackground from '@/components/SnowfallBackground';
import { StorageKeys } from '@/config/enums/storageKeys';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Powder Tracker',
  description: 'Real-time ski resort weather & powder day tracking powered by NOAA',
  manifest: '/manifest.webmanifest',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
  themeColor: '#050d1a',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Powder Tracker',
  },
};

// Runs synchronously before paint to apply the dark class for users without a
// theme cookie. With a cookie, the server already set the class on <html>.
const themeBootstrap =
  '(function(){try{' +
  "var c=document.cookie.match(/(?:^|;\\s*)theme=([^;]*)/);" +
  "var t=c?c[1]:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');" +
  "if(t==='dark')document.documentElement.classList.add('dark');" +
  '}catch(e){}})();';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isDark = cookies().get(StorageKeys.Theme)?.value === 'dark';

  return (
    <html lang="en" className={`${inter.variable}${isDark ? ' dark' : ''}`} suppressHydrationWarning>
      <body className="min-h-dvh flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <SnowfallBackground />
        <ServiceWorkerRegistration />
        <div className="relative z-10 flex flex-col min-h-dvh">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
