import React, { useEffect } from 'react';
import moment, { Moment } from 'moment';
import { DatePicker as DatePickerAnt } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import FormDataValueRenderer from '@c/form-data-value-renderer';

moment.locale('zh-cn');

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
  const now = new Date();
  const Year = now.getFullYear();
  const Month = now.getMonth() + 1;
  const Day = now.getDay();
  const Hours = now.getHours();
  const Minutes = now.getMinutes();
  const Seconds = now.getSeconds();

  if (fromNow) {
    return moment(moment().format(formatStr)).toISOString();
  }

  if (dateString) {
    const _year = new Date(dateString).getFullYear();
    const _month = new Date(dateString).getMonth() + 1;
    const _day = new Date(dateString).getDate();
    const _hours = new Date(dateString).getHours();
    const _minutes = new Date(dateString).getMinutes();
    const _seconds = new Date(dateString).getSeconds();

    switch (formatStr) {
    case 'YYYY':
      return new Date(`${_year}-${Month}-${Day} ${Hours}:${Minutes}:${Seconds}`).toISOString();
    case 'YYYY-MM':
      return new Date(`${_year}-${_month}-${Day} ${Hours}:${Minutes}:${Seconds}`).toISOString();
    case 'YYYY-MM-DD':
      return new Date(`${_year}-${_month}-${_day} ${Hours}:${Minutes}:${Seconds}`).toISOString();
    case 'YYYY-MM-DD HH':
      return new Date(`${_year}-${_month}-${_day} ${_hours}:${Minutes}:${Seconds}`).toISOString();
    case 'YYYY-MM-DD HH:mm':
      return new Date(`${_year}-${_month}-${_day} ${_hours}:${_minutes}:${Seconds}`).toISOString();
    case 'YYYY-MM-DD HH:mm:ss':
      return new Date(`${_year}-${_month}-${_day} ${_hours}:${_minutes}:${_seconds}`).toISOString();
    default:
      return new Date(`${_year}-${_month}-${_day} ${Hours}:${Minutes}:${Seconds}`).toISOString();
    }
  } else {
    return '';
  }
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
      format={format}
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
