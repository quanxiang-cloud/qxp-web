import React from 'react';

import Select from '@c/select';
import DatePicker from '@c/date-picker';
import RangePicker from '@c/range-picker';

type Props<T> = {
  filtrate: FilterField;
  onChange: (value: T) => void;
  className?: string;
  value?: T;
  style?: React.CSSProperties;
}

function numberVerify(e: any, precision: number | undefined) {
  if (precision === undefined) {
    return;
  }

  const value = e.target.value;
  if (value === '') {
    return;
  }

  const reg = new RegExp(`^\\d+\\.?\\d{0,${precision}}$`);

  if (!reg.test(value)) {
    const valueArr = value.split('.');
    e.target.value = valueArr[0] + '.' + valueArr[1].substr(0, precision);
  }
}

function FieldSwitch({ filtrate, className, ...otherProps }: Props<any>, ref: React.Ref<any>) {
  switch (filtrate.type) {
  case 'string':
    return <input ref={ref} className={`input ${className}`} {...otherProps} />;
  case 'number':
    return (
      <input
        className={`input ${className}`}
        step={filtrate.step}
        ref={ref}
        {...otherProps}
        type='number'
        onKeyUp={(e) => numberVerify(e, filtrate.precision)}
      />
    );
  case 'select':
    return (
      <Select
        multiple={!!filtrate.multiple}
        className={`'w-full ${className}`}
        ref={ref}
        {...otherProps}
        options={filtrate.enum || []}
      />
    );
  case 'date':
    return (
      <DatePicker
        ref={ref}
        selectedDate={otherProps.value}
        className={`'w-full ${className}`}
        {...otherProps}
      />
    );
  case 'date_range':
    return (
      <RangePicker
        ref={ref}
        className={`'w-full ${className}`}
        readableCode={otherProps.value?.readableCode}
        {...otherProps}
      />
    );
  default:
    return null;
  }
}

export default React.forwardRef(FieldSwitch);
