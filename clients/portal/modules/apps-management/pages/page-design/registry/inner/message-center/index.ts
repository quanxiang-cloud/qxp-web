import MessageCenter from '@portal/modules/msg-center/nav-msg-bar';

import ConfigForm from './config-form';
import type { SourceElement } from '../../../types';

type Props = {
  placeholder: string,
  rows: number,
  cols: number,
  name: string,
}

const defaultConfig = {};

const elem: SourceElement<Props> = {
  name: 'message',
  icon: 'wrap_text',
  label: '消息中心',
  category: 'inner',
  component: MessageCenter,
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
