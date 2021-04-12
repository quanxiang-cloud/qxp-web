import { Radio } from '@formily/antd-components';

import configuration from './configuration';
import valueToSchema, { defaultConfig } from './config-to-schema';

const RadioField: Omit<FormItem<typeof defaultConfig>, 'displayOrder'> = {
  configuration,
  itemName: '单选框',
  icon: 'radio_button_checked',
  defaultConfig: defaultConfig,
  configToSchema: valueToSchema,
  component: Radio.Group,
  category: 'basic',
  type: 'RadioGroup',
};

export default RadioField;
