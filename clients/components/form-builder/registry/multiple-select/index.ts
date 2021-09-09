
import { validateDatasetElement } from '@c/form-builder/utils';

import Select from './multiple-select';
import DatasetConfig from '../../form-settings-panel/form-field-config/dataset-config';
import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig, MultipleSelectConfig } from './convertor';
import Placeholder from './placeholder';

const MultipleSelectField: Omit<FormBuilder.SourceElement<MultipleSelectConfig>, 'displayOrder'> = {
  configSchema,
  toConfig,
  displayName: '下拉复选框',
  icon: 'fact_check',
  defaultConfig: defaultConfig,
  toSchema,
  component: Select,
  placeholderComponent: Placeholder,
  category: 'basic',
  componentName: 'MultipleSelect',
  compareOperators: ['⊇', '⊋'],
  configDependencies: { DatasetConfig },
  validate: validateDatasetElement,
};

export default MultipleSelectField;
