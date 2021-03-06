import { createFormActions } from '@formily/antd';

import { validateDatasetElement } from '@c/form-builder/utils';

import Placeholder from './placeholder';
import configSchema from './config-schema';
import CheckboxGroup from './checkboxGroup';
import DatasetConfig from '../../form-settings-panel/form-field-config/dataset-config';
import { defaultConfig, toSchema, toConfig } from './convertor';
import {
  updateLabelsOnMultipleEdit,
  initDefaultValueOnOptionsFromDataset,
  updateDefaultValueOnDatasetIdChanged,
} from '../options-effects';

const CheckboxGroupField: Omit<FormBuilder.SourceElement<typeof defaultConfig>, 'displayOrder'> = {
  configSchema,
  toConfig,
  displayName: '复选框',
  icon: 'check_box',
  defaultConfig,
  toSchema,
  component: CheckboxGroup,
  placeholderComponent: Placeholder,
  category: 'basic',
  componentName: 'CheckboxGroup',
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

export default CheckboxGroupField;
