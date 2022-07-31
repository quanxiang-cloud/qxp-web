import type { SourceElement } from '@pageDesign/types';

import Dialog from './dialog';
import ConfigForm, { defaultConfig, Props } from './config-form';

const elem: SourceElement<Props> = {
  name: 'modal',
  icon: 'pages',
  label: '模态框',
  category: 'basic',
  component: Dialog,
  configForm: ConfigForm,
  defaultConfig,
  order: 9,
  acceptChild: true,
  exportActions: ['onClose', 'onCancel', 'onConfirm'],
  defaultStyle: {},
};

export default elem;
