import '@/config/fontAwesome';
import '@/styles/index.scss';
import './layout.scss';

import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

import Footer from '~/components/footer';
import Header from '~/components/header';

import theme from './theme';

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="app">
			<Header />
			<AppRouterCacheProvider>
				<ThemeProvider theme={theme}>
					<main className="flex grow flex-col items-center justify-between p-4">
						{children}
					</main>
				</ThemeProvider>
			</AppRouterCacheProvider>
			<Footer />
		</div>
	);
}
