import { validateDatasetElement } from '@c/form-builder/utils';
import { FormEffectHooks, createFormActions } from '@formily/react';
import DatasetConfig from '@c/form-builder/form-settings-panel/form-field-config/dataset-config';

import RadioGroup from './radioGroup';
import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig, RadioGroupConfig } from './convertor';

const RadioField: Omit<FormBuilder.SourceElement<RadioGroupConfig>, 'displayOrder'> = {
  displayName: '单选框',
  category: 'basic',
  icon: 'radio_button_checked',
  componentName: 'RadioGroup',
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

export default RadioField;
