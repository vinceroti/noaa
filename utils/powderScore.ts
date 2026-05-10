import type { IPeriod, IWeatherData } from '@/interfaces/IWeather';

export type ScoreLabel = 'EPIC' | 'GREAT' | 'GOOD' | 'FAIR' | 'SKIP';

export interface SkiScore {
  total: number;
  label: ScoreLabel;
  snowInches: number;
  windMph: number;
}

export interface DayAnalysis {
  dayName: string;
  date: string;
  resortScores: Array<{
    resort: string;
    score: SkiScore;
    period: IPeriod;
  }>;
  avgScore: number;
  topResort: string;
}

export function extractSnowInches(forecast: string): number {
  const text = forecast.toLowerCase();
  const match = text.match(/new snow accumulation of (.+?) possible/);
  if (!match) return 0;

  const snippet = match[1];
  if (snippet.includes('less than half') || snippet.includes('less than an inch')) return 0.25;
  if (snippet.includes('around half') || snippet.includes('half an inch')) return 0.5;
  if (snippet.includes('around one') || snippet.includes('about one')) return 1;
  if (snippet.includes('around two')) return 2;

  const rangeMatch = snippet.match(/(\d+(?:\.\d+)?)\s+to\s+(\d+(?:\.\d+)?)/);
  if (rangeMatch) return (parseFloat(rangeMatch[1]) + parseFloat(rangeMatch[2])) / 2;

  const single = snippet.match(/(\d+(?:\.\d+)?)/);
  return single ? parseFloat(single[1]) : 0;
}

export function extractWindMph(windSpeed: string): number {
  const range = windSpeed.match(/(\d+)\s+to\s+(\d+)/);
  if (range) return (parseInt(range[1]) + parseInt(range[2])) / 2;
  const single = windSpeed.match(/(\d+)/);
  return single ? parseInt(single[1]) : 0;
}

function getScoreLabel(total: number): ScoreLabel {
  if (total >= 70) return 'EPIC';
  if (total >= 50) return 'GREAT';
  if (total >= 30) return 'GOOD';
  if (total >= 15) return 'FAIR';
  return 'SKIP';
}

// Score breakdown: snow (0-50) + precip (0-20) + temp (0-20) + wind (0-10) = max 100
export function computeSkiScore(period: IPeriod): SkiScore {
  const snowInches = extractSnowInches(period.detailedForecast);
  const windMph = extractWindMph(period.windSpeed);
  const precip = period.probabilityOfPrecipitation?.value ?? 0;
  const temp = period.temperatureUnit === 'C' ? period.temperature * 9 / 5 + 32 : period.temperature;

  const snowScore = Math.min(50, Math.round(snowInches * 6));
  const precipScore = Math.round(((precip ?? 0) / 100) * 20);

  let tempScore = 0;
  if (temp >= 20 && temp <= 28) tempScore = 20;
  else if (temp > 28 && temp <= 32) tempScore = 18;
  else if (temp >= 10 && temp < 20) tempScore = 14;
  else if (temp > 32 && temp <= 36) tempScore = 8;
  else if (temp < 10) tempScore = 5;

  let windScore = 10;
  if (windMph > 40) windScore = 0;
  else if (windMph > 30) windScore = 1;
  else if (windMph > 20) windScore = 4;
  else if (windMph > 10) windScore = 8;

  let total = snowScore + precipScore + tempScore + windScore;

  const forecast = period.shortForecast.toLowerCase();
  if (forecast.includes('rain')) total -= 15;
  else if (forecast.includes('sleet') || forecast.includes('freezing rain')) total -= 10;
  else if (forecast.includes('snow')) total += 5;

  total = Math.max(0, Math.min(100, total));

  return { total, label: getScoreLabel(total), snowInches, windMph };
}

export function analyzeBestDays(
  data: Array<{ name: string; weatherData: IWeatherData | null }>
): DayAnalysis[] {
  const dayMap = new Map<string, DayAnalysis>();

  for (const { name, weatherData } of data) {
    const periods = weatherData?.properties?.periods;
    if (!periods) continue;

    for (const period of periods) {
      if (!period.isDaytime) continue;
      const key = period.name;

      if (!dayMap.has(key)) {
        dayMap.set(key, {
          dayName: period.name,
          date: period.startTime.split('T')[0],
          resortScores: [],
          avgScore: 0,
          topResort: name,
        });
      }

      dayMap.get(key)!.resortScores.push({
        resort: name,
        score: computeSkiScore(period),
        period,
      });
    }
  }

  return Array.from(dayMap.values())
    .map((day) => {
      const scores = day.resortScores.map((r) => r.score.total);
      const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const topResort = day.resortScores.reduce((best, r) =>
        r.score.total > best.score.total ? r : best
      ).resort;
      return { ...day, avgScore, topResort };
    })
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 5);
}
