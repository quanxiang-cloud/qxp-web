import React, { Suspense } from 'react';
import moment from 'moment';

import logger from '@lib/logger';
import AssociatedDataValueRender from '@c/form-builder/registry/associated-data/associated-data-view';
import Icon from '@c/icon';
import { RoundMethod } from '@c/form-builder/registry/aggregation-records/convertor';
import { FileList } from '@c/file-upload';
import { QxpFileFormData } from '@c/form-builder/registry/file-upload/uploader';
import { isEmpty } from 'lodash';
import { isMeanless } from '@lib/utils';

const ReadOnlySubTable = React.lazy(
  () => import('@c/form-builder/registry/sub-table/preview/read-only-sub-table'),
);
const AssociatedRecords = React.lazy(
  () => import('@c/form-builder/registry/associated-records/associated-records'),
);

type ValueRendererProps = { value: FormDataValue; schema: ISchema; className?: string; };
type Props = {
  value?: FormDataValue;
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
      <ReadOnlySubTable
        className={className}
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

function numberPickerValueRender({ schema, value }: ValueRendererProps): string {
  return Number(value).toFixed(schema?.['x-component-props']?.precision || 0);
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
  if (!value) {
    return <></>;
  }
  switch (schema['x-component']?.toLowerCase()) {
  case 'subtable':
    return (<SubTableValueRenderer schema={schema} value={value} />);
  case 'associatedrecords':
    return (<AssociatedRecordsValueRender schema={schema} value={value} />);
  case 'associateddata':
    return (<AssociatedDataValueRender schema={schema} value={value as LabelValue} />);
  case 'imageupload': {
    return (
      <div className="flex flex-wrap gap-4 w-full max-h-144 overflow-auto">
        <FileList
          canDownload
          imgOnly={true}
          files={(value as QxpFileFormData[]).map((file) =>
            ({
              name: file.label,
              uid: file.value,
              type: file.type,
              size: file.size || 0,
            }),
          )}
        />
      </div>

    );
  }
  case 'fileupload': {
    return (
      <div className="max-w-290">
        <FileList
          canDownload
          files={(value as QxpFileFormData[]).map((file) =>
            ({
              name: file.label,
              uid: file.value,
              type: file.type,
              size: file.size || 0,
            }),
          )}
        />
      </div>
    );
  }
  default: {
    const content = getBasicValue(schema, value);
    return (
      <span title={typeof content === 'string' ? content : ''} className={className}>{content}</span>
    );
  }
  }
}

export function FormDataSubTableValueRenderer({ value, schema, className }: Props): JSX.Element {
  const componentName = schema['x-component']?.toLowerCase();
  if (componentName === 'fileupload') {
    const fileIconStyle: React.CSSProperties = {
      display: 'block',
      padding: '0',
      width: 'auto',
    };
    return (
      <div className="flex items-center">
        <Icon
          name="attachment"
          size={22}
          className="mr-2 transform -rotate-90"
        ></Icon>
        {!isEmpty(value) ? (
          <FileList
            canDownload
            style={fileIconStyle}
            showFileName={false}
            files={(value as QxpFileFormData[]).map((file) => ({
              name: file.label,
              uid: file.value,
              type: file.type,
              size: file.size || 0,
            }))}
          />
        ) : (
          <span className="text-gray-500">无附件</span>
        )}
      </div>
    );
  }

  if (componentName === 'imageupload') {
    return (
      <div className="flex items-center">
        <Icon name="image" size={22} className="mr-2"></Icon>
        {!isEmpty(value) ? (
          <div className="flex flex-nowrap gap-4">
            <FileList
              imgOnly
              canDownload={false}
              files={(value as QxpFileFormData[]).map((file) => ({
                name: file.label,
                uid: file.value,
                type: file.type,
                size: file.size || 0,
              }))}
            />
          </div>
        ) : (
          <span className="text-gray-500">无图片</span>
        )}
      </div>
    );
  }
  return isMeanless(value) ? (
    <span className="text-gray-300">——</span>
  ) : (
    <FormDataValueRenderer
      value={value}
      schema={schema}
      className={className}
    />
  );
}

export function getBasicValue(schema: ISchema, value: FormDataValue): string {
  switch (schema['x-component']?.toLowerCase()) {
  case 'input':
  case 'textarea':
  case 'radiogroup':
  case 'select':
  case 'serial':
    return value as string;
  case 'numberpicker':
    return numberPickerValueRender({ schema, value });
  case 'checkboxgroup':
  case 'multipleselect':
    return stringListValue({ schema, value });
  case 'datepicker':
    return datetimeValueRenderer({ schema, value });
  case 'associateddata':
  case 'cascadeselector':
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
