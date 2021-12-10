import React from 'react';

import FormFieldConfig from './field-config';
import { FieldConfigContext, fieldConfigContext } from './context';

export default function(): JSX.Element {
  return (
    <FieldConfigContext.Provider value={fieldConfigContext}>
      <div className="px-20">
        <FormFieldConfig />
      </div>
    </FieldConfigContext.Provider>
  );
}
