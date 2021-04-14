import { Select } from '@formily/antd-components';

import configuration from './config-schema';
import toSchema, { defaultConfig } from './to-schema';

const SelectField: Omit<FormItem<typeof defaultConfig>, 'displayOrder'> = {
  configuration,
  itemName: '下拉单选框',
  icon: 'arrow_drop_down_circle',
  defaultConfig: defaultConfig,
  toSchema,
  component: Select,
  category: 'basic',
  type: 'Select',
};

export default SelectField;
