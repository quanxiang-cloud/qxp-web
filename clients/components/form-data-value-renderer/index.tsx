import React from 'react';
import moment from 'moment';

import SubTable from '@c/form-builder/registry/sub-table/preview';
import AssociatedRecords from '@c/form-builder/registry/associated-records/associated-records';
import { Schema } from '@formily/react-schema-renderer';

import { getArrayValue, ArrayInitValue } from './utils';

type Value = string | string[] | Record<string, unknown>
  | Record<string, unknown>[] | number | number[];

type Props = {
  value: Value;
  className?: string;
  schema: Schema;
}

type Option = {
  value: string;
  label: string;
}

export function getBasicValue(schema: Schema, initValue: Value): string {
  const format = schema['x-component-props']?.format || 'YYYY-MM-DD HH:mm:ss';

  switch (schema.type) {
  case 'label-value':
    return (([] as Record<string, unknown>[]).concat(initValue as Record<string, unknown>[]))
      .map((itm) => itm.label).join(',');
  case 'datetime':
    if (Array.isArray(initValue)) {
      return (initValue as string[]).map((value: string) => {
        return moment(value).format(format);
      }).join('-');
    }
    return moment(initValue).format(format);
  case 'string':
    if (schema.enum && schema.enum.length) {
      return (schema.enum.find(({ value }: any) => value === initValue) as Option)?.label || '';
    }

    return initValue as string;
  case 'array':
    return getArrayValue(initValue as ArrayInitValue, schema);
  default:
    if (Array.isArray(initValue)) {
      return initValue.join(',');
    }

    if (typeof initValue === 'object' && initValue?.label) {
      return initValue?.label as string;
    }

    return initValue as string;
  }
}

function FormDataValueRenderer({ value, schema, className }: Props): JSX.Element {
  if (schema?.['x-component']?.toLowerCase() === 'subtable') {
    return (
      <SubTable
        value={value as Record<string, unknown>[]}
        schema={schema}
        readonly
      />
    );
  }

  if (schema?.['x-component']?.toLowerCase() === 'associatedrecords') {
    return (
      <AssociatedRecords
        readOnly
        props={schema}
        value={value}
      />
    );
  }

  return <span className={className}>{getBasicValue(schema, value)}</span>;
}

export default FormDataValueRenderer;
