import React from 'react';
import { Select } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import useEnumOptions from '@lib/hooks/use-enum-options';
import { stringToLabelValue } from '@lib/utils';

const { Option } = Select;

function MultipleSelect(fieldProps: ISchemaFieldComponentProps): JSX.Element {
  const options = useEnumOptions(fieldProps);
  const defaultValues: string[] | LabelValue[] = fieldProps.value || [];

  function handleSelectChange(value: string[]): void {
    const values = stringToLabelValue(value, options);
    fieldProps.mutators.change(values);
  }

  const selectValue: string[] = [];
  if (fieldProps && defaultValues.length > 0) {
    defaultValues.forEach((option) => {
      if (option && (typeof option === 'object')) {
        selectValue.push(option.value);
        return;
      }

      selectValue.push(option);
    });
  }

  return (
    <Select
      mode="multiple"
      value={selectValue}
      onChange={handleSelectChange}
    >
      {
        options.map((option): JSX.Element => {
          return (
            <Option key={option.value} value={option.value}>{option.label}</Option>);
        })
      }
    </Select>
  );
}

MultipleSelect.isFieldComponent = true;

export default MultipleSelect;
