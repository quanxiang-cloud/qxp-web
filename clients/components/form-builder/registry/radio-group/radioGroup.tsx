import React, { ChangeEvent, useState, useEffect } from 'react';
import { Radio, Input, RadioChangeEvent, Space } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

function RadioGroup(fieldProps: ISchemaFieldComponentProps): JSX.Element {
  const [customValue, setCustomValue] = useState('');

  const options: LabelValue[] = fieldProps.props.enum || [];
  const isAllowCustom = !!fieldProps.props['x-component-props'].allowCustom;
  const optionsLayout = fieldProps.props['x-component-props'].optionsLayout;

  useEffect(() => {
    if (fieldProps.value) {
      const isHave = options.some((option): boolean => option.value === fieldProps.value);
      if (!isHave) {
        setCustomValue(fieldProps.value);
      }
    }
  }, [fieldProps.value]);

  function handleCustomValueChange(e: ChangeEvent<HTMLInputElement>): void {
    setCustomValue(e.target.value);
    fieldProps.mutators.change(e.target.value);
  }

  function handleRadioChange(e: RadioChangeEvent): void {
    fieldProps.mutators.change(e.target.value);
  }
  return (
    <div className="flex items-center">
      <Radio.Group onChange={handleRadioChange} value={fieldProps.value}>
        <Space direction={optionsLayout}>
          {
            options.map((item): JSX.Element => {
              return (<Radio key={item.value} value={item.value}>{item.label}</Radio>);
            })
          }
          {
            isAllowCustom && (
              <Radio value={customValue}>
                <Input value={customValue} onChange={handleCustomValueChange} placeholder="请输入" />
              </Radio>
            )
          }
        </Space>
      </Radio.Group>
    </div>
  );
}

RadioGroup.isFieldComponent = true;

export default RadioGroup;
