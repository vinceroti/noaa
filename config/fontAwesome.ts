import '@fortawesome/fontawesome-svg-core/styles.css';

import { config,library } from '@fortawesome/fontawesome-svg-core';
import { faComment, far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

config.autoAddCss = false;

library.add(faComment, far, fas);

