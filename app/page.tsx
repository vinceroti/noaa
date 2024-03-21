import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <header className="flex items-center">
        <FontAwesomeIcon icon={['far', 'snowflake']} size="3x" className="mr-4"/>
        <h1 className="text-4xl text-center m-0">
          Noaa Ski Tracker
        </h1>
      </header>
    </main>
  );
}
