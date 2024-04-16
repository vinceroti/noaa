enum Mountain {
	CrystalMountain = 'Crystal Mountain',
	SummitAtSnoqualmie = 'Summit at Snoqualmie',
	MtBaker = 'Mt Baker',
	StevensPass = 'Stevens Pass',
}

export enum States {
	Washington = 'Washington',
	Oregon = 'Oregon',
	Idaho = 'Idaho',
	Montana = 'Montana',
	Colorado = 'Colorado',
	California = 'California',
	Utah = 'Utah',
}

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
};
