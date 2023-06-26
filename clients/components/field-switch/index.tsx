/* eslint-disable no-case-declarations */
import React from 'react';
import zhCN from 'antd/lib/date-picker/locale/zh_CN';
import { omit } from 'lodash';
import { Option } from 'antd/lib/mentions';
import { DatePicker, Input, InputNumber } from 'antd';

import OrganizationPicker from '@c/form-builder/registry/organization-select/organization-select';
import UserPicker from '@c/form-builder/registry/user-picker/user-picker';
import { getPicker } from '@c/form-builder/registry/date-picker/date-picker';
import CascadeSelector, {
  DefaultValueFrom, CascadeSelectorProps,
} from '@c/form-builder/registry/cascade-selector/cascade-selector';

import SelectField from './select-field';
import { AssociatedData } from '@c/form-builder/registry/associated-data/associated-data';

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

function FieldSwitch({ field, className = '', ...otherProps }: Props<any>, ref: React.Ref<any>): JSX.Element {
  switch (field['x-component']) {
  case 'CheckboxGroup':
  case 'Select':
  case 'RadioGroup':
  case 'MultipleSelect':
    return (
      <SelectField
        fieldSchema={field}
        className={className}
        {...otherProps}
      />
    );
  case 'NumberPicker':
    return (
      <InputNumber
        {...field['x-component-props']}
        {...otherProps}
        className={className}
        ref={ref}
        type='number'
      />
    );
  case 'DatePicker':
    return (
      <DatePicker.RangePicker
        {...omit(field['x-component-props'], ['placeholder'])}
        {...otherProps}
        locale={zhCN}
        picker={getPicker(field['x-component-props']?.format)}
        ref={ref}
        className={`'w-full input ${className}`}
      />
    );
  case 'CascadeSelector':
    return (
      <CascadeSelector
        {...otherProps}
        {...field['x-component-props'] as CascadeSelectorProps}
        predefinedDataset={field['x-component-props']?.predefinedDataset || ''}
        showFullPath={field['x-component-props']?.showFullPath}
        className={`'w-full ${className}`}
        defaultValueFrom={field['x-internal']?.defaultValueFrom as DefaultValueFrom}
      />
    );
  case 'OrganizationPicker':
    return (
      <OrganizationPicker
        {...field['x-component-props'] as { appID: string, placeholder?: string }}
        {...otherProps}
        multiple
        optionalRange={field['x-component-props']?.optionalRange}
        defaultRange={field['x-component-props']?.defaultRange}
        rangeList={field['x-component-props']?.rangeList}
      />
    );
  case 'UserPicker':
    return (
      <UserPicker
        {...field['x-component-props']}
        {...otherProps}
        className='flex-1'
        options={field.enum as Option[]}
        mode={field['x-component-props']?.multiple}
        optionalRange={field['x-component-props']?.optionalRange}
      />
    );
  case 'AssociatedData':
    const { fieldName } = field?.['x-component-props'] || {};
    const { value, onChange } = otherProps || {};
    const _value = value ? {
      label: value[fieldName],
      value: value._id,
    } : value;
    return (
      <AssociatedData
        {...field['x-component-props']}
        {...otherProps}
        value={_value}
      />
    );
  default:
    return <Input {...otherProps} ref={ref} className={className} />;
  }
}

export default React.forwardRef(FieldSwitch);
