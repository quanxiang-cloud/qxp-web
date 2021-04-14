import { Radio } from '@formily/antd-components';

import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig, RadioGroupConfig } from './convertor';

const RadioField: Omit<SourceElement<RadioGroupConfig>, 'displayOrder'> = {
  configSchema,
  toConfig,
  itemName: '单选框',
  icon: 'radio_button_checked',
  defaultConfig: defaultConfig,
  toSchema,
  component: Radio.Group,
  category: 'basic',
  type: 'RadioGroup',
};

export default RadioField;
