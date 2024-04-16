import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@mui/material/Button';
import { useState } from 'react';

import type { IWeatherData } from '@/interfaces/IWeather';

interface IProps {
	name: string;
	weatherData: IWeatherData;
}

export default function BestDay(props: Array<IProps>) {
	const [summary, setSummary] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleClick = async () => {
		setIsLoading(true);
		try {
			const response = await fetch('/api/chatgpt', {
				method: 'POST',
				body: JSON.stringify(props),
			});

			if (!response.ok) {
				throw response;
			}

			const summaryText = await response.json();
			setSummary(summaryText);
		} catch (err) {
			setSummary('An error occurred, please try again later.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<Button variant="outlined" onClick={handleClick} disabled={isLoading}>
				<FontAwesomeIcon
					icon={isLoading ? ['fas', 'spinner'] : ['fas', 'magic-wand-sparkles']}
					className={`${isLoading ? 'animate-spin' : ''} mr-2`}
				/>
				Calculate The Best Day To Ski
			</Button>

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
