import '@fortawesome/fontawesome-svg-core/styles.css';

import { config,library } from '@fortawesome/fontawesome-svg-core';
import { far,faSnowflake } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

config.autoAddCss = false;

library.add(faSnowflake, far, fas);

