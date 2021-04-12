import { DatePicker } from '@formily/antd-components';

import configuration from './configuration';
import valueToSchema, { defaultConfig } from './config-to-schema';

const DatePickerField: Omit<FormItem<typeof defaultConfig>, 'displayOrder'> = {
  configuration,
  itemName: '时间日期',
  icon: 'date_range',
  defaultConfig: defaultConfig,
  configToSchema: valueToSchema,
  component: DatePicker,
  category: 'basic',
  type: 'DatePicker',
};

export default DatePickerField;
