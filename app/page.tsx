import { cookies } from 'next/headers';

import HomeClient from '@/components/HomeClient';
import { Mountain, States } from '@/config/enums/Mountains';
import { StorageKeys } from '@/config/enums/storageKeys';
import { MountainUrls } from '@/config/settings';
import type { IWeatherData } from '@/interfaces/IWeather';

async function fetchRegionData(state: States) {
  return Promise.all(
    MountainUrls[state].map(async ({ name, url }) => {
      try {
        const res = await fetch(url, { next: { revalidate: 3600 } });
        const weatherData: IWeatherData = await res.json();
        return { name, state, weatherData };
      } catch {
        return { name, state, weatherData: null };
      }
    })
  );
}

export default async function Home() {
  const cookieStore = cookies();
  const savedRegion = (cookieStore.get(StorageKeys.Region)?.value as States) ?? States.Washington;

  let savedResorts: Mountain[] = [];
  try {
    const raw = cookieStore.get(StorageKeys.Resorts)?.value;
    if (raw) savedResorts = JSON.parse(raw) as Mountain[];
  } catch {}

  const ssrData = await fetchRegionData(savedRegion);

  return (
    <HomeClient
      initialData={ssrData}
      initialRegion={savedRegion}
      initialResorts={savedResorts}
    />
  );
}
