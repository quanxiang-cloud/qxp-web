import type { SourceElement } from '../../../types';
import ConfigForm, { DEFAULT_CONFIG } from './config-form';
import type { ComponentProps } from './type';
import Component from './component';

const element: SourceElement<ComponentProps> = {
  name: 'icon',
  icon: 'stars',
  component: Component,
  configForm: ConfigForm,
  defaultConfig: DEFAULT_CONFIG,
  label: '图标',
  category: 'basic',
  order: 7,
  defaultStyle: {},
  exportActions: ['onClick'],
};

export default element;
