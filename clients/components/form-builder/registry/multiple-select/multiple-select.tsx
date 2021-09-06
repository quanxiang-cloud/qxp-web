import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import useEnumOptions from '@lib/hooks/use-enum-options';
import { optionsFormat } from '@lib/utils';
import { splitValue } from '@c/form-builder/utils';

const { Option } = Select;

function MultipleSelect(fieldProps: ISchemaFieldComponentProps): JSX.Element {
  const [selectValue, setSelectValue] = useState(fieldProps.value || []);
  const options = useEnumOptions(fieldProps);

  useEffect(() => {
    if (fieldProps.value && fieldProps.value.length > 0) {
      const values: string[] = [];
      fieldProps.value.forEach((option: string) => {
        if (option && option.indexOf(':') !== -1) {
          const { value } = splitValue(option);
          values.push(value);
          return;
        }

        values.push(option);
      });

      setSelectValue(values);
    }
  }, [fieldProps.value]);

  function handleSelectChange(value: string[]): void {
    const values = optionsFormat(value, options);
    fieldProps.mutators.change(values);
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
