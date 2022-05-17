import type { APISpecAdapter } from '@one-for-all/api-spec-adapter';
import type { Plugins } from '@one-for-all/artery-renderer';

import componentLoader from '@c/artery-renderer/component-loader';

const adapter: APISpecAdapter = {
  build: () => {
    return {
      method: 'get',
      url: '/simulator/mock/api/url',
    };
  },
};

const plugins: Plugins = { componentLoader, apiSpecAdapter: adapter };

export default plugins;
