import type { Config } from 'tailwindcss';

const config: Config = {
	darkMode: 'class',
	future: {
		hoverOnlyWhenSupported: true,
	},
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				alpine: {
					950: '#020b16',
					900: '#050d1a',
					800: '#0a1628',
					700: '#0f1f36',
					600: '#152844',
				},
				powder: {
					50: '#f0f9ff',
					100: '#e0f2fe',
					200: '#bae6fd',
					300: '#7dd3fc',
					400: '#38bdf8',
				},
			},
			animation: {
				'spin-slow': 'spin 5s linear infinite',
				float: 'float 6s ease-in-out infinite',
			},
			keyframes: {
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-8px)' },
				},
			},
			backgroundImage: {
				'alpine-gradient': 'linear-gradient(160deg, #050d1a 0%, #0a1e3d 45%, #0a1628 100%)',
			},
		},
	},
	plugins: [],
};
export default config;
