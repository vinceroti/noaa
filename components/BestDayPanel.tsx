'use client';

import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';

import type { IWeatherData } from '@/interfaces/IWeather';
import { analyzeBestDays, type DayAnalysis, type ScoreLabel } from '@/utils/powderScore';

interface Props {
  data: Array<{ name: string; weatherData: IWeatherData | null }>;
}

const LABEL_STYLE: Record<ScoreLabel, string> = {
  EPIC: 'score-epic',
  GREAT: 'score-great',
  GOOD: 'score-good',
  FAIR: 'score-fair',
  SKIP: 'score-skip',
};

function DayRow({ day, rank }: { day: DayAnalysis; rank: number }) {
  const topScores = day.resortScores
    .sort((a, b) => b.score.total - a.score.total)
    .slice(0, 3);

  const topScore = topScores[0];
  const label = topScore?.score.label ?? 'SKIP';

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.08 }}
      className="flex items-start gap-4 py-3 border-b border-slate-200/60 dark:border-white/10 last:border-0"
    >
      <div className={`text-2xl font-black tabular-nums w-6 shrink-0 ${
        rank === 0 ? 'text-sky-700 dark:text-sky-300' : 'text-slate-500 dark:text-white/80'
      }`}>
        {rank + 1}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-slate-900 dark:text-white text-sm">{day.dayName}</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${LABEL_STYLE[label]}`}>
            {label}
          </span>
          <span className="text-xs text-slate-700 dark:text-white/90 ml-auto tabular-nums">
            {day.avgScore}/100
          </span>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
          {topScores.map(({ resort, score, period }) => (
            <span key={resort} className="text-xs text-slate-600 dark:text-white/85">
              <span className="text-slate-800 dark:text-white font-medium">{resort}</span>
              {score.snowInches > 0 && (
                <span className="text-sky-700 dark:text-sky-300 ml-1 font-semibold">
                  +{score.snowInches < 1 ? `${(score.snowInches * 12).toFixed(0)}"` : `${score.snowInches}"`}
                </span>
              )}
              {' '}·{' '}{period.temperature}°
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function BestDayPanel({ data }: Props) {
  const days = analyzeBestDays(data);

  if (days.length === 0) return null;

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <FontAwesomeIcon icon={faTrophy} className="text-sky-700 dark:text-sky-300 w-4 h-4" />
        <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest">
          Best Days to Ski
        </h2>
      </div>
      <div>
        {days.map((day, i) => (
          <DayRow key={day.dayName} day={day} rank={i} />
        ))}
      </div>
      <p className="text-xs text-slate-600 dark:text-white/75 mt-3 text-center">
        Scored by snow accumulation, temperature, precipitation & wind
      </p>
    </div>
  );
}
