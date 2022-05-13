import { Repository } from '@one-for-all/artery-renderer';

import SimpleViewRenders from '@c/simple-view-render';
import TaskList from '@c/task-lists';
import UserAvatarMenu from '@c/user-avatar-menu';

const systemComponents = {
  SystemTaskList: TaskList,
  UserMenuAvatar: UserAvatarMenu,
};

// todo fix this
const repository: Repository = {
  'SimpleViewRenders@1.0.0': SimpleViewRenders,
  'system-components@1.0.0': systemComponents,
};

export default repository;
