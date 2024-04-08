'use client';
import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
	typography: {
		fontFamily: roboto.style.fontFamily,
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					background: '#FE6B8B',
					border: 'none',
					color: 'white',
					transition: 'background 0.3s ease-in-out',
					'&:hover': {
						background: '#FF8E53',
						border: 'none',
					},
				},
			},
		},
	},
});

export default theme;
