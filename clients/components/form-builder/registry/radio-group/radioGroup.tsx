import React, { useState, useMemo, useEffect, SetStateAction } from 'react';
import { Radio, Input, RadioChangeEvent, Space } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import useEnumOptions from '@lib/hooks/use-enum-options';

const CUSTOM_RADIO_VALUE = 'CUSTOM_RADIO_VALUE';

function useRealValue(currentValue?: string): string | undefined {
  return useMemo(() => {
    if (!currentValue) {
      return;
    }

    const labelValuePair: string[] = currentValue.split(':');
    // compatible with old version radio component
    if (labelValuePair.length === 1) {
      return labelValuePair[0];
    }

    return labelValuePair.pop();
  }, [currentValue]);
}

function useOtherValue(currentValue?: string): [string, React.Dispatch<SetStateAction<string>>] {
  const [otherValue, setOtherValue] = useState('');
  useEffect(() => {
    if (!currentValue) {
      return;
    }

    const labelValuePair = currentValue.split(':');
    if (labelValuePair.length < 2) {
      return;
    }

    if (labelValuePair.pop() === CUSTOM_RADIO_VALUE) {
      setOtherValue(labelValuePair.join(''));
    }
  }, []);

  return [otherValue, setOtherValue];
}

function RadioGroup(fieldProps: ISchemaFieldComponentProps): JSX.Element {
  const options = useEnumOptions(fieldProps);
  const [otherValue, setOtherValue] = useOtherValue(fieldProps.value);
  const realValue = useRealValue(fieldProps.value);
  const isAllowCustom = !!fieldProps.props['x-component-props'].allowCustom;
  const optionsLayout = fieldProps.props['x-component-props'].optionsLayout;

  function handleRadioChange(e: RadioChangeEvent): void {
    const selectedOption = options.find(({ value }) => value === e.target.value);
    if (selectedOption) {
      fieldProps.mutators.change(`${selectedOption.label}:${selectedOption.value}`);
      return;
    }

    fieldProps.mutators.change(`${otherValue}:${CUSTOM_RADIO_VALUE}`);
  }

  function handleOtherValueChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setOtherValue(e.target.value);
    if (realValue === CUSTOM_RADIO_VALUE) {
      fieldProps.mutators.change(`${e.target.value}:${CUSTOM_RADIO_VALUE}`);
    }
  }

  if (options.length === 0) {
    return <span>暂无可选项</span>;
  }

  const editable = fieldProps.editable ?? !fieldProps.readOnly;

  if (!editable) {
    if (!fieldProps.value) {
      return (
        <div className="flex items-center text-gray-600">-</div>
      );
    }

    const labelValuePair: string[] = fieldProps.value.split(':');

    // compatible with old version radio component
    if (labelValuePair.length === 1) {
      const label = (fieldProps.props.enum || []).find(({ value }: LabelValue) => {
        return value === labelValuePair[0];
      })?.label || '-';

      return (<div className="flex items-center">{label}</div>);
    }

    return (<div className="flex items-center">{labelValuePair.slice(0, -1).join('')}</div>);
  }

  return (
    <div className="flex items-center">
      <Radio.Group onChange={handleRadioChange} value={realValue}>
        <Space direction={optionsLayout}>
          {
            options.map((option) => {
              return (<Radio key={option.value} value={option.value}>{option.label}</Radio>);
            })
          }
          {
            isAllowCustom && (
              <Radio value={CUSTOM_RADIO_VALUE}>
                <Input value={otherValue} onChange={handleOtherValueChange} placeholder="请输入" />
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
