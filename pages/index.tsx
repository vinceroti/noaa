import '@/styles/pages/index.scss';

import { getCookie, setCookie } from 'cookies-next';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useMemo, useState } from 'react';

import BestDay from '~/components/BestDay';
import ListMountains from '~/components/ListMountains';
import Regions from '~/components/Regions';
import Resorts from '~/components/Resorts';
import { Mountain, MountainUrls, States } from '~/enums/Mountains';
import { StorageKeys } from '~/enums/storageKeys';
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

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	const savedRegion =
		(getCookie(StorageKeys.Region, { req, res }) as States) || initialState;

	let savedResorts = getCookie(StorageKeys.Resorts, { req, res }) || '[]';
	savedResorts = JSON.parse(savedResorts);

	const ssrData = await getMountainData(savedRegion);
	return { props: { ssrData, savedRegion, savedResorts } };
};

export default function Home({
	savedRegion,
	savedResorts,
	ssrData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	// global state store will solve this (but learning the old fansioned way for now)
	const [region, setRegion] = useState<States>(savedRegion);
	const [resorts, setResorts] = useState<Mountain[]>(savedResorts);
	const [data, setData] = useState(ssrData);
	const filteredData = useMemo(() => {
		if (region.length === 0) return null;
		return data.filter(
			({ state, name }: { state: States; name: Mountain }) =>
				region.includes(state) && resorts.includes(name),
		);
	}, [data, region, resorts]);

	const onRegionChange = (region: States) => {
		const fetchData = async () => {
			const newData = await getMountainData(region);
			setData(newData);
		};
		setRegion(region);
		fetchData();
		onResortsChange(
			Object.values(MountainUrls[region]).map(({ name }) => name),
		);
		setCookie(StorageKeys.Region, region);
	};

	const onResortsChange = (resorts: Mountain[]) => {
		setResorts(resorts);
		setCookie(StorageKeys.Resorts, resorts);
	};

	return (
		<div className="max-w-lg scrim w-full">
			<div className="mt-4 mb-4 flex gap-2">
				{Regions({ onRegionChange, region })}
				{Resorts({ onResortsChange, resorts, region })}
			</div>
			<div className="mb-4">{ListMountains(filteredData)}</div>
			<div className="mb-4">{BestDay(filteredData)}</div>
		</div>
	);
}
