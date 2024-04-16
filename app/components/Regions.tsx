import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';

import { MountainUrls } from '~/enums/Mountains';

const States = Object.keys(MountainUrls);

interface RegionsProps {
	onRegionChange: (region: string[]) => void;
}

const Regions = ({ onRegionChange }: RegionsProps) => {
	const [region, setRegion] = useState<string[]>([]);

	const handleChange = (event: SelectChangeEvent<typeof region>) => {
		const {
			target: { value },
		} = event;
		const newValue = typeof value === 'string' ? value.split(',') : value;
		setRegion(newValue);
		onRegionChange(newValue);
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
				multiple
				sx={{
					width: '100%',
				}}
			>
				{States.map((state) => (
					<MenuItem key={state} value={state}>
						{state}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

export default Regions;
