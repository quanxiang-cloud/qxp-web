import { DatePicker } from '@formily/antd-components';

import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig, DatePickerConfig } from './convertor';

const DatePickerField: Omit<SourceElement<DatePickerConfig>, 'displayOrder'> = {
  configSchema,
  toConfig,
  toSchema,
  itemName: '时间日期',
  icon: 'date_range',
  defaultConfig: defaultConfig,
  component: DatePicker,
  category: 'basic',
  type: 'DatePicker',
};

export default DatePickerField;
