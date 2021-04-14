import { Select } from '@formily/antd-components';

import configSchema from './config-schema';
import toSchema, { defaultConfig } from './convertor';

const SelectField: Omit<FormItem<typeof defaultConfig>, 'displayOrder'> = {
  configSchema,
  itemName: '下拉单选框',
  icon: 'arrow_drop_down_circle',
  defaultConfig: defaultConfig,
  toSchema,
  component: Select,
  category: 'basic',
  type: 'Select',
};

export default SelectField;
