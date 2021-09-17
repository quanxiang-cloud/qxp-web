import { validateDatasetElement } from '@c/form-builder/utils';

import CheckboxGroup from './checkboxGroup';
import DatasetConfig from '../../form-settings-panel/form-field-config/dataset-config';
import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig } from './convertor';

const CheckboxGroupField: Omit<FormBuilder.SourceElement<typeof defaultConfig>, 'displayOrder'> = {
  configSchema,
  toConfig,
  displayName: '复选框',
  icon: 'check_box',
  defaultConfig,
  toSchema,
  component: CheckboxGroup,
  category: 'basic',
  componentName: 'CheckboxGroup',
  compareOperators: ['⊇', '⊋'],
  configDependencies: { DatasetConfig },
  validate: validateDatasetElement,
};

export default CheckboxGroupField;
