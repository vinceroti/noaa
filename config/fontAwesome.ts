import '@fortawesome/fontawesome-svg-core/styles.css';

import { config, library } from '@fortawesome/fontawesome-svg-core';
import { far, faSnowflake } from '@fortawesome/free-regular-svg-icons';
import {
	faChevronCircleDown,
	faDroplet,
	faMagicWandSparkles,
	fas,
	faSpinner,
	faThermometerHalf,
	faWind,
} from '@fortawesome/free-solid-svg-icons';

config.autoAddCss = false;

library.add(
	faSnowflake,
	far,
	fas,
	faThermometerHalf,
	faDroplet,
	faSpinner,
	faMagicWandSparkles,
	faWind,
	faChevronCircleDown,
);
