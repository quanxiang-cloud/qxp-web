import React from 'react';
import moment, { Moment } from 'moment';

import { DatePicker as DatePickerAnt, DatePickerProps } from 'antd';

type DatePickerCProps = DatePickerProps & {
  onChange: (value: string) => void;
  readOnly?: boolean;
}

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

function DatePicker(props: DatePickerCProps): JSX.Element {
  const handleChange = (_: Moment | null, dateString: string): void => {
    props.onChange(dateString ? moment(dateString).toISOString(true) : '');
  };

  if (props.readOnly) {
    return (
      <p className='preview-text'>
        {props.value ? moment(props.value).format(props.format as string) : 'N/A'}
      </p>
    );
  }

  return (
    <DatePickerAnt
      {...props}
      picker={getPicker(props.format as string || '')}
      onChange={handleChange}
      value={props.value && moment(props.value)}
    />
  );
}

export default DatePicker;
