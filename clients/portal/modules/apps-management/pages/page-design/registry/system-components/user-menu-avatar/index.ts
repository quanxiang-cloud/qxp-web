import UserAvatarMenu from '@c/user-avatar-menu';
import type { SourceElement } from '../../../types';

import ConfigForm, { DEFAULT_CONFIG } from './config-form';

type Props = {
  placeholder: string,
  rows: number,
  cols: number,
  name: string,
}

const elem: SourceElement<Props> = {
  name: 'UserMenuAvatar',
  icon: 'wrap_text',
  label: '头像',
  category: 'inner',
  component: UserAvatarMenu,
  configForm: ConfigForm,
  defaultConfig: DEFAULT_CONFIG,
  order: 2,
  // acceptChild: true,
  defaultStyle: {
    display: 'inline-block',
  },
  exportActions: ['onChange', 'onKeyDown', 'onBlur', 'onFocus'],
};

export default elem;
