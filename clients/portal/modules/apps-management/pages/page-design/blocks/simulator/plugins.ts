import { APISpecAdapter } from '@one-for-all/api-spec-adapter';
import repository from '@c/artery-renderer/repository';
import { Plugins } from '@one-for-all/artery-renderer';

const adapter: APISpecAdapter = {
  build: () => {
    return {
      method: 'get',
      url: '/simulator/mock/api/url',
    };
  },
};

const plugins: Plugins = { repository, apiSpecAdapter: adapter };

export default plugins;
