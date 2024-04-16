import '@/styles/pages/index.scss';

import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useEffect, useMemo, useState } from 'react';

import BestDay from '~/components/BestDay';
import ListMountains from '~/components/ListMountains';
import Regions from '~/components/Regions';
import { MountainUrls, States } from '~/enums/Mountains';
import type { IWeatherData } from '~/interfaces/IWeather';

const initialState = States.Washington;

const getMountainData = (state: States) => {
	return Promise.all(
		MountainUrls[state].map(async ({ name, url }) => {
			const response = await fetch(url);
			const weatherData: IWeatherData = await response.json();
			return { name, weatherData, state };
		}),
	);
};

export const getServerSideProps: GetServerSideProps = async () => {
	const data = await getMountainData(initialState);
	return { props: { data } };
};

export default function Home(
	props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
	// global state store will solve this (but learning the old fansioned way for now)
	const [region, setRegion] = useState<States>(initialState);
	const [data, setData] = useState(props.data);
	const filteredData = useMemo(() => {
		if (region.length === 0) return null;
		return data.filter(({ state }: { state: string }) =>
			region.includes(state),
		);
	}, [data, region]);

	useEffect(() => {
		// this is firing twice on startup
		const fetchData = async () => {
			const newData = await getMountainData(region);
			setData(newData);
		};

		fetchData();
	}, [region]);

	return (
		<div className="max-w-lg scrim">
			<div className="mt-4 mb-4 block">
				{Regions({ onRegionChange: setRegion, initialState })}
			</div>
			<div className="mb-4">{ListMountains(filteredData)}</div>
			<div className="mb-4">{BestDay(filteredData)}</div>
		</div>
	);
}
