import React, { useState, useEffect } from 'react';
import { Checkbox, Space } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

import useEnumOptions from '@lib/hooks/use-enum-options';
import { optionsFormat } from '@lib/utils';
import { splitValue } from '@c/form-builder/utils';

function CheckBoxGroup(fieldProps: ISchemaFieldComponentProps): JSX.Element {
  const [checkboxValue, setCheckboxValue] = useState<string[]>(fieldProps.value || []);
  const options = useEnumOptions(fieldProps);
  const { optionsLayout } = fieldProps.props['x-component-props'];

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
      setCheckboxValue(values);
    }
  }, [fieldProps.value]);

  function handleCheckBoxChange(value: Array<CheckboxValueType>): void {
    const values = optionsFormat(value, options);
    fieldProps.mutators.change(values);
  }

  if (options.length === 0) {
    return <span>暂无选项可供选择。</span>;
  }

  const editable = fieldProps.editable ?? !fieldProps.readOnly;

  return (
    <div className="flex items-center">
      {editable && (
        <Checkbox.Group onChange={handleCheckBoxChange} value={checkboxValue}>
          <Space direction={optionsLayout}>
            {
              options.map((option): JSX.Element => {
                return (
                  <Checkbox key={option.value} value={option.value}>{option.label}</Checkbox>);
              })
            }
          </Space>
        </Checkbox.Group>
      )}
      {!editable && (
        <>{options.find(({ value }) => value === fieldProps.value)?.label || '-'}</>
      )}
    </div>
  );
}

CheckBoxGroup.isFieldComponent = true;

export default CheckBoxGroup;
