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

function DatePicker(props: ISchemaFieldComponentProps): JSX.Element {
  const componentProps = props.props?.['x-component-props'];

  useEffect(() => {
    if (componentProps.isNow) {
      props.mutators.change(moment(moment().format(componentProps.format as string)).toISOString());
    }
  }, []);

  const handleChange = (_: Moment | null, dateString: string): void => {
    props.mutators.change(dateString ? moment(dateString).toISOString() : '');
  };

  if (props.props.readOnly) {
    return <FormDataValueRenderer value={props.value} schema={props.schema} />;
  }

  return (
    <DatePickerAnt
      {...componentProps}
      picker={getPicker(componentProps.format as string || 'YYYY-MM-DD HH:mm:ss')}
      onChange={handleChange}
      value={props.value && moment(props.value)}
    />
  );
}

DatePicker.isFieldComponent = true;

export default DatePicker;
