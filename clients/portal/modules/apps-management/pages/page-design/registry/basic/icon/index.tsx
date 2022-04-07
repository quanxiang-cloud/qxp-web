import Icon from '@c/icon';

import type { SourceElement } from '../../../types';
import ConfigForm, { DEFAULT_CONFIG } from './config-form';
import type { ComponentProps } from './type';

const element: SourceElement<ComponentProps> = {
  name: 'icon',
  icon: 'stars',
  component: Icon,
  configForm: ConfigForm,
  defaultConfig: DEFAULT_CONFIG,
  label: '图标',
  category: 'basic',
  order: 7,
  defaultStyle: {},
  exportActions: ['onClick'],
};

export default element;
