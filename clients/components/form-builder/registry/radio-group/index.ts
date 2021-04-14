import { Radio } from '@formily/antd-components';

import configSchema from './config-schema';
import toSchema, { defaultConfig } from './to-schema';

const RadioField: Omit<FormItem<typeof defaultConfig>, 'displayOrder'> = {
  configSchema,
  itemName: '单选框',
  icon: 'radio_button_checked',
  defaultConfig: defaultConfig,
  toSchema,
  component: Radio.Group,
  category: 'basic',
  type: 'RadioGroup',
};

export default RadioField;
