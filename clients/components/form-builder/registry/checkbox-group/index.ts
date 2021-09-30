import { FormEffectHooks, createFormActions } from '@formily/react';

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
  effects: () => {
    const { setFieldValue, getFieldValue } = createFormActions();
    const { onFieldValueChange$ } = FormEffectHooks;

    onFieldValueChange$('edit').subscribe(({ value }) => {
      const availableOptions = getFieldValue('availableOptions');
      setFieldValue('availableOptions', availableOptions.map((op: any, index: number) => {
        return { label: value[index], isDefault: op.isDefault };
      }));
    });
  },
};

export default CheckboxGroupField;
