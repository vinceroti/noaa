import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export default function Header() {
	const textShadow = '1px 3px 3px rgba(0, 0, 0, 0.5)';

	return (
		<header className="flex items-center justify-center p-5 bg-blue-400 text-white shadow-md">
			<FontAwesomeIcon
				icon={['far', 'snowflake']}
				size="3x"
				className="mr-4 animate-spin-slow"
			/>
			<h1
				className="text-4xl text-center m-0 font-semibold"
				style={{ textShadow }}
			>
				Washington Ski Tracker
			</h1>
		</header>
	);
}
