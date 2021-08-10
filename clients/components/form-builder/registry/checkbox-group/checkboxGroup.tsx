import React from 'react';
import { Checkbox, Space } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

type CheckboxValueType = string | number | boolean;

function CheckBoxGroup(fieldProps: ISchemaFieldComponentProps): JSX.Element {
  const options: LabelValue[] = fieldProps.props.enum || [];
  const optionsLayout = fieldProps.props['x-component-props'].optionsLayout;

  function onCheckBoxChange(value: Array<CheckboxValueType>): void {
    fieldProps.mutators.change(value);
  }

  return (
    <div className="flex items-center">
      <Checkbox.Group onChange={onCheckBoxChange} value={fieldProps.value}>
        <Space direction={optionsLayout}>
          {
            options.map((item): JSX.Element => {
              return (<Checkbox key={item.value} value={item.value}>{item.label}</Checkbox>);
            })
          }
        </Space>
      </Checkbox.Group>
    </div>
  );
}

CheckBoxGroup.isFieldComponent = true;

export default CheckBoxGroup;
