import { createFormActions, FormEffectHooks } from '@formily/antd';

export default function effects() {
  const { setFieldState } = createFormActions();
  const { onFieldValueChange$ } = FormEffectHooks;

  onFieldValueChange$('associateObject').subscribe(({ value }) => {
    setFieldState('fieldName', (state) => {
      if (!value?.initial && value?.fields) {
        state.value = ''; // reset value
      }
      state.props.enum = value?.fields || [];
    });

    setFieldState('condition', (state)=> {
      state.props['x-component-props'] = {
        associateObject: value,
      };
    });
  });

  onFieldValueChange$('aggType').subscribe(({ value }) => {
    setFieldState('decimalPlaces', (state) => {
      if (value === 'count') {
        state.value = 0;
        state.props.readOnly = true;
      } else {
        state.value = 2;
        state.props.readOnly = false;
      }
    });
  });
}
