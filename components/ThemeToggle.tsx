'use client';

import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
  const cookie = document.cookie.match(/(?:^|;\s*)theme=([^;]*)/)?.[1] as Theme | undefined;
  if (cookie) return cookie;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function persistTheme(theme: Theme) {
  document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    persistTheme(theme);
  }, [theme, mounted]);

  if (!mounted) return <div className="w-9 h-9" aria-hidden />;

  const isLight = theme === 'light';
  return (
    <button
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      aria-label={isLight ? 'Switch to storm mode' : 'Switch to daylight mode'}
      className={`
        w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200
        ${isLight
          ? 'border-sky-500/40 bg-white/60 text-sky-700 hover:text-sky-800 hover:border-sky-500/60 hover:bg-white/80'
          : 'border-white/25 bg-white/10 text-white/90 hover:text-white hover:border-white/40 hover:bg-white/15'
        }
      `}
    >
      <FontAwesomeIcon icon={isLight ? faMoon : faSun} className="w-3.5 h-3.5" />
    </button>
  );
}
