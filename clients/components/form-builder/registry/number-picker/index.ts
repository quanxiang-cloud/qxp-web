import { NumberPicker } from '@formily/antd-components';
import { FormEffectHooks, createFormActions } from '@formily/react';

import { validateRegistryElement } from '@c/form-builder/utils';

import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig, NumberPickerConfig } from './convertor';

const NumberPickerField: Omit<FormBuilder.SourceElement<NumberPickerConfig>, 'displayOrder'> = {
  configSchema,
  toConfig,
  displayName: '数字',
  icon: 'plus_one',
  defaultConfig: defaultConfig,
  toSchema,
  component: NumberPicker,
  category: 'basic',
  componentName: 'NumberPicker',
  compareOperators: ['==', '!=', '>', '>=', '<=', '<'],
  validate: validateRegistryElement(configSchema),
  effects: () => {
    const { onFieldInputChange$, onFieldInit$ } = FormEffectHooks;
    const { setFieldState } = createFormActions();

    onFieldInit$('minSet').subscribe((field) => {
      let visible = false;
      if (field.value !== undefined) {
        visible = field.value.length === 0 ? false : true;
      }
      setFieldState('minimum', (state) => {
        state.visible = visible;
      });
    });

    onFieldInit$('maxSet').subscribe((field) => {
      let visible = false;
      if (field.value !== undefined) {
        visible = field.value.length === 0 ? false : true;
      }
      setFieldState('maximum', (state) => {
        state.visible = visible;
      });
    });

    onFieldInputChange$('minSet').subscribe(({ value }) => {
      setFieldState('minimum', (state) => {
        state.visible = value.length === 0 ? false : true;
      });
    });

    onFieldInputChange$('maxSet').subscribe(({ value }) => {
      setFieldState('maximum', (state) => {
        state.visible = value.length === 0 ? false : true;
      });
    });
  },
};

export default NumberPickerField;
