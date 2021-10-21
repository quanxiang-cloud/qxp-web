import { FormEffectHooks, createFormActions } from '@formily/react';

import { validateRegistryElement } from '@c/form-builder/utils';

import NumberPicker from './number-picker';
import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig, NumberPickerConfig } from './convertor';
import Placeholder from './placeholder';

const NumberPickerField: Omit<FormBuilder.SourceElement<NumberPickerConfig>, 'displayOrder'> = {
  configSchema,
  toConfig,
  displayName: '数字',
  icon: 'plus_one',
  defaultConfig: defaultConfig,
  toSchema,
  component: NumberPicker,
  placeholderComponent: Placeholder,
  category: 'basic',
  componentName: 'NumberPicker',
  compareOperators: ['==', '!=', '>', '>=', '<=', '<'],
  validate: validateRegistryElement(configSchema),
  effects: () => {
    const { onFieldInputChange$, onFieldInit$ } = FormEffectHooks;
    const { setFieldState } = createFormActions();

    onFieldInit$('minimum').subscribe((field) => {
      if (!field.initialValue) {
        setFieldState('minimum', (state) => {
          state.visible = false;
        });
        setFieldState('minSet', (state) => {
          state.initialValue = [false];
        });
        return;
      }
      setFieldState('minSet', (state) => {
        state.value = [true];
      });
      setFieldState('minimum', (state) => {
        state.visible = true;
      });
    });

    onFieldInit$('maximum').subscribe((field) => {
      if (!field.initialValue) {
        setFieldState('maxSet', (state) => {
          state.initialValue = [false];
        });
        setFieldState('maximum', (state) => {
          state.visible = false;
        });
        return;
      }
      setFieldState('maxSet', (state) => {
        state.value = [true];
      });
      setFieldState('maximum', (state) => {
        state.visible = true;
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

    onFieldInputChange$('precision').subscribe(({ value }) => {
      setFieldState('precision', (state) => {
        if (value < 0) {
          state.value = 0;
        } else if (value > 4) {
          state.value = 4;
        }
      });
    });
  },
};

export default NumberPickerField;
