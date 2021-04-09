import { DatePicker } from '@formily/antd-components';

import configSchema from './config-schema';
import valueToSchema, { defaultConfig } from './config-to-schema';

const DatePickerField: Omit<FormItem<typeof defaultConfig>, 'displayOrder'> = {
  configSchema,
  itemName: '时间日期',
  icon: 'date_range',
  defaultConfig: defaultConfig,
  configToSchema: valueToSchema,
  component: DatePicker,
  category: 'basic',
  type: 'DatePicker',
};

export default DatePickerField;
