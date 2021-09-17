import React, { Suspense } from 'react';
import moment from 'moment';

const SubTable = React.lazy(() => import('@c/form-builder/registry/sub-table/preview'));
const AssociatedRecords = React.lazy(
  () => import('@c/form-builder/registry/associated-records/associated-records'),
);

import AssociatedDataValueRender from '@c/form-builder/registry/associated-data/associated-data-view';
import { RoundMethod } from '@c/form-builder/registry/aggregation-records/convertor';
import logger from '@lib/logger';

type ValueRendererProps = { value: FormDataValue; schema: ISchema; className?: string; };
type Props = {
  value: FormDataValue;
  className?: string;
  schema: ISchema;
}

function datetimeValueRenderer({ value, schema }: ValueRendererProps): string {
  const format = schema['x-component-props']?.format || 'YYYY-MM-DD HH:mm:ss';

  return value ? moment(value as string).format(format) : '';
}

function SubTableValueRenderer({ value, schema, className }: ValueRendererProps): JSX.Element {
  return (
    <Suspense fallback={<div>loading...</div>} >
      <SubTable
        props={{ readOnly: true, className }}
        value={value as Record<string, unknown>[]}
        schema={schema as any}
      />
    </Suspense>
  );
}

function AssociatedRecordsValueRender({ value, schema, className }: ValueRendererProps): JSX.Element {
  return (
    <Suspense fallback={<div>loading...</div>} >
      <AssociatedRecords
        props={{ readOnly: true, ['x-component-props']: schema?.['x-component-props'], className }}
        value={value}
      />
    </Suspense>
  );
}

export function labelValueRenderer(value: FormDataValue): string {
  if (Array.isArray(value)) {
    const labels = (value as FormBuilder.Option[]).map(({ label }) => label).join(', ');
    return labels;
  }

  return (value as FormBuilder.Option)?.label;
}

function statisticValueRender({ schema, value }: ValueRendererProps): string {
  const { decimalPlaces, roundDecimal, displayFieldNull } = schema['x-component-props'] as {
    decimalPlaces: number, roundDecimal: RoundMethod, displayFieldNull: string
  };
  let method = Math.round;
  if (roundDecimal === 'round-up') {
    method = Math.ceil;
  } else if (roundDecimal === 'round-down') {
    method = Math.floor;
  }
  return method(parseFloat(value as string)).toFixed(decimalPlaces) + '' || displayFieldNull;
}

function stringListValue({ value }: ValueRendererProps): string {
  if (!Array.isArray(value)) {
    return '';
  }

  return value.join(', ');
}

export default function FormDataValueRenderer({ value, schema, className }: Props): JSX.Element {
  if (schema['x-component'] === 'SubTable') {
    return <SubTableValueRenderer schema={schema} value={value} />;
  }

  if (schema['x-component'] === 'AssociatedRecords') {
    return <AssociatedRecordsValueRender schema={schema} value={value} />;
  }

  if (schema['x-component'] === 'AssociatedData') {
    return <AssociatedDataValueRender schema={schema} value={value as LabelValue} />;
  }

  return <span className={className}>{getBasicValue(schema, value)}</span>;
}

export function getBasicValue(schema: ISchema, value: FormDataValue): string {
  switch (schema['x-component']?.toLowerCase()) {
  case 'input':
  case 'numberpicker':
  case 'textarea':
  case 'radiogroup':
  case 'select':
  case 'serial':
    return value as string;
  case 'checkboxgroup':
  case 'multipleselect':
    return stringListValue({ schema, value });
  case 'datepicker':
    return datetimeValueRenderer({ schema, value });
  case 'associateddata':
  case 'imageupload':
  case 'cascadeselector':
  case 'fileupload':
  case 'userpicker':
  case 'organizationpicker':
    return labelValueRenderer(value);
  case 'aggregationrecords':
    return statisticValueRender({ schema, value });
  default:
    logger.warn('encounter unsupported formDataValue:', value, 'schema:', schema);
    return value?.toString();
  }
}
