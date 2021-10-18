import { filter } from 'rxjs/operators';
import { FormEffectHooks, createFormActions } from '@formily/react';

import { validateDatasetElement } from '@c/form-builder/utils';

import CheckboxGroup from './checkboxGroup';
import DatasetConfig from '../../form-settings-panel/form-field-config/dataset-config';
import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig } from './convertor';
import Placeholder from './placeholder';

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
    const { setFieldValue, getFieldValue } = createFormActions();
    const { onFieldValueChange$ } = FormEffectHooks;

    onFieldValueChange$('edit').pipe(
      filter(({ value }) => !!value),
    ).subscribe(({ value }) => {
      const availableOptions = getFieldValue('availableOptions');
      setFieldValue('availableOptions', value?.map((op: string, index: number) => {
        if (index >= availableOptions.length) {
          return { label: op, isDefault: false };
        }

        return { label: op, isDefault: availableOptions[index].isDefault };
      }));
    });
  },
};

export default CheckboxGroupField;
