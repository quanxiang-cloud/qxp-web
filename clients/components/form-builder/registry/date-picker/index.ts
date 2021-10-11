import { validateRegistryElement } from '@c/form-builder/utils';

import DatePicker from './date-picker';
import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig, DatePickerConfig } from './convertor';
import Placeholder from './placeholder';

const DatePickerField: Omit<FormBuilder.SourceElement<DatePickerConfig>, 'displayOrder'> = {
  configSchema,
  toConfig,
  toSchema,
  displayName: '时间日期',
  icon: 'date_range',
  defaultConfig: defaultConfig,
  component: DatePicker,
  placeholderComponent: Placeholder,
  category: 'basic',
  componentName: 'DatePicker',
  compareOperators: ['==', '!=', '>', '>=', '<=', '<'],
  validate: validateRegistryElement(configSchema),
};

export default DatePickerField;
