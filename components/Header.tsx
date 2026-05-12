'use client';

import { faPersonSkiing } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ThemeToggle from '@/components/ThemeToggle';

export default function Header() {
  return (
    <header className="relative flex flex-col items-center pt-10 pb-6 px-4 select-none">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex items-center gap-2 sm:gap-3 mb-2 max-w-[calc(100%-3.5rem)] sm:max-w-none">
        <FontAwesomeIcon
          icon={faPersonSkiing}
          className="text-sky-600 dark:text-sky-300 text-2xl sm:text-3xl w-7 h-7 sm:w-8 sm:h-8"
        />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gradient-snow m-0">
          Powder Tracker
        </h1>
      </div>
      <p className="text-sm text-sky-700 dark:text-sky-300 tracking-widest uppercase font-medium">
        NOAA · Live Conditions
      </p>
    </header>
  );
}
