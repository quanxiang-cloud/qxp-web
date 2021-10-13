import { validateDatasetElement } from '@c/form-builder/utils';
import { FormEffectHooks, createFormActions } from '@formily/react';

import CustomSelect from './custom-select';
import DatasetConfig from '../../form-settings-panel/form-field-config/dataset-config';
import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig, SelectConfig } from './convertor';
import Placeholder from './placeholder';

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
    const { setFieldValue, getFieldValue } = createFormActions();
    const { onFieldInputChange$, onFieldValueChange$ } = FormEffectHooks;

    onFieldInputChange$('availableOptions.*.isDefault').subscribe(({ name, value }) => {
      const currentAvailableOptions = getFieldValue('availableOptions');
      const currentIndex = Number(name.split('.')[1]);
      setFieldValue('availableOptions', currentAvailableOptions.map((op: any, index: number) => {
        if (index === currentIndex) {
          return { label: op.label, isDefault: value };
        }

        return { label: op.label, isDefault: false };
      }));
    });

    onFieldValueChange$('edit').subscribe(({ value }) => {
      const availableOptions = getFieldValue('availableOptions');
      setFieldValue('availableOptions', availableOptions.map((op: any, index: number) => {
        return { label: value[index], isDefault: op.isDefault };
      }));
    });
  },
};

export default SelectField;
