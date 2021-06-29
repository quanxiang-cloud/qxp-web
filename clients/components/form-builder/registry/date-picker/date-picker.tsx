import React from 'react';
import moment, { Moment } from 'moment';

import { DatePicker as DatePickerAnt, DatePickerProps } from 'antd';

type DatePickerCProps = DatePickerProps & {
  onChange: (value: string) => void;
  readOnly?: boolean;
}

function DatePicker(props: DatePickerCProps): JSX.Element {
  const handleChange = (_: Moment | null, dateString: string): void => {
    props.onChange(moment(dateString).format());
  };

  if (props.readOnly) {
    return (
      <p className='preview-text'>
        {props.value ? moment(props.value).format(props.format as string) : 'N/A'}
      </p>
    );
  }

  return <DatePickerAnt {...props} onChange={handleChange} value={props.value && moment(props.value)} />;
}

export default DatePicker;
