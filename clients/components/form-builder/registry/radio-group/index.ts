import { filter } from 'rxjs/operators';
import { FormEffectHooks, createFormActions } from '@formily/react';

import { validateDatasetElement } from '@c/form-builder/utils';
import DatasetConfig from '@c/form-builder/form-settings-panel/form-field-config/dataset-config';

import Placeholder from './placeholder';
import RadioGroup from './radioGroup';
import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig, RadioGroupConfig } from './convertor';

const RadioField: Omit<FormBuilder.SourceElement<RadioGroupConfig>, 'displayOrder'> = {
  displayName: '单选框',
  category: 'basic',
  icon: 'radio_button_checked',
  componentName: 'RadioGroup',
  placeholderComponent: Placeholder,
  component: RadioGroup,
  configSchema,
  defaultConfig: defaultConfig,
  toConfig,
  toSchema,
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

export default RadioField;
