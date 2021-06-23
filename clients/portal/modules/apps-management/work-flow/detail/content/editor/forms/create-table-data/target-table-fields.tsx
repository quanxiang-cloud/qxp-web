import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import { get, pick, pickBy, omitBy, each } from 'lodash';

import { getFormFieldSchema } from '@flow/detail/content/editor/forms/api';
import { FormRenderer } from '@c/form-builder';
import { TableDataCreateData, ValueRule } from '@flowEditor/type';

import CustomField from './custom-field';
import Context from './context';

interface Props {
  appId: string;
  tableId: string;
  defaultValue: TableDataCreateData;
}

function TargetTableFields({ appId, tableId, defaultValue }: Props) {
  const { data, setData } = useContext(Context);
  const { data: tableSchema, isLoading, isError } = useQuery(['GET_TARGET_TABLE_SCHEMA', tableId, appId], getFormFieldSchema, {
    enabled: !!appId && !!tableId,
  });

  const transformSchema = (schema: ISchema): ISchema => {
    const properties = get(schema, 'properties', {});
    const { createRule = {} } = data;
    const mapProperties = Object.entries(properties)
      .reduce((acc: Record<string, any>, [key, field]: [string, ISchema]) => {
        const innerFieldProps = pick(field, ['display', 'title', 'readonly']);
        const defaultVal = createRule[key] && createRule[key].valueFrom === 'fixedValue' ?
          { default: createRule[key].valueOf } : {};
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
    // todo: values passed from form-render sometimes with multiple fields undefined
    const fieldVals = pickBy(values, (v, k) => k.startsWith('field_'));
    const commitVals = omitBy(values, (v, k) => k.startsWith('field_'));
    each(commitVals.createRule, (v: ValueRule, k: string) => {
      if (k in fieldVals && fieldVals[k] !== v.valueOf) {
        Object.assign(v, {
          valueFrom: 'fixedValue',
          valueOf: fieldVals[k],
        });
      }
    });

    setData(commitVals);
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
        defaultValue={defaultValue}
      />
    </div>
  );
}

export default TargetTableFields;
