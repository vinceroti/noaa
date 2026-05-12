'use client';

import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { StorageKeys } from '@/config/enums/storageKeys';

function persistTheme(theme: 'light' | 'dark') {
  document.cookie = `${StorageKeys.Theme}=${theme}; path=/; max-age=31536000; SameSite=Lax`;
}

export default function ThemeToggle() {
  const toggle = () => {
    const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    persistTheme(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="
        w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200
        border-sky-500/40 bg-white/60 text-sky-700
        hover:text-sky-800 hover:border-sky-500/60 hover:bg-white/80
        dark:border-white/25 dark:bg-white/10 dark:text-white/90
        dark:hover:text-white dark:hover:border-white/40 dark:hover:bg-white/15
      "
    >
      <span className="flex dark:hidden">
        <FontAwesomeIcon icon={faMoon} className="w-3.5 h-3.5" />
      </span>
      <span className="hidden dark:flex">
        <FontAwesomeIcon icon={faSun} className="w-3.5 h-3.5" />
      </span>
    </button>
  );
}
