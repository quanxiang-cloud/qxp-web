import type { Repository } from '@one-for-all/artery-renderer';

import TaskList from '@c/task-lists';
import UserAvatarMenu from '@c/user-avatar-menu';

const systemComponents = {
  SystemTaskList: TaskList,
  UserMenuAvatar: UserAvatarMenu,
};

const repoSystemComponents: Repository = {
  'system-components@1.0.0': systemComponents,
};

export default repoSystemComponents;
