import { Checkbox } from '@formily/antd-components';

import configSchema from './config-schema';
import toSchema, { defaultConfig } from './to-schema';

const CheckboxGroupField: Omit<FormItem<typeof defaultConfig>, 'displayOrder'> = {
  configSchema,
  itemName: '复选框',
  icon: 'check_box',
  defaultConfig,
  toSchema,
  component: Checkbox.Group,
  category: 'basic',
  type: 'CheckboxGroup',
};

export default CheckboxGroupField;
