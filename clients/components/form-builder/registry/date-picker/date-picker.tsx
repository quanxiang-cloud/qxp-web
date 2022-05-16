import React, { useEffect } from 'react';
import moment, { Moment } from 'moment';
import { DatePicker as DatePickerAnt } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import FormDataValueRenderer from '@c/form-data-value-renderer';

export function getPicker(format: string): 'year' | 'month' | undefined {
  switch (format) {
  case 'YYYY':
    return 'year';
  case 'YYYY-MM':
    return 'month';
  default:
    return undefined;
  }
}

function getDateStr(dateString: string, formatStr: string, fromNow?: boolean): string {
  if (fromNow) {
    return moment(moment().format(formatStr)).toISOString();
  }

  return dateString ? moment(dateString).format(formatStr) : '';
}

function DatePicker(props: ISchemaFieldComponentProps): JSX.Element {
  const componentProps = props.props?.['x-component-props'];
  const { defaultValue, format, isNow, ...restComponentProps } = componentProps;

  useEffect(() => {
    if (isNow) {
      props.mutators.change(getDateStr('', format, isNow ));
    }

    defaultValue && props.mutators.change(getDateStr(defaultValue, format));
  }, []);

  const handleChange = (_: Moment | null, dateString: string): void => {
    props.mutators.change(getDateStr(dateString, format));
  };

  if (props.props.readOnly) {
    return <FormDataValueRenderer value={props.value} schema={props.schema} />;
  }

  return (
    <DatePickerAnt
      {...restComponentProps}
      picker={getPicker(format as string || 'YYYY-MM-DD HH:mm:ss')}
      onChange={handleChange}
      getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
      value={props.value && moment(props.value)}
      defaultValue={defaultValue && moment(defaultValue)}
    />
  );
}

DatePicker.isFieldComponent = true;

export default DatePicker;
