import '@/styles/pages/index.scss';

import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useMemo, useState } from 'react';

import BestDay from '~/components/BestDay';
import ListMountains from '~/components/ListMountains';
import Regions from '~/components/Regions';
import { MountainUrls, States } from '~/enums/Mountains';
import type { IWeatherData } from '~/interfaces/IWeather';

export const getServerSideProps: GetServerSideProps = async () => {
	const data = await Promise.all(
		MountainUrls[States.Washington].map(async ({ name, url, state }) => {
			const response = await fetch(url);
			const weatherData: IWeatherData = await response.json();
			return { name, weatherData, state };
		}),
	);

	return { props: { data } };
};

export default function Home({
	data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	// global state store will solve this (but learning the old fansioned way for now)
	const [region, setRegion] = useState<string[]>([]);
	const filteredData = useMemo(() => {
		if (region.length === 0) return null;
		return data.filter(({ state }: { state: string }) =>
			region.includes(state),
		);
	}, [data, region]);

	return (
		<div className="max-w-lg scrim">
			<div className="mt-4 mb-4 block">
				{Regions({ onRegionChange: setRegion })}
			</div>
			<div className="mb-4">{ListMountains(filteredData)}</div>
			<div className="mb-4">{BestDay(filteredData)}</div>
		</div>
	);
}
