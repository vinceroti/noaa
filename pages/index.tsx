import { List, ListItem, Typography } from '@mui/material';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import React from 'react';

import type { IPeriod, IWeatherData } from '~/interfaces/IWeather';

export const getServerSideProps = (async () => {
	const response = await fetch(
		'https://api.weather.gov/gridpoints/SEW/145,17/forecast',
	);
	const data: IWeatherData = await response.json();
	return { props: { data } };
}) satisfies GetServerSideProps<{ data?: IWeatherData }>;

export default function Home({
	data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const renderItem = (item: IPeriod) => (
		<div className="bg-purple-200 p-5 my-2 mx-4">
			<Typography variant="h6">{item.name}</Typography>
			<Typography>
				{new Date(item.startTime).toLocaleString()} -{' '}
				{new Date(item.endTime).toLocaleString()}
			</Typography>
			<Image
				className="w-12 h-12"
				src={item.icon}
				alt="weather icon"
				width={100}
				height={100}
			/>
			<Typography>
				End Time: {new Date(item.endTime).toLocaleString()}
			</Typography>
			<Typography>
				Temperature: {item.temperature}
				{item.temperatureUnit}{' '}
				{item.temperatureTrend ? `(${item.temperatureTrend})` : ''}
			</Typography>
			{item.probabilityOfPrecipitation &&
				!item.probabilityOfPrecipitation.value && (
					<Typography>
						Chance of Precipitation: {item.probabilityOfPrecipitation.value}%
					</Typography>
				)}
			<Typography>
				Wind: {item.windSpeed} from the {item.windDirection}
			</Typography>
			<Typography>Forecast: {item.shortForecast}</Typography>
			<Typography>Detailed Forecast: {item.detailedForecast}</Typography>
		</div>
	);

	const mapItems = () => {
		return data?.properties.periods.map((item) => (
			<ListItem key={item.number.toString()}>{renderItem(item)}</ListItem>
		));
	};
	return (
		<div className="flex items-center justify-center bg-gray-200">
			<List>{mapItems()}</List>
		</div>
	);
}
