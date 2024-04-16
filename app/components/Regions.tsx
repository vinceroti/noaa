import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';

import { MountainUrls, States } from '~/enums/Mountains';

const StateKeys = Object.keys(MountainUrls) as States[];

interface RegionsProps {
	onRegionChange: (region: States) => void;
	initialState: string;
}

const Regions = ({ onRegionChange, initialState }: RegionsProps) => {
	const [region, setRegion] = useState<string>(initialState);

	const handleChange = (event: SelectChangeEvent<typeof region>) => {
		const {
			target: { value },
		} = event;
		setRegion(value);
		onRegionChange(value as States);
	};

	return (
		<FormControl
			sx={{
				m: 1,
				minWidth: 200,
				width: '100%',
				background: '#fff',
				borderRadius: '5px',
				margin: 0,
				marginBottom: '1rem',
			}}
			variant="filled"
			size="small"
		>
			<InputLabel id="demo-select-small-label">Region</InputLabel>
			<Select
				labelId="demo-select-small-label"
				id="demo-select-small"
				value={region}
				label="region"
				onChange={handleChange}
				variant="filled"
				sx={{
					width: '100%',
				}}
			>
				{StateKeys.map((state) => (
					<MenuItem key={state} value={state}>
						{state}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

export default Regions;
