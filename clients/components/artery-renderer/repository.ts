import { mergeRight } from 'ramda';
import type { Repository } from '@one-for-all/artery-renderer';

import SimpleViewRenders from '@c/simple-view-render';
import repoSystemComponents from '@c/repo-system-components';

const repository: Repository = mergeRight(SimpleViewRenders, repoSystemComponents);

export default repository;
