import './globals.css';
import '@/config/fontAwesome';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import SnowfallBackground from '@/components/SnowfallBackground';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Powder Tracker',
  description: 'Real-time ski resort weather & powder day tracking powered by NOAA',
  manifest: '/manifest.webmanifest',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#050d1a',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Powder Tracker',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = cookies().get('theme')?.value;
  const isDark = theme === 'dark';

  return (
    <html lang="en" className={`${inter.variable}${isDark ? ' dark' : ''}`} suppressHydrationWarning>
      <body className="min-h-dvh flex flex-col">
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
