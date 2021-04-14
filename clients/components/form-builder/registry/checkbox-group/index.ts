import { Checkbox } from '@formily/antd-components';

import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig } from './convertor';

const CheckboxGroupField: Omit<SourceElement<typeof defaultConfig>, 'displayOrder'> = {
  configSchema,
  toConfig,
  itemName: '复选框',
  icon: 'check_box',
  defaultConfig,
  toSchema,
  component: Checkbox.Group,
  category: 'basic',
  type: 'CheckboxGroup',
};

export default CheckboxGroupField;
