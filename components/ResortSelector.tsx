'use client';

import { Mountain, States } from '@/config/enums/Mountains';
import { MountainUrls } from '@/config/settings';

interface Props {
  region: States;
  resorts: Mountain[];
  onResortsChange: (r: Mountain[]) => void;
}

export default function ResortSelector({ region, resorts, onResortsChange }: Props) {
  const available = MountainUrls[region].map(({ name }) => name);

  const toggle = (mountain: Mountain) => {
    if (resorts.includes(mountain)) {
      if (resorts.length === 1) return;
      onResortsChange(resorts.filter((r) => r !== mountain));
    } else {
      onResortsChange([...resorts, mountain]);
    }
  };

  const allSelected = available.every((m) => resorts.includes(m));
  const toggleAll = () => {
    onResortsChange(allSelected ? [available[0]] : [...available]);
  };

  return (
    <div className="w-full border border-slate-200/60 dark:border-white/10 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-1.5 p-2 min-w-max">
          <button
            onClick={toggleAll}
            className={`
              px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200
              ${allSelected
                ? 'bg-sky-50 border border-sky-400/60 text-sky-700 dark:bg-white/15 dark:border-white/25 dark:text-white'
                : 'border border-transparent text-slate-700 hover:text-sky-700 hover:bg-sky-50/80 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10'
              }
            `}
          >
            ALL
          </button>
          {available.map((mountain) => {
            const active = resorts.includes(mountain);
            return (
              <button
                key={mountain}
                onClick={() => toggle(mountain)}
                className={`
                  px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 whitespace-nowrap
                  ${active
                    ? 'bg-sky-50 border border-sky-400/60 text-sky-700 dark:bg-sky-400/20 dark:border-sky-400/40 dark:text-sky-100'
                    : 'border border-transparent text-slate-700 hover:text-sky-700 hover:bg-sky-50/80 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10'
                  }
                `}
              >
                {mountain}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
