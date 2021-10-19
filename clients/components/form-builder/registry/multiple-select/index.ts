import { createFormActions } from '@formily/antd';

import { validateDatasetElement } from '@c/form-builder/utils';

import Select from './multiple-select';
import Placeholder from './placeholder';
import configSchema from './config-schema';
import DatasetConfig from '../../form-settings-panel/form-field-config/dataset-config';
import { defaultConfig, toSchema, toConfig, MultipleSelectConfig } from './convertor';
import {
  updateLabelsOnMultipleEdit,
  initDefaultValueOnOptionsFromDataset,
  updateDefaultValueOnDatasetIdChanged,
} from '../options-effects';

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
  effects: () => {
    const actions = createFormActions();

    updateLabelsOnMultipleEdit(actions);
    initDefaultValueOnOptionsFromDataset(actions);
    updateDefaultValueOnDatasetIdChanged(actions);
  },
};

export default MultipleSelectField;
