import '@/styles/pages/index.scss';

import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import BestDay from '~/components/BestDay';
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
	return (
		<div className="flex items-center flex-wrap justify-center max-w-lg scrim">
			<div className="mt-4 mb-4">{ListMountains(data)}</div>
			<div className="mb-4">{BestDay(data)}</div>
		</div>
	);
}
