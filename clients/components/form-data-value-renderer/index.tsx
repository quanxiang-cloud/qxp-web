import React from 'react';
import moment from 'moment';

import SubTable from '@c/form-builder/registry/sub-table/preview';
import AssociatedRecords from '@c/form-builder/registry/associated-records/associated-records';
import AssociatedDataValueRender from '@c/form-builder/registry/associated-data/associated-data-view';
import { RoundMethod } from '@c/form-builder/registry/aggregation-records/convertor';
import logger from '@lib/logger';

type ValueRendererProps = { value: FormDataValue; schema: ISchema; className?: string; };
type Props = {
  value: FormDataValue;
  className?: string;
  schema: ISchema;
}

function enumValueRenderer({ value, schema }: ValueRendererProps): string {
  if (Array.isArray(value)) {
    const options = (schema.enum || []) as FormBuilder.Option[];
    const labels = (value as string[]).map((v) => {
      return options.find((option) => option.value === v)?.label || v;
    }).join(', ');

    return labels;
  }

  const options = (schema.enum || []) as FormBuilder.Option[];
  const label = options.find((option) => option.value === value)?.label || value as string;

  return label;
}

function datetimeValueRenderer({ value, schema }: ValueRendererProps): string {
  const format = schema['x-component-props']?.format || 'YYYY-MM-DD HH:mm:ss';

  return moment(value as string).format(format);
}

function SubTableValueRenderer({ value, schema }: ValueRendererProps): JSX.Element {
  return (
    // todo support className props, assign to lishengma
    // todo fix subTable Props definition
    <SubTable readonly value={value as Record<string, unknown>[]} schema={schema as any} />
  );
}

function AssociatedRecordsValueRender({ value, schema }: ValueRendererProps): JSX.Element {
  // todo support className props, assign to lishengma
  return (<AssociatedRecords readOnly props={schema} value={value} />);
}

function labelValueRenderer(value: FormDataValue): string {
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
    return value as string;
  case 'radiogroup':
  case 'checkboxgroup':
  case 'select':
  case 'multipleselect':
    return enumValueRenderer({ schema, value });
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
    logger.debug('encounter unsupported formDataValue:', value, 'schema:', schema);
    return value?.toString();
  }
}
