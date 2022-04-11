import UserAvatarMenu from './user-avatar-menu';
import type { SourceElement } from '../../../types';

import ConfigForm from './config-form';

type Props = {
  placeholder: string,
  rows: number,
  cols: number,
  name: string,
}

const defaultConfig = {};

const elem: SourceElement<Props> = {
  name: 'avatar',
  icon: 'wrap_text',
  label: '头像',
  category: 'form',
  component: UserAvatarMenu,
  configForm: ConfigForm,
  defaultConfig,
  order: 2,
  // acceptChild: true,
  defaultStyle: {
    display: 'inline-block',
  },
  exportActions: ['onChange', 'onKeyDown', 'onBlur', 'onFocus'],
};

export default elem;
