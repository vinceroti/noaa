'use client';

import { States } from '@/config/enums/Mountains';
import { MountainUrls } from '@/config/settings';

const STATE_ABBR: Record<States, string> = {
	[States.Washington]: 'WA',
	[States.Oregon]: 'OR',
	[States.Idaho]: 'ID',
	[States.Montana]: 'MT',
	[States.Colorado]: 'CO',
	[States.California]: 'CA',
	[States.Utah]: 'UT',
};

interface Props {
	region: States;
	onRegionChange: (r: States) => void;
}

export default function RegionSelector({ region, onRegionChange }: Props) {
	const states = Object.keys(MountainUrls) as States[];

	return (
		<div className="w-full border border-slate-200/60 dark:border-white/10 rounded-2xl overflow-hidden">
			<div className="overflow-x-auto scrollbar-hide">
				<div className="flex gap-1.5 p-2 min-w-max">
					{states.map((state) => {
						const active = state === region;
						return (
							<button
								key={state}
								onClick={() => onRegionChange(state)}
								className={`
                  px-4 py-1.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200
                  ${
										active
											? 'bg-sky-50 border border-sky-400/60 text-sky-700' +
											  ' dark:bg-sky-400/20 dark:border-sky-400/40 dark:text-sky-100'
											: 'border border-transparent text-slate-700' +
											  ' hover:text-sky-700 hover:bg-sky-50/80' +
											  ' dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10'
									}
                `}
							>
								{STATE_ABBR[state]}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
