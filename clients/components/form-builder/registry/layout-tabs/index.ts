import LayoutTabs from './layout-tabs';
import LayoutTabsCanvas from './layout-tabs-canvas';

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
  editComponent: LayoutTabsCanvas,
  category: 'layout',
  componentName: 'LayoutTabs',
  isLayoutComponent: true,
};

export default LayoutTabsField;
