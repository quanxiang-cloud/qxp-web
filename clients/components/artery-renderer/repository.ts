import type { Repository } from '@one-for-all/artery-renderer';

import SimpleViewRenders from '@c/simple-view-render';
import repoSystemComponents from '@c/repo-system-components';

// todo fix this
const repository: Repository = {
  ...SimpleViewRenders,
  ...repoSystemComponents,
};

export default repository;
