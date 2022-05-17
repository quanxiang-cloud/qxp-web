import type { APISpecAdapter } from '@one-for-all/api-spec-adapter';
import type { Plugins } from '@one-for-all/artery-renderer';

import componentLoader from '@c/artery-renderer/component-loader';
import repoSystemComponents from '@c/repo-system-components';

const adapter: APISpecAdapter = {
  build: () => {
    return {
      method: 'get',
      url: '/simulator/mock/api/url',
    };
  },
};

const plugins: Plugins = { componentLoader, repository: repoSystemComponents, apiSpecAdapter: adapter };

export default plugins;
