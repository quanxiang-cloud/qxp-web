import React from 'react';
import { Checkbox, Space } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import useHandleOptions from '@lib/hooks/use-handle-options';

type CheckboxValueType = string | number | boolean;

function CheckBoxGroup(fieldProps: ISchemaFieldComponentProps): JSX.Element {
  const options = useHandleOptions(fieldProps);
  const { optionsLayout } = fieldProps.props['x-component-props'];

  function handleCheckBoxChange(value: Array<CheckboxValueType>): void {
    fieldProps.mutators.change(value);
  }

  if (options.length === 0) {
    return <span>当前选项集无数据。</span>;
  }

  return (
    <div className="flex items-center">
      <Checkbox.Group onChange={handleCheckBoxChange} value={fieldProps.value}>
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
