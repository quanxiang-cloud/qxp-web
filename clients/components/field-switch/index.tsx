import React from 'react';
import zhCN from 'antd/lib/date-picker/locale/zh_CN';
import { DatePicker } from 'antd';

import { getPicker } from '@c/form-builder/registry/date-picker/date-picker';
import { omit } from 'lodash';
import CascadeSelector, {
  DefaultValueFrom, CascadeSelectorProps,
} from '@c/form-builder/registry/cascade-selector/cascade-selector';
import OrganizationPicker from '@c/form-builder/registry/organization-select/organization-select';
import UserPicker from '@c/form-builder/registry/user-picker/user-picker';
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
  switch (field['x-component']) {
  case 'CheckboxGroup':
  case 'Select':
  case 'RadioGroup':
  case 'MultipleSelect':
    return (
      <Select
        multiple={true}
        className={`'w-full ${className}`}
        ref={ref}
        {...otherProps}
        options={field?.enum as unknown as Option[] || []}
      />
    );
  case 'NumberPicker':
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
  case 'DatePicker':
    return (
      <DatePicker.RangePicker
        locale={zhCN}
        picker={getPicker(field['x-component-props']?.format)}
        ref={ref}
        className={`'w-full input ${className}`}
        {...omit(field['x-component-props'], ['placeholder'])}
        {...otherProps}
      />
    );
  case 'CascadeSelector':
    return (
      <CascadeSelector
        predefinedDataset={field['x-internal']?.predefinedDataset || ''}
        showFullPath={field['x-internal']?.showFullPath}
        className={`'w-full ${className}`}
        {...otherProps}
        {...field['x-component-props'] as CascadeSelectorProps}
        defaultValueFrom={field['x-internal']?.defaultValueFrom as DefaultValueFrom}
      />
    );
  case 'OrganizationPicker':
    return (
      <OrganizationPicker
        multiple={field['x-internal']?.multiple}
        optionalRange={field['x-internal']?.optionalRange}
        rangeList={field['x-internal']?.rangeList}
        {...field['x-component-props'] as { appID: string, placeholder?: string }}
        {...otherProps}
      />
    );
  case 'UserPicker':
    return (
      <UserPicker
        className='flex-1'
        options={field.enum as Option[]}
        mode={field['x-internal']?.multiple}
        optionalRange={field['x-internal']?.optionalRange}
        {...field['x-component-props']}
        {...otherProps}
      />
    );
  default:
    return <input ref={ref} className={`input ${className}`} {...otherProps} />;
  }
}

export default React.forwardRef(FieldSwitch);
