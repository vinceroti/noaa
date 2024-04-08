
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@mui/material/Button';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useState } from 'react';

import ListMountains  from '~/components/ListMountains';
import { MountainUrls } from '~/enums/Mountains';
import { IWeatherData } from '~/interfaces/IWeather';
import { bestDayToSki } from '~/utils/ChatGPT';

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


export default function Home({
	data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [summary, setSummary] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleClick = async () => {
		setIsLoading(true);
		const summary = await bestDayToSki(data);
		setSummary(summary);
		setIsLoading(false);
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

			<div className="mt-4">{ListMountains(data)}</div>

			{summary && (
				<div className="mt-4">
					<h4>Best Day Summary</h4>
					<div dangerouslySetInnerHTML={{ __html: summary }} />
				</div>
			)}
		</div>
	);
}
