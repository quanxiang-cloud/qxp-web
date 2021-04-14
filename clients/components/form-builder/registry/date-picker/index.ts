import { DatePicker } from '@formily/antd-components';

import configuration from './config-schema';
import toSchema, { defaultConfig } from './to-schema';

const DatePickerField: Omit<FormItem<typeof defaultConfig>, 'displayOrder'> = {
  configuration,
  itemName: '时间日期',
  icon: 'date_range',
  defaultConfig: defaultConfig,
  toSchema,
  component: DatePicker,
  category: 'basic',
  type: 'DatePicker',
};

export default DatePickerField;
