import React from 'react';
import Tab2 from '@c/tab2';

import FormFieldConfig from './form-field-config';
import FormConfig from './label-layout';
import { FieldConfigContext, fieldConfigContext } from './form-field-config-context';

function FormSettingPanel() {
  return (
    <Tab2
      strechNavs
      style={{ width: '296px' }}
      items={[
        {
          id: 'fieldAttr',
          name: '字段属性',
          content: (
            <FieldConfigContext.Provider value={fieldConfigContext}>
              <FormFieldConfig />
            </FieldConfigContext.Provider>
          ),
        },
        {
          id: 'formAttr',
          name: '表单配置',
          content: (<FormConfig />),
        }]}
    />
  );
}

export default FormSettingPanel;
