import { Select } from '@formily/antd-components';

import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig, MultipleSelectConfig } from './convertor';

const MultipleSelectField: Omit<FormBuilder.SourceElement<MultipleSelectConfig>, 'displayOrder'> = {
  configSchema,
  toConfig,
  displayName: '下拉复选框',
  icon: 'fact_check',
  defaultConfig: defaultConfig,
  toSchema,
  component: Select,
  category: 'basic',
  componentName: 'MultipleSelect',
};

export default MultipleSelectField;
