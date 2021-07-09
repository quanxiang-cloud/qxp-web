import React from 'react';
import moment from 'moment';

import SubTable from '@c/form-builder/registry/sub-table/preview';
import AssociatedRecords from '@c/form-builder/registry/associated-records/associated-records';
import logger from '@lib/logger';

type ValueRendererProps = { value: FormDataValue; schema: ISchema; className?: string; };
type ValueRenderer = React.FC<ValueRendererProps>;
type SupportedComponent =
  | 'Input'
  | 'Textarea'
  | 'RadioGroup'
  | 'CheckboxGroup'
  | 'NumberPicker'
  | 'DatePicker'
  | 'Select'
  | 'MultipleSelect'
  | 'SubTable'
  | 'AssociatedRecords'
  | 'UserPicker'
  | 'OrganizationPicker'
  | 'FileUpload'
  | 'ImageUpload'
  | 'CascadeSelector';

function InputValueRenderer({ value, className }: ValueRendererProps): JSX.Element {
  return (<span className={className}>{value}</span>);
}

function EnumValueRenderer({ value, schema, className }: ValueRendererProps): JSX.Element {
  if (Array.isArray(value)) {
    const options = (schema.enum || []) as FormBuilder.Option[];
    const labels = (value as string[]).map((v) => {
      options.find((option) => option.value === v)?.label || v;
    }).join(', ');

    return (<span className={className}>{labels}</span>);
  }

  const options = (schema.enum || []) as FormBuilder.Option[];
  const label = options.find((option) => option.value === value)?.label || value as string;

  return (<span className={className}>{label}</span>);
}

function DatetimeValueRenderer({ value, schema, className }: ValueRendererProps): JSX.Element {
  const format = schema['x-component-props']?.format || 'YYYY-MM-DD HH:mm:ss';

  return (<span className={className}>{moment(value as string).format(format)}</span>);
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

function LabelValueRenderer({ value, className }: ValueRendererProps): JSX.Element {
  if (Array.isArray(value)) {
    const labels = (value as FormBuilder.Option[]).map(({ label }) => label).join(', ');
    return (<span className={className}>{labels}</span>);
  }

  return (<span className={className}>{(value as FormBuilder.Option).label}</span>);
}

const VALUE_RENDER: Record<SupportedComponent, ValueRenderer> = {
  Input: InputValueRenderer,
  Textarea: InputValueRenderer,
  RadioGroup: EnumValueRenderer,
  CheckboxGroup: EnumValueRenderer,
  NumberPicker: InputValueRenderer,
  DatePicker: DatetimeValueRenderer,
  Select: EnumValueRenderer,
  MultipleSelect: EnumValueRenderer,
  SubTable: SubTableValueRenderer,
  AssociatedRecords: AssociatedRecordsValueRender,
  CascadeSelector: LabelValueRenderer,
  // todo replace LabelValueRenderer by a more specific type renderer
  UserPicker: LabelValueRenderer,
  OrganizationPicker: LabelValueRenderer,
  FileUpload: LabelValueRenderer,
  ImageUpload: LabelValueRenderer,
};

type Props = {
  value: FormDataValue;
  className?: string;
  schema: ISchema;
}

export default function FormDataValueRenderer({ value, schema, className }: Props): JSX.Element {
  const xComponent = schema['x-component'];
  if (!xComponent || !(xComponent in VALUE_RENDER)) {
    logger.debug('encounter unsupported formDataValue:', value, 'schema:', schema);
    return (<span className={className}>{value}</span>);
  }

  return React.createElement(
    VALUE_RENDER[xComponent as SupportedComponent],
    { value, schema, className },
  );
}
