import LayoutCard from './layout-card';
import Placeholder from './placeholder';

import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig, LayoutCardConfig } from './convertor';

const LayoutCardField: Omit<FormBuilder.SourceElement<LayoutCardConfig>, 'displayOrder'> = {
  configSchema,
  displayName: '分组',
  icon: 'view_column',
  defaultConfig: defaultConfig,
  toSchema,
  toConfig,
  component: LayoutCard,
  placeholderComponent: Placeholder,
  category: 'layout',
  componentName: 'LayoutCard',
  isLayoutComponent: true,
};

export default LayoutCardField;
