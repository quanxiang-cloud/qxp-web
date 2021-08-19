import { Select } from '@formily/antd-components';

import { validateRegistryElement } from '@c/form-builder/utils';

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
  compareOperators: ['⊇', '⊋'],
  validate: validateRegistryElement(configSchema),
};

export default MultipleSelectField;
