import { Select } from '@formily/antd-components';

import configuration from './configuration';
import valueToSchema, { defaultConfig } from './config-to-schema';

const SelectField: Omit<FormItem<typeof defaultConfig>, 'displayOrder'> = {
  configuration,
  itemName: '下拉单选框',
  icon: 'arrow_drop_down_circle',
  defaultConfig: defaultConfig,
  configToSchema: valueToSchema,
  component: Select,
  category: 'basic',
  type: 'Select',
};

export default SelectField;
