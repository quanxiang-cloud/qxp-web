import { Radio } from '@formily/antd-components';

import configuration from './config-schema';
import toSchema, { defaultConfig } from './to-schema';

const RadioField: Omit<FormItem<typeof defaultConfig>, 'displayOrder'> = {
  configuration,
  itemName: '单选框',
  icon: 'radio_button_checked',
  defaultConfig: defaultConfig,
  toSchema,
  component: Radio.Group,
  category: 'basic',
  type: 'RadioGroup',
};

export default RadioField;
