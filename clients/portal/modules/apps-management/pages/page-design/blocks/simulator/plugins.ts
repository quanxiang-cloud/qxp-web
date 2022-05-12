import type { APISpecAdapter } from '@one-for-all/api-spec-adapter';
import type { Repository } from '@one-for-all/artery-renderer';

import legacyUIComponents from '@lib/legacy/legacy-ui-components';
import TaskList from '@c/task-lists';
import UserAvatarMenu from '@c/user-avatar-menu';

const systemComponents = {
  SystemTaskList: TaskList,
  UserMenuAvatar: UserAvatarMenu,
};

// todo fix this
const repository: Repository = {
  'ofa-ui@latest': legacyUIComponents,
  'system-components@1.0.0': systemComponents,
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
