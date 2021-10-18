import { filter } from 'rxjs/operators';
import { FormEffectHooks, createFormActions } from '@formily/react';

import { validateDatasetElement } from '@c/form-builder/utils';

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
    const { onFieldValueChange$ } = FormEffectHooks;

    onFieldValueChange$('edit').pipe(
      filter(({ value }) => !!value),
    ).subscribe(({ value }) => {
      const availableOptions = getFieldValue('availableOptions');
      setFieldValue('availableOptions', value.map((op: any, index: number) => {
        if (index >= availableOptions.length) {
          return { label: op, isDefault: false };
        }

        return { label: op, isDefault: availableOptions[index].isDefault };
      }));
    });
  },
};

export default SelectField;
