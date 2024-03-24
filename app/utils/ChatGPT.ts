import { ChatGPTAPI } from 'chatgpt';

import { IWeatherData } from '~/interfaces/IWeather';
const api = new ChatGPTAPI({
	apiKey: process.env.SECRET_CHAT_GPT || '',
	completionParams: {
		model: 'gpt-3.5-turbo',
		temperature: 0.5,
		top_p: 0.8,
	},
});

export async function bestDayToSki(weatherData: IWeatherData) {
	try {
		const res = await api.sendMessage(
			`Using this weather data, determine the best day to ski. ${weatherData}`,
		);
		console.log(res.text);
	} catch (err) {
		console.error(err);
	}
}
