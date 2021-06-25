import React from 'react';
import zhCN from 'antd/lib/date-picker/locale/zh_CN';
import { DatePicker } from 'antd';

import Select from '@c/select';

type Props<T> = {
  field: ISchema;
  onChange: (value: T) => void;
  className?: string;
  value?: T;
  defaultValue?: T;
  style?: React.CSSProperties;
}

type Option = {
  label: string;
  value: string;
}

function numberVerify(e: any, precision: number | undefined): void {
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

function FieldSwitch({ field, className, ...otherProps }: Props<any>, ref: React.Ref<any>): JSX.Element {
  switch (field?.type) {
  case 'array':
    return (
      <Select
        multiple={true}
        className={`'w-full ${className}`}
        ref={ref}
        {...otherProps}
        options={field?.enum as unknown as Option[] || []}
      />
    );
  case 'number':
    return (
      <input
        className={`input ${className}`}
        step={field['x-component-props']?.step}
        ref={ref}
        type='number'
        onKeyUp={(e) => numberVerify(e, field['x-component-props']?.precision)}
        {...otherProps}
      />
    );
  case 'datetime':
    return (
      <DatePicker.RangePicker
        locale={zhCN}
        ref={ref}
        className={`'w-full input ${className}`}
        {...field['x-component-props']}
        {...otherProps}
      />
    );
  case 'label-value':
    return (
      <div>未更新</div>
    );
  default:
    if (field?.enum && field?.enum.length) {
      return (
        <Select
          multiple={true}
          className={`'w-full ${className}`}
          ref={ref}
          {...otherProps}
          options={field?.enum as unknown as Option[] || []}
        />
      );
    }

    return <input ref={ref} className={`input ${className}`} {...otherProps} />;
  }
}

export default React.forwardRef(FieldSwitch);
