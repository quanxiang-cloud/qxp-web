import { NumberPicker } from '@formily/antd-components';

import configSchema from './config-schema';
import toSchema, { defaultConfig } from './convertor';

const NumberPickerField: Omit<FormItem<typeof defaultConfig>, 'displayOrder'> = {
  configSchema,
  itemName: '数字',
  icon: 'plus_one',
  defaultConfig: defaultConfig,
  toSchema,
  component: NumberPicker,
  category: 'basic',
  type: 'NumberPicker',
};

export default NumberPickerField;
