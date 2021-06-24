import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import { get, pick, pickBy, each } from 'lodash';

import { getFormFieldSchema } from '@flow/detail/content/editor/forms/api';
import { FormRenderer } from '@c/form-builder';
import { ValueRule } from '@flowEditor/type';

import CustomField from './custom-field';
import Context from './context';

interface Props {
  appId: string;
  tableId: string;
}

function TargetTableFields({ appId, tableId }: Props) {
  const { data, setData } = useContext(Context);
  const { data: tableSchema, isLoading, isError } = useQuery(['GET_TARGET_TABLE_SCHEMA', tableId, appId], getFormFieldSchema, {
    enabled: !!appId && !!tableId,
  });

  const transformSchema = (schema: ISchema): ISchema => {
    const properties = get(schema, 'properties', {});
    const { createRule = {} } = data;
    const mapProperties = Object.entries(properties)
      .reduce((acc: Record<string, any>, [key, field]: [string, ISchema]) => {
        const innerFieldProps = pick(field, ['display', 'title', 'readonly', 'required']);
        // fixme: valueOf is builtIn func
        const defaultVal = createRule[key] && createRule[key].valueFrom === 'fixedValue' ?
          { default: typeof createRule[key].valueOf === 'function' ? '' : createRule[key].valueOf } : {};
        // todo: check field type, reset default value
        if (field['x-component'] === 'ImageUpload') {
          if (!Array.isArray(defaultVal.default)) {
            defaultVal.default = [];
          }
        }
        Object.assign(acc, {
          [key]: {
            type: 'object',
            'x-component': 'CustomField',
            'x-component-props': innerFieldProps,
            properties: {
              [key]: { ...field, title: '', ...defaultVal }, // merge default value
            },
          },
        });
        return acc;
      }, {});

    return {
      ...schema,
      properties: mapProperties,
    };
  };

  const onChangeFixedValue = (values: any) => {
    const fieldVals = pickBy(values, (v, k) => k.startsWith('field_'));
    // merge schema field value to data context
    each(data.createRule, (v: ValueRule, k: string) => {
      if (fieldVals[k] !== undefined) {
        Object.assign(v, {
          valueFrom: 'fixedValue',
          valueOf: fieldVals[k],
        });
      }
    });
    setData(pick(data, 'createRule', 'ref'));
  };

  if (isLoading) {
    return (
      <div>Loading table schema</div>
    );
  }

  if (isError) {
    return (
      <div>Load table schema failed</div>
    );
  }

  return (
    <div className="flex flex-col mt-20">
      <FormRenderer
        schema={transformSchema(tableSchema as ISchema)}
        onFormValueChange={onChangeFixedValue}
        additionalComponents={{ CustomField }}
        defaultValue={data}
      />
    </div>
  );
}

export default TargetTableFields;
