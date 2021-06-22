import React from 'react';
import { useQuery } from 'react-query';
import { get, pick } from 'lodash';
import { SchemaMarkupField as Field } from '@formily/antd';

import { getFormFieldSchema } from '@flow/detail/content/editor/forms/api';
import { FormRenderer } from '@c/form-builder';

import CustomField from './custom-field';

interface Props {
  appId: string;
  tableId: string;
  onChange: (fieldData: any) => void;
}

const transformSchema = (schema: ISchema): ISchema => {
  const properties = get(schema, 'properties', {});
  const mapProperties = Object.entries(properties)
    .reduce((acc: Record<string, any>, [key, field]: [string, ISchema]) => {
      const innerFieldProps = pick(field, ['display', 'title', 'readonly']);
      Object.assign(acc, {
        [key]: {
          type: 'object',
          'x-component': 'CustomField',
          'x-component-props': innerFieldProps,
          properties: {
            [key]: { ...field, title: '' },
          }
        }
      });
      return acc;
    }, {});

  return {
    ...schema,
    properties: mapProperties,
  };
};

function TargetTableFields({ appId, tableId, onChange }: Props) {
  const { data: tableSchema, isLoading, isError } = useQuery(['GET_TARGET_TABLE_SCHEMA', tableId, appId], getFormFieldSchema, {
    enabled: !!appId && !!tableId,
  });

  const onFieldValuesChange = (values: any) => {
    console.log('change fields value:', values);
    onChange(values);
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

  console.log('transform table schema: ', transformSchema(tableSchema as ISchema));

  return (
    <div className="flex flex-col mt-20">
      <FormRenderer
        schema={transformSchema(tableSchema as ISchema)}
        onFormValueChange={onFieldValuesChange}
        additionalComponents={{ CustomField }}
      />
    </div>
  );
}

export default TargetTableFields;
