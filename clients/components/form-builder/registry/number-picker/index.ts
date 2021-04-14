import { NumberPicker } from '@formily/antd-components';

import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig, NumberPickerConfig } from './convertor';

const NumberPickerField: Omit<FormItem<NumberPickerConfig>, 'displayOrder'> = {
  configSchema,
  toConfig,
  itemName: '数字',
  icon: 'plus_one',
  defaultConfig: defaultConfig,
  toSchema,
  component: NumberPicker,
  category: 'basic',
  type: 'NumberPicker',
};

export default NumberPickerField;
