export default function Footer() {
  return (
    <footer className="text-center py-8 px-4 text-slate-600 dark:text-white/70 text-xs">
      <p>Weather data from NOAA · {new Date().getFullYear()} Powder Tracker</p>
    </footer>
  );
}
