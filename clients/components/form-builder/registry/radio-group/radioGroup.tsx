import React, { ChangeEvent, useState, useEffect } from 'react';
import { Radio, Input, RadioChangeEvent, Space } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import useEnumOptions from '@lib/hooks/use-enum-options';
import { generateRandomFormFieldID, splitValue } from '@c/form-builder/utils';

const INITIAL_OPTION = { label: '', value: generateRandomFormFieldID() };

function RadioGroup(fieldProps: ISchemaFieldComponentProps): JSX.Element {
  const options = useEnumOptions(fieldProps);
  const [customOption, setCustomOption] = useState(INITIAL_OPTION);
  const { allowCustom, optionsLayout } = fieldProps.props['x-component-props'];
  const allOptions = allowCustom ? [...options, customOption] : options;

  useEffect(() => {
    if (fieldProps.value && allowCustom) {
      const _value = fieldProps.value.indexOf(':') !== -1 ?
        splitValue(fieldProps.value).value : fieldProps.value;
      const isValueInRange = options.find((option): boolean => option.value === _value);
      if (!isValueInRange) {
        setCustomOption({
          ...customOption,
          label: splitValue(fieldProps.value).label,
        });
        return;
      }

      setCustomOption(INITIAL_OPTION);
    }
  }, [options, allowCustom]);

  function handleCustomValueChange(e: ChangeEvent<HTMLInputElement>): void {
    const addedOption = {
      ...customOption,
      label: e.target.value,
    };
    setCustomOption(addedOption);
    fieldProps.mutators.change(`${addedOption.label}:${addedOption.value}`);
  }

  function handleRadioChange(e: RadioChangeEvent): void {
    const checkedOption = allOptions.filter((option) => option.value === e.target.value);
    const { label, value } = checkedOption[0];
    fieldProps.mutators.change(`${label}:${value}`);
  }

  let radioValue: null | string = null;
  if (fieldProps && fieldProps.value) {
    radioValue = fieldProps.value.indexOf(':') !== -1 ?
      splitValue(fieldProps.value).value : fieldProps.value;
    // Judge whether to put the deleted option into the custom option
    if (allowCustom) {
      const isValueInRange = allOptions.find((option) => option.value === radioValue);
      radioValue = !isValueInRange ? customOption.value : radioValue;
    }
  }

  if (allOptions.length === 0) {
    return <span>暂无选项可供选择。</span>;
  }

  return (
    <div className="flex flex-col">
      <Radio.Group onChange={handleRadioChange} value={radioValue}>
        <Space direction={optionsLayout}>
          {
            options.map((option): JSX.Element => {
              return (<Radio key={option.value} value={option.value}>{option.label}</Radio>);
            })
          }
          {
            allowCustom && (
              <Radio value={customOption.value}>
                <Input
                  placeholder="请输入"
                  maxLength={50}
                  value={customOption.label}
                  onChange={handleCustomValueChange}
                />
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
