import type { Repository } from '@one-for-all/artery-renderer';

import SimpleViewRenders from '@c/simple-view-render';
import repoSystemComponents from '@c/repo-system-components';

const repository: Repository = Object.assign({}, SimpleViewRenders, repoSystemComponents);

export default repository;
