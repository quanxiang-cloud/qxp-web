import React from 'react';
import moment from 'moment';

import SubTable from '@c/form-builder/registry/sub-table/preview';
import AssociatedRecords from '@c/form-builder/registry/associated-records/associated-records';
import AssociatedDataValueRender from '@c/form-builder/registry/associated-data/associated-data-view';
import { RoundMethod } from '@c/form-builder/registry/aggregation-records/convertor';
import logger from '@lib/logger';
import { splitValue } from '@c/form-builder/utils';

type ValueRendererProps = { value: FormDataValue; schema: ISchema; className?: string; };
type Props = {
  value: FormDataValue;
  className?: string;
  schema: ISchema;
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

function objectLabelValueRenderer({ value, schema }: ValueRendererProps): string {
  if (!value) return '';
  const _value = value as string;
  const newValue: string = (_value.indexOf(':') !== -1) ? splitValue(_value).value : _value;
  const datasetId = schema['x-component-props']?.datasetId;
  if (datasetId) {
    if (_value.indexOf(':') !== -1) {
      const { label } = splitValue(_value);
      return label;
    }
    return newValue;
  }

  if (_value.indexOf(':') !== -1) {
    const { label } = splitValue(_value);
    return label;
  }

  const options = (schema.enum || []) as FormBuilder.Option[];
  const label = options.find((option) => option.value === _value)?.label ||
    ((_value.indexOf(':') !== -1 ? splitValue(_value).label : newValue));
  return label;
}

function arrayLabelValueRenderer({ value, schema }: ValueRendererProps): string {
  const newValue: string[] | LabelValue[] = (value as string[] | LabelValue[]) || [];
  const datasetId = schema['x-component-props'] && schema['x-component-props'].datasetId;
  if (datasetId) {
    const labels = newValue.map((v) => {
      const _value: string = typeof v === 'object' ? v.label : v;
      return _value;
    }).join(', ');
    return labels;
  }

  const options = (schema.enum || []) as FormBuilder.Option[];
  const labels = newValue.map((itemValue) => {
    const _value: string = typeof itemValue === 'object' ? itemValue.value : itemValue;
    return options.find((option) => option.value === _value)?.label ||
      (typeof itemValue === 'object' ? itemValue.label : itemValue);
  }).join(', ');

  return labels;
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
  case 'select':
    return objectLabelValueRenderer({ schema, value });
  case 'checkboxgroup':
  case 'multipleselect':
    return arrayLabelValueRenderer({ schema, value });
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
  case 'serial':
    return value as string;
  default:
    logger.warn('encounter unsupported formDataValue:', value, 'schema:', schema);
    return value?.toString();
  }
}
