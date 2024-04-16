import { Mountain, States } from '@/config/enums/Mountains';

export const MountainUrls = {
	[States.Washington]: [
		{
			name: Mountain.CrystalMountain,
			url: 'https://api.weather.gov/gridpoints/SEW/145,31/forecast',
			state: States.Washington,
		},
		{
			name: Mountain.SummitAtSnoqualmie,
			url: 'https://api.weather.gov/gridpoints/SEW/152,54/forecast',
			state: States.Washington,
		},
		{
			name: Mountain.MtBaker,
			url: 'https://api.weather.gov/gridpoints/SEW/158,120/forecast',
			state: States.Washington,
		},
		{
			name: Mountain.StevensPass,
			url: 'https://api.weather.gov/gridpoints/OTX/25,115/forecast',
			state: States.Washington,
		},
	],
	[States.Oregon]: [
		{
			name: Mountain.MtHood,
			url: 'https://api.weather.gov/gridpoints/PQR/112,58/forecast',
			state: States.Oregon,
		},
	],
	[States.Idaho]: [
		{
			name: Mountain.SunValley,
			url: 'https://api.weather.gov/gridpoints/PIH/131,174/forecast',
			state: States.Idaho,
		},
	],
	[States.Montana]: [
		{
			name: Mountain.BigSky,
			url: 'https://api.weather.gov/gridpoints/TFX/112,174/forecast',
			state: States.Montana,
		},
	],
	[States.Colorado]: [
		{
			name: Mountain.Vail,
			url: 'https://api.weather.gov/gridpoints/GJT/34,116/forecast',
			state: States.Colorado,
		},
	],
	[States.California]: [
		{
			name: Mountain.MammothMountain,
			url: 'https://api.weather.gov/gridpoints/REV/70,33/forecast',
			state: States.California,
		},
	],
	[States.Utah]: [
		{
			name: Mountain.ParkCity,
			url: 'https://api.weather.gov/gridpoints/SLC/146,220/forecast',
			state: States.Utah,
		},
	],
};
