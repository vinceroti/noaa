import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Header() {
	return (
		<header className="flex items-center justify-center p-5">
			<FontAwesomeIcon icon={['far', 'snowflake']} size="3x" className="mr-4" />
			<h1 className="text-4xl text-center m-0">Noaa Ski Tracker</h1>
		</header>
	);
}
