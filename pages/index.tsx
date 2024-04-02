import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, ListItem } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import { useState } from 'react';

import { MountainUrls } from '~/enums/Mountains';
import type { IPeriod, IWeatherData } from '~/interfaces/IWeather';

export const getServerSideProps: GetServerSideProps = async () => {
	const data = await Promise.all(
		MountainUrls.map(async ({ name, url }) => {
			const response = await fetch(url);
			const weatherData: IWeatherData = await response.json();
			return { name, weatherData };
		}),
	);

	return { props: { data } };
};

const chooseIcon = (item: IPeriod): [IconPrefix, IconName] => {
	if (item.shortForecast.includes('Rain')) {
		return ['fas', 'droplet'];
	}
	if (item.shortForecast.includes('Snow')) {
		return ['fas', 'snowflake'];
	}
	return ['fas', 'cloud'];
};

export default function Home({
	data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [summary, setSummary] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleClick = async () => {
		setIsLoading(true);
		const summary = await fetch('/api/chatgpt', {
			method: 'POST',
			body: JSON.stringify(data),
		});
		const summaryText = await summary.json();
		setSummary(summaryText);
		setIsLoading(false);
	};

	const renderItem = (item: IPeriod) => (
		<div>
			<div className="flex">
				<Image
					className="w-12 h-12"
					src={item.icon}
					alt="weather icon"
					width={100}
					height={100}
				/>
				<div className="flex flex-col justify-center ml-4">
					<h6>{item.name}</h6>
					<p>
						{new Date(item.startTime).toLocaleTimeString()} -{' '}
						{new Date(item.endTime).toLocaleTimeString()}
					</p>
				</div>
			</div>
			<div className="flex flex-wrap mb-1">
				<p className="mr-4">
					<FontAwesomeIcon icon={['fas', 'thermometer-half']} />{' '}
					{item.temperature}
					{item.temperatureUnit}{' '}
					{item.temperatureTrend ? `(${item.temperatureTrend})` : ''}
				</p>
				{item.probabilityOfPrecipitation &&
					item.probabilityOfPrecipitation.value && (
						<p className="mr-4">
							<FontAwesomeIcon icon={chooseIcon(item)} /> Precipitation:{' '}
							{item.probabilityOfPrecipitation.value}%
						</p>
					)}
				<p>
					<FontAwesomeIcon icon={['fas', 'wind']} className="mr-1" />
					{item.windSpeed} from the {item.windDirection}
				</p>
			</div>
			<p className="mb-0">{item.detailedForecast}</p>
		</div>
	);

	const mapItems = (weatherData: IWeatherData) => {
		if (weatherData.properties?.periods) {
			return weatherData.properties.periods.map((item) => (
				<ListItem
					key={item.number.toString()}
					sx={{
						borderBottom: '1px solid gray',
						padding: '1rem 0.5rem',
						'&:last-child': { borderBottom: 'none' },
					}}
				>
					{renderItem(item)}
				</ListItem>
			));
		}
		return 'No data available';
	};

	const renderMountains = () => {
		return data?.map(
			({ name, weatherData }: { name: string; weatherData: IWeatherData }) => (
				<Accordion key={name} className="w-full mb-4">
					<AccordionSummary
						expandIcon={<FontAwesomeIcon icon={['fas', 'chevron-down']} />}
						id="panel-header"
						aria-controls="panel-content"
						className="p-4"
					>
						{name}
					</AccordionSummary>
					<AccordionDetails
						sx={{ borderTop: '1px solid #000', background: '#f8f8f8' }}
					>
						<List>{mapItems(weatherData)}</List>
					</AccordionDetails>
				</Accordion>
			),
		);
	};

	return (
		<div className="flex items-center flex-wrap justify-center max-w-lg">
			<Button variant="outlined" onClick={handleClick} disabled={isLoading}>
				<FontAwesomeIcon
					icon={isLoading ? ['fas', 'spinner'] : ['fas', 'magic-wand-sparkles']}
					className={`${isLoading ? 'animate-spin' : ''} mr-2`}
				/>
				Calculate The Best Day To Ski
			</Button>

			<div className="mt-4">{renderMountains()}</div>
			{summary && (
				<div className="mt-4">
					<h4>Best Day Summary</h4>
					<div dangerouslySetInnerHTML={{ __html: summary }} />
				</div>
			)}
		</div>
	);
}
