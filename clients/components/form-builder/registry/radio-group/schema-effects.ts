import { createFormActions, FormEffectHooks } from '@formily/antd';

import { defaultConfig } from './convertor';

const { onFieldInputChange$ } = FormEffectHooks;

export default function schemaEffect(): void {
  const { setFieldState } = createFormActions();

  onFieldInputChange$('defaultValueFrom').subscribe(({ value }) => {
    if (value === 'customized') {
      setFieldState('availableOptions', (state) => {
        state.value = defaultConfig.availableOptions;
      });
    }
  });
}
