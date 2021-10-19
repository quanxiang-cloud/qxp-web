import React, { useState } from 'react';
import { SchemaForm, setValidationLanguage, IForm, createFormActions } from '@formily/antd';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { parse, resolve, findVariables } from 'qxp-formula';
import { omit } from 'ramda';

import logger from '@lib/logger';
import { schemaToMap } from '@lib/schema-convert';
import treeUtil from '@lib/tree';

import registry from './registry';
import visibleHiddenLinkageEffect from './linkages/visible-hidden';
import defaultValueLinkageEffect from './linkages/default-value';
import formValueToFilter from './linkages/form-value-to-filter';
import calculationFormulaEffect from './linkages/calculation-formula';
import { wrapSchemaByMegaLayout, schemaPermissionTransformer } from './utils';
import { INVALID_READONLY_LEGACY, INVISIBLE_NO_WRITE, PERMISSION, READONLY_NO_WRITE } from './constants';

setValidationLanguage('zh');

type Props = {
  schema: ISchema;
  value?: any;
  defaultValue?: any;
  className?: string;
  onSubmit?: (value: any) => void;
  onFormValueChange?: (value: any) => void;
  children?: React.ReactElement | ((form: IForm) => React.ReactElement);
  additionalComponents?: Record<string, React.JSXElementConstructor<any>>;
  usePermission?: boolean;
  readOnly?: boolean;
}

function FormRenderer({
  schema: inputSchema,
  defaultValue,
  className,
  onSubmit,
  onFormValueChange,
  value,
  children,
  additionalComponents = {},
  usePermission,
  readOnly,
}: Props): JSX.Element {
  const [errorMessage, setErrorMessage] = useState('');
  const actions = createFormActions();
  const schema = usePermission ? schemaPermissionTransformer(inputSchema, readOnly) : inputSchema;
  const fieldsToOmit = treeUtil.reduce((fields: string[], schema: ISchema, fieldId?: string | number) => {
    if ([INVISIBLE_NO_WRITE, READONLY_NO_WRITE, INVALID_READONLY_LEGACY].includes(
        schema?.['x-internal']?.permission as PERMISSION,
    )) {
      fields.push(`${fieldId}`);
    }
    return fields;
  }, 'properties', [], schema);

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
      onSubmit?.(omit(fieldsToOmit, values));
    }
  }

  function handleOnChange(values: any): void {
    onFormValueChange?.(omit(fieldsToOmit, values));
    setErrorMessage('');
  }

  return (
    <ConfigProvider locale={zhCN}>
      <div className={className || ''}>
        {errorMessage && (
          <p className="text-red-600">{errorMessage}</p>
        )}
        <SchemaForm
          value={value}
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
