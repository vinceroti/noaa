import { ChatGPTAPI } from 'chatgpt';

import { IWeatherData } from '~/interfaces/IWeather';

export async function bestDayToSki(
	weatherData: Array<{ name: string; weatherData: IWeatherData }>,
): Promise<string> {
	const api = new ChatGPTAPI({
		apiKey: process.env.NEXT_PUBLIC_CHAT_GPT || '',
		completionParams: {
			model: 'gpt-3.5-turbo',
			temperature: 0.5,
			top_p: 0.8,
		},
		fetch: fetch.bind(window),
	});

	// compile weather data, get detailed forecast only

	const data = weatherData.map(({ name, weatherData }) => {
		if (!weatherData.properties?.periods) {
			return { name, detailedForecast: 'No weather data available' };
		}
		const periods = weatherData.properties.periods;
		const detailedForecast = periods
			.map((forecast) => forecast.detailedForecast)
			.join(' ');
		return { name, detailedForecast };
	});

	try {
		const res = await api.sendMessage(
			`Using this weather data, determine the best day to ski.
			Send back as html without title. ${JSON.stringify(data)}`,
		);
		const text = res.text;
		// remove ```html and ``` from the response
		const html = text.replace(/```html/g, '').replace(/```/g, '');
		return html;
	} catch (err) {
		console.error(err);
	}

	return '';
}
