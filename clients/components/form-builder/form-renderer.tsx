import React, { useState } from 'react';
import { SchemaForm, setValidationLanguage, IForm, createFormActions } from '@formily/antd';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { parse, resolve, findVariables } from 'qxp-formula';

import logger from '@lib/logger';
import { schemaToMap } from '@lib/schema-convert';
import { schemaPermissionTransformer } from './utils';

import registry from './registry';
import visibleHiddenLinkageEffect from './linkages/visible-hidden';
import defaultValueLinkageEffect from './linkages/default-value';
import formValueToFilter from './linkages/form-value-to-filter';
import calculationFormulaEffect from './linkages/calculation-formula';
import { wrapSchemaByMegaLayout } from './utils';

setValidationLanguage('zh');

type Props = {
  schema: ISchema;
  defaultValue?: any;
  className?: string;
  onSubmit?: (value: any) => void;
  onFormValueChange?: (value: any) => void;
  children?: React.ReactElement | ((form: IForm) => React.ReactElement);
  additionalComponents?: Record<string, React.JSXElementConstructor<any>>;
  usePermission?: boolean;
  hiddenInReadOnly?: boolean;
}

function FormRenderer({
  schema: inputSchema,
  defaultValue,
  className,
  onSubmit,
  onFormValueChange,
  children,
  additionalComponents = {},
  usePermission,
  hiddenInReadOnly,
}: Props): JSX.Element {
  const [errorMessage, setErrorMessage] = useState('');
  const actions = createFormActions();
  const schema = usePermission ? schemaPermissionTransformer(inputSchema, hiddenInReadOnly) : inputSchema;

  function handleSubmit(values: any): void {
    const validations = schema['x-internal']?.validations || [];
    const valid = validations.every(({ formula, message }) => {
      try {
        const ast = parse(formula);
        const dependentFields = [...findVariables(ast)];
        const missingValueField = dependentFields.find((fieldName) => {
          return values[fieldName] === undefined;
        });

        if (missingValueField) {
          actions.getFieldState(missingValueField, (state) => {
            setErrorMessage(`字段 ${state.props.title} 必填。`);
          });
          return false;
        }

        const isValid = resolve(ast, values);
        if (!isValid) {
          setErrorMessage(message || '校验不通过，请修改。');
          logger.debug('get false result of formula:', formula, 'with values:', values);
          return false;
        }
      } catch (err) {
        setErrorMessage('表单校验失败，请修改表单值或联系管理员。');
        logger.warn('failed to resolve formula:', err);
        return false;
      }

      return true;
    });

    if (valid) {
      onSubmit?.(values);
    }
  }

  function handleOnChange(values: any): void {
    onFormValueChange?.(values);
    setErrorMessage('');
  }

  return (
    <ConfigProvider locale={zhCN}>
      <div className={className || ''}>
        {errorMessage && (
          <p className="text-red-600">{errorMessage}</p>
        )}
        <SchemaForm
          previewPlaceholder='-'
          actions={actions}
          onSubmit={handleSubmit}
          onChange={handleOnChange}
          defaultValue={defaultValue}
          components={{ ...registry.components, ...additionalComponents }}
          schema={wrapSchemaByMegaLayout(schema)}
          effects={() => {
            if (schema['x-internal']?.visibleHiddenLinkages) {
              visibleHiddenLinkageEffect(
                schema['x-internal']?.visibleHiddenLinkages,
                actions,
              );
            }
            // find all defaultValueLinkages and run defaultValueLinkageEffect
            const _schema = { ...schema, properties: schemaToMap(schema) };
            defaultValueLinkageEffect(_schema, actions);
            calculationFormulaEffect(_schema, actions);
            formValueToFilter(_schema, actions);
          }}
        >
          {children as JSX.Element}
        </SchemaForm>
      </div>
    </ConfigProvider>
  );
}

export default FormRenderer;
