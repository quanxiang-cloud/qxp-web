import React, { useState, useEffect, ChangeEvent } from 'react';
import { Select, Input, Divider } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import Toast from '@lib/toast';
import useEnumOptions from '@lib/hooks/use-enum-options';

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
  const [customOption, setCustomOption] = useState<LabelValue | null >(null);
  const { allowCustom } = fieldProps.props['x-component-props'];

  useEffect(() => {
    if (!allowCustom) {
      setCustomOption(null);
      return;
    }

    if (fieldProps.value) {
      const isValueInRange = options.some((option): boolean => option.value === fieldProps.value);
      if (!isValueInRange) {
        setCustomOption({
          label: fieldProps.value,
          value: fieldProps.value,
        });
      }
    }
  }, [fieldProps.value, options, allowCustom]);

  function handleSelectChange(optionValue: string): void {
    fieldProps.mutators.change(optionValue);
  }

  function handleAddOption(value: string): void {
    setCustomOption({
      label: value,
      value: value,
    });
    handleSelectChange(value);
  }

  const newOptions: LabelValue[] = customOption ? [...options, customOption] : options;

  return (
    <div className="flex items-center w-full">
      <Select
        placeholder="请选择选项"
        onSelect={handleSelectChange}
        value={fieldProps.value}
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
          newOptions.map((option): JSX.Element => {
            return (<Option key={option.value} value={option.value}>{option.label}</Option>);
          })
        }
      </Select>
    </div>
  );
}

CustomSelect.isFieldComponent = true;

export default CustomSelect;
