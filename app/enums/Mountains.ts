enum Mountain {
	CrystalMountain = 'Crystal Mountain',
	SummitAtSnoqualmie = 'Summit at Snoqualmie',
	MtBaker = 'Mt Baker',
	StevensPass = 'Stevens Pass',
}

export const MountainUrls = [
	{
		name: Mountain.CrystalMountain,
		url: 'https://api.weather.gov/gridpoints/SEW/145,17/forecast',
	},
	{
		name: Mountain.SummitAtSnoqualmie,
		url: 'https://api.weather.gov/gridpoints/SEW/124,57/forecast',
	},
	{
		name: Mountain.MtBaker,
		url: 'https://api.weather.gov/gridpoints/SEW/69,13/forecast',
	},
	{
		name: Mountain.StevensPass,
		url: 'https://api.weather.gov/gridpoints/SEW/105,35/forecast',
	},
];
