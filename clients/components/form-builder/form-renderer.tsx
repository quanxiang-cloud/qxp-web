import React from 'react';
import { SchemaForm, setValidationLanguage, IForm } from '@formily/antd';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

import registry from './registry';
import visibleHiddenLinkageEffect from './linkages/visible-hidden';
import { wrapSchemaByMegaLayout } from './utils';

setValidationLanguage('zh');

type Props = {
  schema: ISchema;
  defaultValue?: any;
  className?: string;
  onSubmit?: (value: any) => void;
  onFormValueChange?: (value: any) => void;
  children?: React.ReactElement | ((form: IForm) => React.ReactElement);
}

function FormRenderer({ schema, defaultValue, className, onSubmit, onFormValueChange, children }: Props) {
  return (
    <ConfigProvider locale={zhCN}>
      <SchemaForm
        className={className}
        onSubmit={onSubmit}
        onChange={onFormValueChange}
        defaultValue={defaultValue}
        components={{ ...registry.components }}
        schema={wrapSchemaByMegaLayout(schema)}
        effects={() => {
          visibleHiddenLinkageEffect(
            // todo refactor formStore any type
            schema['x-internal']?.visibleHiddenLinkages || []
          );
        }}
      >
        {children}
      </SchemaForm>
    </ConfigProvider>
  );
}

export default FormRenderer;
