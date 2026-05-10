'use client';

import { useEffect, useState } from 'react';
import { Snowfall } from 'react-snowfall/lib/Snowfall';

export default function SnowfallBackground() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    setMounted(true);
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  if (!mounted) return null;

  return (
    <Snowfall
      style={{ position: 'fixed', width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}
      snowflakeCount={60}
      color={isDark ? 'rgba(186, 230, 253, 0.35)' : 'rgba(56, 119, 180, 0.20)'}
      radius={[0.5, 2.5]}
      speed={[0.3, 1.2]}
      wind={[-0.3, 0.8]}
    />
  );
}
