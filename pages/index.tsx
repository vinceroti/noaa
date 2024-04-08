import './index.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@mui/material/Button';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useState } from 'react';

import ListMountains from '~/components/ListMountains';
import { MountainUrls } from '~/enums/Mountains';
import type { IWeatherData } from '~/interfaces/IWeather';

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
		const summary = await fetch('/api/chatgpt', {
			method: 'POST',
			body: JSON.stringify(data),
		});
		const summaryText = await summary.json();
		setSummary(summaryText);
		setIsLoading(false);
	};

	return (
		<div className="flex items-center flex-wrap justify-center max-w-lg scrim">
			<div className="mt-4 mb-4">{ListMountains(data)}</div>
			<Button variant="outlined" onClick={handleClick} disabled={isLoading}>
				<FontAwesomeIcon
					icon={isLoading ? ['fas', 'spinner'] : ['fas', 'magic-wand-sparkles']}
					className={`${isLoading ? 'animate-spin' : ''} mr-2`}
				/>
				Calculate The Best Day To Ski
			</Button>

			<div className="mt-4">{ListMountains(data)}</div>

			{isLoading && (
				<FontAwesomeIcon
					icon={isLoading ? ['fas', 'spinner'] : ['fas', 'magic-wand-sparkles']}
					className={`${isLoading ? 'animate-spin w-full' : ''} mt-10`}
					size="3x"
				/>
			)}

			{summary && !isLoading && (
				<div className="mt-4">
					<h4>Best Day Summary</h4>
					<div dangerouslySetInnerHTML={{ __html: summary }} />
				</div>
			)}
		</div>
	);
}
