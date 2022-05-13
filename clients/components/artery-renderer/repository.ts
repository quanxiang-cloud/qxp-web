import { Repository } from '@one-for-all/artery-renderer';

import legacyUIComponents from '@lib/legacy/legacy-ui-components';
import SimpleViewRenders from '@c/simple-view-render';

// todo fix this
const repository: Repository = {
  'ofa-ui@latest': legacyUIComponents,
  '@one-for-all/ui@latest': legacyUIComponents,
  'SimpleViewRenders@1.0.0': SimpleViewRenders,
  'system-components@latest': legacyUIComponents,
};

export default repository;
