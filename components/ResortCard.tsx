'use client';

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
	faBolt,
	faChevronDown,
	faCloud,
	faCloudMeatball,
	faCloudSun,
	faDroplet,
	faLocationArrow,
	faSmog,
	faSnowflake,
	faSun,
	faThermometerHalf,
	faTrophy,
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
	isTopPick?: boolean;
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

// NOAA wind direction is the compass direction the wind is blowing FROM.
// FontAwesome's location-arrow points upper-right (45°) at rotate(0).
// Add 180° to flip "from"→"to" and subtract 45° so north sits at rotate(0).
const WIND_DIRECTIONS: Record<string, number> = {
	N: 0, NNE: 22.5, NE: 45, ENE: 67.5,
	E: 90, ESE: 112.5, SE: 135, SSE: 157.5,
	S: 180, SSW: 202.5, SW: 225, WSW: 247.5,
	W: 270, WNW: 292.5, NW: 315, NNW: 337.5,
};

function windRotation(direction: string): number | null {
	const heading = WIND_DIRECTIONS[direction.toUpperCase()];
	if (heading === undefined) return null;
	return heading + 180 - 45;
}

interface SparkPoint {
	score: number;
	label: string;
}

function buildSparkline(periods: IPeriod[]): SparkPoint[] {
	return periods
		.filter((p) => p.isDaytime)
		.slice(0, 5)
		.map((p) => ({ score: computeSkiScore(p).total, label: p.name }));
}

function Sparkline({ points }: { points: SparkPoint[] }) {
	if (points.length < 2) return null;
	const max = 100;
	const w = 64;
	const h = 16;
	const step = w / (points.length - 1);
	const d = points
		.map((p, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)} ${(h - (p.score / max) * h).toFixed(1)}`)
		.join(' ');
	return (
		<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible" aria-hidden>
			<path
				d={d}
				fill="none"
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeLinejoin="round"
				className="stroke-sky-500 dark:stroke-sky-300"
			/>
			{points.map((p, i) => (
				<circle
					key={i}
					cx={(i * step).toFixed(1)}
					cy={(h - (p.score / max) * h).toFixed(1)}
					r={1.5}
					className="fill-sky-600 dark:fill-sky-200"
				/>
			))}
		</svg>
	);
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

export default function ResortCard({ name, state, weatherData, isTopPick }: Props) {
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
	const windRot = firstPeriod ? windRotation(firstPeriod.windDirection) : null;
	const spark = buildSparkline(periods);
	const isEpic = score?.label === 'EPIC';

	if (!firstPeriod || !score) {
		return (
			<div className="glass rounded-2xl p-5 text-slate-600 dark:text-white/80 text-sm">
				{name} — no data available
			</div>
		);
	}

	return (
		<motion.div
			className={`relative glass glass-hover rounded-2xl overflow-hidden cursor-pointer ${
				isEpic ? 'epic-card' : ''
			}`}
			onClick={() => setExpanded((v) => !v)}
		>
			<div className="p-5">
				{/* Resort name + score badge */}
				<div className="flex items-start justify-between gap-3 mb-4">
					<div className="min-w-0">
						<div className="flex items-center gap-2 mb-0.5">
							<h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
								{name}
							</h3>
							{isTopPick && (
								<span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 text-amber-900 text-[9px] font-black tracking-wider uppercase shadow-sm ring-1 ring-amber-500/30 shrink-0">
									<FontAwesomeIcon icon={faTrophy} className="w-2 h-2" />
									Top
								</span>
							)}
						</div>
						<span className="text-xs text-sky-700 dark:text-sky-300 uppercase tracking-wider font-medium">
							{state}
						</span>
					</div>
					<span
						className={
							'text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ' +
							SCORE_CLASS[score.label]
						}
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
								className="w-4 h-4 text-sky-600 dark:text-sky-300 self-center animate-spin-slow"
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
						{windRot !== null ? (
							<FontAwesomeIcon
								icon={faLocationArrow}
								className="w-3 h-3 text-slate-500 dark:text-white/85"
								style={{ transform: `rotate(${windRot}deg)` }}
								aria-label={`Wind from ${firstPeriod.windDirection}`}
							/>
						) : (
							<FontAwesomeIcon
								icon={faWind}
								className="w-3 h-3 text-slate-500 dark:text-white/85"
							/>
						)}
						<span className="text-slate-700 dark:text-white">
							{firstPeriod.windSpeed} {firstPeriod.windDirection}
						</span>
					</div>
				</div>
			</div>

			{/* Expand toggle + sparkline */}
			<div className="px-5 pb-4 flex items-center gap-2 text-xs text-slate-600 dark:text-white/80 font-medium">
				<FontAwesomeIcon
					icon={faChevronDown}
					className={`w-2.5 h-2.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
				/>
				<span>
					{expanded ? 'Hide' : 'Show'} {periods.length}-period forecast
				</span>
				{spark.length >= 2 && (
					<div className="ml-auto flex items-center gap-1.5" aria-label="5-day score trend">
						<span className="text-[10px] text-slate-500 dark:text-white/60 uppercase tracking-wide">
							5d
						</span>
						<Sparkline points={spark} />
					</div>
				)}
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
