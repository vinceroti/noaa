import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <header className="flex justify-center space">
        <FontAwesomeIcon icon={['far', 'comments']} size="2x" className="mr-5"/>
        <h1 className="text-4xl font-bold text-center">
          Discord Clone
        </h1>
      </header>
      <p className="text-xl text-center">
        This is a starter template for Next.js + Tailwind CSS + TypeScript.
      </p>
    </main>
  );
}
