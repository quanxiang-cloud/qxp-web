import { Checkbox } from '@formily/antd-components';

import configuration from './configuration';
import toSchema, { defaultConfig } from './to-schema';

const CheckboxGroupField: Omit<FormItem<typeof defaultConfig>, 'displayOrder'> = {
  configuration,
  itemName: '复选框',
  icon: 'check_box',
  defaultConfig: defaultConfig,
  toSchema,
  component: Checkbox.Group,
  category: 'basic',
  type: 'CheckboxGroup',
};

export default CheckboxGroupField;
