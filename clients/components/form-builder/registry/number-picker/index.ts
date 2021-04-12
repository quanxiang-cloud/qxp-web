import { NumberPicker } from '@formily/antd-components';

import configuration from './configuration';
import valueToSchema, { defaultConfig } from './config-to-schema';

const NumberPickerField: Omit<FormItem<typeof defaultConfig>, 'displayOrder'> = {
  configuration,
  itemName: '数字',
  icon: 'plus_one',
  defaultConfig: defaultConfig,
  configToSchema: valueToSchema,
  component: NumberPicker,
  category: 'basic',
  type: 'NumberPicker',
};

export default NumberPickerField;
