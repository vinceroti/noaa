import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Powder Tracker',
    short_name: 'Powder',
    description: 'Real-time ski resort weather & powder day tracking powered by NOAA',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#050d1a',
    theme_color: '#050d1a',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '32x32',
        type: 'image/x-icon',
      },
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
