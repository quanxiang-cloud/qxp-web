import LayoutGrid from './layout-grid';
import LayoutGridCanvas from './layout-grid-canvas';

import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig, LayoutGridConfig } from './convertor';

const LayoutGridField: Omit<FormBuilder.SourceElement<LayoutGridConfig>, 'displayOrder'> = {
  configSchema,
  displayName: '栅格',
  icon: 'view_column',
  defaultConfig: defaultConfig,
  toSchema,
  toConfig,
  component: LayoutGrid,
  editComponent: LayoutGridCanvas,
  category: 'layout',
  componentName: 'LayoutGrid',
  isLayoutComponent: true,
};

export default LayoutGridField;
