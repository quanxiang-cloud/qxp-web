import LayoutTabs from './layout-tabs';
import Placeholder from './placeholder';

import configForm from './config-form';
import { defaultConfig, toSchema, toConfig, LayoutTabsConfig } from './convertor';

const LayoutTabsField: Omit<FormBuilder.SourceElement<LayoutTabsConfig>, 'displayOrder'> = {
  configForm,
  displayName: '选项卡',
  icon: 'vertical_split',
  defaultConfig: defaultConfig,
  toSchema,
  toConfig,
  component: LayoutTabs,
  placeholderComponent: Placeholder,
  category: 'layout',
  componentName: 'LayoutTabs',
  isLayoutComponent: true,
};

export default LayoutTabsField;
