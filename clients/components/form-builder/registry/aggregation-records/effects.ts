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
  });

  onFieldValueChange$('aggType').subscribe(({ value }) => {
    setFieldState('decimalPlaces', (state) => {
      if (value === 'count') {
        state.value = 0;
        state.props.readOnly = true;
      } else {
        state.props.readOnly = false;
      }
    });
  });

  onFieldValueChange$('decimalPlaces').subscribe(({ value }) => {
    setFieldState('decimalPlaces', (state) => {
      if (value < 0) {
        state.value = 0;
      } else if (value > 8) {
        state.value = 8;
      }
    });
  });
}
