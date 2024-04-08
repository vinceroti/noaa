import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, ListItem } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Image from 'next/image';

import type { IPeriod, IWeatherData } from '~/interfaces/IWeather';

interface IProps {
	name: string;
	weatherData: IWeatherData;
}

const chooseIcon = (item: IPeriod): [IconPrefix, IconName] => {
	if (item.shortForecast.includes('Rain')) {
		return ['fas', 'droplet'];
	}
	if (item.shortForecast.includes('Snow')) {
		return ['fas', 'snowflake'];
	}
	return ['fas', 'cloud'];
};

const weatherDetails = (item: IPeriod) => (
	<div className="flex flex-wrap mb-1">
		<p className="mr-4">
			<FontAwesomeIcon icon={['fas', 'thermometer-half']} /> {item.temperature}
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
);

const snowDetails = (item: IPeriod) => {
	return (
		<div className="ml-1">
			<span className="mr-2">
				<FontAwesomeIcon icon={['fas', 'thermometer-half']} />{' '}
				{item.temperature}
				{item.temperatureUnit}{' '}
				{item.temperatureTrend ? `(${item.temperatureTrend})` : ''}
			</span>
			{item.probabilityOfPrecipitation &&
				item.probabilityOfPrecipitation.value && (
					<span className="mr-1">
						<FontAwesomeIcon icon={chooseIcon(item)} />
					</span>
				)}
			<span>{item.shortForecast}</span>
		</div>
	);
};

const getFirstDay = (data: IWeatherData) => {
	if (data.properties?.periods) {
		return snowDetails(data.properties.periods[0]);
	}
	return 'No data available';
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
		{weatherDetails(item)}
		<p className="mb-0">{item.detailedForecast}</p>
	</div>
);

const mapItems = (data: IWeatherData) => {
	if (data.properties?.periods) {
		return data.properties.periods.map((item) => (
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

export default function ListMountains(props: Array<IProps>) {
	return props?.map(({ name, weatherData }: IProps) => (
		<Accordion key={name} className="w-full mb-4">
			<AccordionSummary
				expandIcon={<FontAwesomeIcon icon={['fas', 'chevron-down']} />}
				id="panel-header"
				aria-controls="panel-content"
			>
				{name} - {getFirstDay(weatherData)}
			</AccordionSummary>
			<AccordionDetails
				sx={{ borderTop: '1px solid #000', background: '#f8f8f8' }}
			>
				<List>{mapItems(weatherData)}</List>
			</AccordionDetails>
		</Accordion>
	));
}
