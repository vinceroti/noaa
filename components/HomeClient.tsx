'use client';

import { setCookie } from 'cookies-next';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

import BestDayPanel from '@/components/BestDayPanel';
import RegionSelector from '@/components/RegionSelector';
import ResortCard from '@/components/ResortCard';
import ResortSelector from '@/components/ResortSelector';
import { Mountain, States } from '@/config/enums/Mountains';
import { StorageKeys } from '@/config/enums/storageKeys';
import { MountainUrls } from '@/config/settings';
import type { IWeatherData } from '@/interfaces/IWeather';
import { computeSkiScore } from '@/utils/powderScore';

interface ResortData {
  name: Mountain;
  state: States;
  weatherData: IWeatherData | null;
}

interface Props {
  initialData: ResortData[];
  initialRegion: States;
  initialResorts: Mountain[];
}

async function fetchRegionData(state: States): Promise<ResortData[]> {
  return Promise.all(
    MountainUrls[state].map(async ({ name, url }) => {
      try {
        const res = await fetch(url);
        const weatherData: IWeatherData = await res.json();
        return { name, weatherData, state };
      } catch {
        return { name, weatherData: null, state };
      }
    })
  );
}

export default function HomeClient({ initialData, initialRegion, initialResorts }: Props) {
  const [region, setRegion] = useState<States>(initialRegion);
  const [resorts, setResorts] = useState<Mountain[]>(() => {
    if (initialResorts.length > 0) return initialResorts;
    return MountainUrls[initialRegion].map(({ name }) => name);
  });
  const [data, setData] = useState<ResortData[]>(initialData);
  const [loading, setLoading] = useState(false);

  const filteredData = useMemo(
    () => data.filter((d) => resorts.includes(d.name)),
    [data, resorts]
  );

  const topPickName = useMemo<Mountain | null>(() => {
    let best: { name: Mountain; total: number } | null = null;
    for (const d of filteredData) {
      const period = d.weatherData?.properties?.periods?.[0];
      if (!period) continue;
      const total = computeSkiScore(period).total;
      if (!best || total > best.total) best = { name: d.name, total };
    }
    return best?.name ?? null;
  }, [filteredData]);

  const handleRegionChange = async (newRegion: States) => {
    setRegion(newRegion);
    const allResorts = MountainUrls[newRegion].map(({ name }) => name);
    setResorts(allResorts);
    setCookie(StorageKeys.Region, newRegion);
    setCookie(StorageKeys.Resorts, JSON.stringify(allResorts));
    setLoading(true);
    const newData = await fetchRegionData(newRegion);
    setData(newData);
    setLoading(false);
  };

  const handleResortsChange = (newResorts: Mountain[]) => {
    setResorts(newResorts);
    setCookie(StorageKeys.Resorts, JSON.stringify(newResorts));
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 pb-8 relative z-10">
      {/* Selectors */}
      <div className="flex flex-col gap-3 mb-6">
        <RegionSelector region={region} onRegionChange={handleRegionChange} />
        <ResortSelector region={region} resorts={resorts} onResortsChange={handleResortsChange} />
      </div>

      {/* Loading spinner */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="spinner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center py-16"
          >
            <div className="w-10 h-10 border-2 border-sky-500/20 border-t-sky-500 dark:border-blue-400/20 dark:border-t-blue-400 rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resort cards */}
      <AnimatePresence mode="wait">
        {!loading && (
          <motion.div
            key={region}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="flex flex-col gap-3 mb-6"
          >
            {filteredData.map((resort, i) => (
              <motion.div
                key={resort.name}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: 'easeOut', delay: i * 0.07 }}
              >
                <ResortCard
                  name={resort.name}
                  state={resort.state}
                  weatherData={resort.weatherData}
                  isTopPick={resort.name === topPickName}
                />
              </motion.div>
            ))}

            {filteredData.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-slate-600 dark:text-white/70 py-10 text-sm"
              >
                No resorts selected.
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Best day panel */}
      {!loading && filteredData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <BestDayPanel data={filteredData} />
        </motion.div>
      )}
    </div>
  );
}
