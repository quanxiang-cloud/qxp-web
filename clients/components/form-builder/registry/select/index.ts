import { createFormActions } from '@formily/antd';

import { validateDatasetElement } from '@c/form-builder/utils';

import Placeholder from './placeholder';
import configSchema from './config-schema';
import CustomSelect from './custom-select';
import DatasetConfig from '../../form-settings-panel/form-field-config/dataset-config';
import { defaultConfig, toSchema, toConfig, SelectConfig } from './convertor';
import {
  updateLabelsOnSimpleEdit,
  initDefaultValueOnOptionsFromDataset,
  updateDefaultValueOnDatasetIdChanged,
} from '../options-effects';

const SelectField: Omit<FormBuilder.SourceElement<SelectConfig>, 'displayOrder'> = {
  configSchema,
  toConfig,
  displayName: '下拉单选框',
  icon: 'arrow_drop_down_circle',
  defaultConfig: defaultConfig,
  toSchema,
  component: CustomSelect,
  placeholderComponent: Placeholder,
  category: 'basic',
  componentName: 'Select',
  compareOperators: ['==', '!=', '∈', '∉'],
  configDependencies: { DatasetConfig },
  validate: validateDatasetElement,
  effects: () => {
    const actions = createFormActions();

    updateLabelsOnSimpleEdit(actions);
    initDefaultValueOnOptionsFromDataset(actions);
    updateDefaultValueOnDatasetIdChanged(actions);
  },
};

export default SelectField;
