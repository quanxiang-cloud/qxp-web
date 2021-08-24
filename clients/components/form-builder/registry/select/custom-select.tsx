import React, { useState, useEffect, ChangeEvent } from 'react';
import { Select, Input, Divider } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import Toast from '@lib/toast';
import useEnumOptions from '@lib/hooks/use-enum-options';
import { generateRandomFormFieldID, splitValue } from '@c/form-builder/utils';

const { Option } = Select;

interface DropdownRenderProps {
  menu: React.ReactElement;
  onChange: (value: string) => void;
}

function DropdownRender({ menu, onChange }: DropdownRenderProps): JSX.Element {
  const [inputValue, setInputValue] = useState('');

  function handleInputValueChange(e: ChangeEvent<HTMLInputElement>): void {
    setInputValue(e.target.value);
  }

  function handleAddOption(): void {
    if (!inputValue) {
      Toast.error('内容不能为空');
      return;
    }
    onChange(inputValue);
    setInputValue('');
  }

  function handlePressEnter(e: React.KeyboardEvent<HTMLInputElement>): void {
    e.stopPropagation();
    handleAddOption();
  }

  return (
    <div>
      {menu}
      <Divider className="my-4" />
      <div className="px-8 flex items-center flex-nowrap">
        <Input
          style={{ height: 32 }}
          size="small"
          className="flex-auto"
          maxLength={50}
          value={inputValue}
          onChange={handleInputValueChange}
          onPressEnter={handlePressEnter}
        />
        <span
          className="flex-node p-8 block cursor-pointer whitespace-nowrap"
          onClick={handleAddOption}
        >
          新增
        </span>
      </div>
    </div>
  );
}

function CustomSelect(fieldProps: ISchemaFieldComponentProps): JSX.Element {
  const options = useEnumOptions(fieldProps);
  const [customOption, setCustomOption] = useState<LabelValue | null>(null);
  const { allowCustom } = fieldProps.props['x-component-props'];
  const allOptions = (allowCustom && customOption) ? [...options, customOption] : options;

  useEffect(() => {
    if (!allowCustom) {
      setCustomOption(null);
      return;
    }

    if (fieldProps.value && (options.length > 0)) {
      const _value = (fieldProps.value.indexOf(':') !== -1) ?
        splitValue(fieldProps.value).value : fieldProps.value;
      const isValueInRange = options.find((option): boolean => option.value === _value);
      if (!isValueInRange) {
        const _label = (fieldProps.value.indexOf(':') !== -1) ?
          splitValue(fieldProps.value).label : '';
        setCustomOption({
          label: _label,
          value: generateRandomFormFieldID(),
        });
      }
    }
  }, [options, allowCustom]);

  function handleSelectChange(optionValue: string): void {
    const checkedOption = allOptions.filter((option) => option.value === optionValue);
    const { label, value } = checkedOption[0];
    fieldProps.mutators.change(`${label}:${value}`);
  }

  function handleAddOption(value: string): void {
    const addedOption = {
      label: value,
      value: generateRandomFormFieldID(),
    };
    setCustomOption(addedOption);
    fieldProps.mutators.change(`${addedOption.label}:${addedOption.value}`);
  }

  let selectValue = '';
  if (fieldProps && fieldProps.value) {
    selectValue = (fieldProps.value.indexOf(':') !== -1) ?
      splitValue(fieldProps.value).value : fieldProps.value;
    if (allowCustom) {
      const isValueInRange = allOptions.find((option) => option.value === selectValue);
      selectValue = !isValueInRange ? (customOption?.value || '') : selectValue;
    }
  }

  return (
    <div className="flex flex-col w-full">
      <Select
        placeholder="请选择选项"
        onSelect={handleSelectChange}
        value={selectValue}
        dropdownRender={
          allowCustom ? (menu) => (
            <DropdownRender
              menu={menu}
              onChange={handleAddOption}
            />
          ) : undefined
        }
      >
        {
          allOptions.map((option): JSX.Element => {
            return (<Option key={option.value} value={option.value}>{option.label}</Option>);
          })
        }
      </Select>
    </div>
  );
}

CustomSelect.isFieldComponent = true;

export default CustomSelect;
