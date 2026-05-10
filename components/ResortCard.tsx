'use client';

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
	faBolt,
	faChevronDown,
	faCloud,
	faCloudMeatball,
	faCloudSun,
	faDroplet,
	faSmog,
	faSnowflake,
	faSun,
	faThermometerHalf,
	faWind,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import type { IPeriod, IWeatherData } from '@/interfaces/IWeather';
import type { ScoreLabel, SkiScore } from '@/utils/powderScore';
import { computeSkiScore, extractSnowInches } from '@/utils/powderScore';

interface Props {
	name: string;
	state: string;
	weatherData: IWeatherData | null;
}

const SCORE_CLASS: Record<ScoreLabel, string> = {
	EPIC: 'score-epic',
	GREAT: 'score-great',
	GOOD: 'score-good',
	FAIR: 'score-fair',
	SKIP: 'score-skip',
};

function chooseWeatherIcon(forecast: string): IconDefinition {
	const f = forecast.toLowerCase();
	if (f.includes('thunder')) return faBolt;
	if (f.includes('sleet') || f.includes('wintry mix')) return faCloudMeatball;
	if (f.includes('snow')) return faSnowflake;
	if (f.includes('rain')) return faDroplet;
	if (f.includes('sunny') || f.includes('clear')) return faSun;
	if (f.includes('partly')) return faCloudSun;
	if (f.includes('cloud') || f.includes('overcast')) return faCloud;
	return faSmog;
}

function formatSnow(inches: number): string {
	return inches < 1 ? `${(inches * 12).toFixed(0)}"` : `${inches}"`;
}

function PeriodRow({ period }: { period: IPeriod }) {
	const score = computeSkiScore(period);
	const snow = extractSnowInches(period.detailedForecast);
	const precip = period.probabilityOfPrecipitation?.value ?? 0;

	return (
		<div className="flex items-center gap-3 py-2.5 border-b border-slate-200/60 dark:border-white/10 last:border-0">
			<div className="w-28 shrink-0">
				<span className="text-xs text-slate-700 dark:text-white/95 font-medium">
					{period.name}
				</span>
			</div>
			<FontAwesomeIcon
				icon={chooseWeatherIcon(period.shortForecast)}
				className="w-3.5 h-3.5 text-slate-500 dark:text-white/85 shrink-0"
			/>
			<div className="flex-1 flex items-center gap-3 flex-wrap min-w-0">
				<span className="text-xs text-slate-800 dark:text-white font-semibold">
					{period.temperature}°{period.temperatureUnit}
				</span>
				{snow > 0 && (
					<span className="text-xs text-sky-700 dark:text-sky-300 font-bold">
						+{formatSnow(snow)}
					</span>
				)}
				{precip > 0 && (
					<span className="text-xs text-slate-600 dark:text-white/85">
						{precip}%
					</span>
				)}
			</div>
			<span
				className={`text-xs font-bold px-1.5 py-0.5 rounded border shrink-0 ${SCORE_CLASS[score.label]}`}
			>
				{score.label}
			</span>
		</div>
	);
}

export default function ResortCard({ name, state, weatherData }: Props) {
	const [expanded, setExpanded] = useState(false);

	const periods = weatherData?.properties?.periods ?? [];
	const firstPeriod = periods[0];
	const score: SkiScore | null = firstPeriod
		? computeSkiScore(firstPeriod)
		: null;
	const snow = firstPeriod
		? extractSnowInches(firstPeriod.detailedForecast)
		: 0;
	const precip = firstPeriod?.probabilityOfPrecipitation?.value ?? 0;

	if (!firstPeriod || !score) {
		return (
			<div className="glass rounded-2xl p-5 text-slate-600 dark:text-white/80 text-sm">
				{name} — no data available
			</div>
		);
	}

	return (
		<motion.div
			className="glass glass-hover rounded-2xl overflow-hidden cursor-pointer"
			onClick={() => setExpanded((v) => !v)}
		>
			<div className="p-5">
				{/* Resort name + score badge */}
				<div className="flex items-start justify-between gap-3 mb-4">
					<div>
						<h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
							{name}
						</h3>
						<span className="text-xs text-sky-700 dark:text-sky-300 uppercase tracking-wider font-medium">
							{state}
						</span>
					</div>
					<span
						className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${SCORE_CLASS[score.label]}`}
					>
						{score.label} · {score.total}/100
					</span>
				</div>

				{/* Hero: snow amount or condition */}
				<div className="mb-4">
					{snow > 0 ? (
						<div className="flex items-baseline gap-2">
							<FontAwesomeIcon
								icon={faSnowflake}
								className="w-4 h-4 text-sky-600 dark:text-sky-300 self-center"
							/>
							<span className="text-3xl font-black text-sky-700 dark:text-sky-200 leading-none tabular-nums">
								+{formatSnow(snow)}
							</span>
							<span className="text-sm text-slate-700 dark:text-white/90 font-medium">
								new snow
							</span>
						</div>
					) : (
						<div className="flex items-center gap-2">
							<FontAwesomeIcon
								icon={chooseWeatherIcon(firstPeriod.shortForecast)}
								className="w-4 h-4 text-slate-700 dark:text-white/90"
							/>
							<span className="text-base font-semibold text-slate-900 dark:text-white">
								{firstPeriod.shortForecast}
							</span>
						</div>
					)}
				</div>

				{/* Stats */}
				<div className="flex gap-5 items-center flex-wrap text-sm">
					<div className="flex items-center gap-1.5">
						<FontAwesomeIcon
							icon={faThermometerHalf}
							className="w-3 h-3 text-slate-500 dark:text-white/85"
						/>
						<span className="text-slate-800 dark:text-white font-semibold">
							{firstPeriod.temperature}°{firstPeriod.temperatureUnit}
						</span>
						{firstPeriod.temperatureTrend && (
							<span className="text-slate-600 dark:text-white/85 text-xs">
								({firstPeriod.temperatureTrend})
							</span>
						)}
					</div>
					{precip > 0 && (
						<span className="text-sky-700 dark:text-sky-300">
							{precip}% precip
						</span>
					)}
					<div className="flex items-center gap-1.5">
						<FontAwesomeIcon
							icon={faWind}
							className="w-3 h-3 text-slate-500 dark:text-white/85"
						/>
						<span className="text-slate-700 dark:text-white">
							{firstPeriod.windSpeed} {firstPeriod.windDirection}
						</span>
					</div>
				</div>
			</div>

			{/* Expand toggle */}
			<div className="px-5 pb-3 flex items-center gap-1.5 text-xs text-slate-600 dark:text-white/80 font-medium">
				<FontAwesomeIcon
					icon={faChevronDown}
					className={`w-2.5 h-2.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
				/>
				<span>
					{expanded ? 'Hide' : 'Show'} {periods.length}-period forecast
				</span>
			</div>

			{/* Expanded forecast */}
			<AnimatePresence>
				{expanded && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.25, ease: 'easeInOut' }}
						className="overflow-hidden"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="border-t border-slate-200/60 dark:border-white/10 px-5 py-2">
							{periods.map((period) => (
								<PeriodRow key={period.number} period={period} />
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}
