import type { Repository } from '@one-for-all/artery-renderer';

import versionMap from '@pageDesign/blocks/fountainhead/config/name-version-map';
import SystemTaskList from '@c/task-lists';
import UserMenuAvatar from '@c/user-avatar-menu';
import NavigateMenu from '@c/NavigateMenu';

import FileUpload from './file-upload';
import IFrame from './iframe';
import RichTextEditor from './rich-text-editor';
import GridContainer from './grid-container';
import OptionalTable from './table';
import Tree from './tree';
import a from './a';
import div from './div';
import img from './img';
import span from './span';

const repoSystemComponents: Repository = {
  [`system-components@${versionMap['system-components']}`]: {
    UserMenuAvatar,
    SystemTaskList,
    NavigateMenu,
    FileUpload,
    GridContainer,
    RichTextEditor,
    OptionalTable,
    Tree,
    IFrame,
    a,
    div,
    img,
    span,
  },
};

export default repoSystemComponents;
