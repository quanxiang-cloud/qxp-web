import type { APISpecAdapter } from '@one-for-all/api-spec-adapter';
import type { Repository } from '@one-for-all/artery-renderer';

import repoSystemComponents from '@c/repo-system-components';

// todo fix this
const repository: Repository = {
  ...repoSystemComponents,
};

const adapter: APISpecAdapter = {
  build: () => {
    return {
      method: 'get',
      url: '/simulator/mock/api/url',
    };
  },
};

const plugins = { repository, apiSpecAdapter: adapter };

export default plugins;
