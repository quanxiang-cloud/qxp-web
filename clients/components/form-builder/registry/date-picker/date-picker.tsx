import React, { useEffect } from 'react';
import moment, { Moment } from 'moment';

import { DatePicker as DatePickerAnt, DatePickerProps } from 'antd';

type DatePickerCProps = DatePickerProps & {
  onChange: (value: string) => void;
  editable?: boolean;
  readOnly?: boolean;
  isNow?: boolean;
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
  useEffect(() => {
    if (props.isNow) {
      props.onChange(moment(moment().format(props.format as string)).toISOString());
    }
  }, []);

  const handleChange = (_: Moment | null, dateString: string): void => {
    props.onChange(dateString ? moment(dateString).toISOString() : '');
  };

  if (!(props.editable ?? !props.readOnly)) {
    return (
      <p className='preview-text'>
        {props.value ? moment(props.value).format(props.format as string || 'YYYY-MM-DD HH:mm:ss') : '-'}
      </p>
    );
  }

  return (
    <DatePickerAnt
      {...props}
      picker={getPicker(props.format as string || 'YYYY-MM-DD HH:mm:ss')}
      onChange={handleChange}
      value={props.value && moment(props.value)}
    />
  );
}

export default DatePicker;
