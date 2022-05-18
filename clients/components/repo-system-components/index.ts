import type { Repository } from '@one-for-all/artery-renderer';

import versionMap from '@pageDesign/blocks/fountainhead/config/name-version-map';
import SystemTaskList from '@c/task-lists';
import UserMenuAvatar from '@c/user-avatar-menu';

import GridContainer from './grid-container';
import a from './a';
import div from './div';
import img from './img';
import span from './span';

const repoSystemComponents: Repository = {
  [`system-components@${versionMap['system-components']}`]: {
    UserMenuAvatar,
    SystemTaskList,
    GridContainer,
    a,
    div,
    img,
    span,
  },
};

export default repoSystemComponents;
