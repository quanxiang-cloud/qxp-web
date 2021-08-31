import React from 'react';
import { Checkbox, Space } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import useEnumOptions from '@lib/hooks/use-enum-options';
import { stringToLabelValue } from '@lib/utils';

function CheckBoxGroup(fieldProps: ISchemaFieldComponentProps): JSX.Element {
  const options = useEnumOptions(fieldProps);
  const { optionsLayout } = fieldProps.props['x-component-props'];
  const defaultValues: string[] | LabelValue[] = fieldProps.value || [];

  function handleCheckBoxChange(value: Array<CheckboxValueType>): void {
    const values = stringToLabelValue(value, options);
    fieldProps.mutators.change(values);
  }

  const checkboxValue: string[] = [];
  if (fieldProps && defaultValues.length > 0) {
    defaultValues.forEach((option) => {
      if (option && typeof option === 'object') {
        checkboxValue.push(option.value);
        return;
      }

      checkboxValue.push(option);
    });
  }

  if (options.length === 0) {
    return <span>暂无选项可供选择。</span>;
  }

  return (
    <div className="flex items-center">
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
    </div>
  );
}

CheckBoxGroup.isFieldComponent = true;

export default CheckBoxGroup;
