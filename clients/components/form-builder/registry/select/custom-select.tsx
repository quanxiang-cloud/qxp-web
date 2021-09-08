import React, { useState, ChangeEvent, useMemo, useRef } from 'react';
import { Select, Input, Divider } from 'antd';
import { RefSelectProps } from 'antd/lib/select';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import toast from '@lib/toast';
import useEnumOptions from '@lib/hooks/use-enum-options';
import FormDataValueRenderer from '@c/form-data-value-renderer';
import {
  CUSTOM_OTHER_VALUE,
  usePairValue,
  useCustomOtherValue,
} from '@c/form-builder/utils/label-value-pairs';

interface DropdownRenderProps {
  menu: React.ReactElement;
  isAllowCustom: boolean;
  onOtherCustomValueChange: (customValue: string) => void;
}

function DropdownRender({ menu, isAllowCustom, onOtherCustomValueChange }: DropdownRenderProps): JSX.Element {
  const [inputValue, setInputValue] = useState('');

  function handleInputValueChange(e: ChangeEvent<HTMLInputElement>): void {
    setInputValue(e.target.value);
  }

  function handleAddOption(): void {
    if (!inputValue) {
      toast.error('内容不能为空');
      return;
    }

    onOtherCustomValueChange(inputValue);
    setInputValue('');
  }

  function handlePressEnter(e: React.KeyboardEvent<HTMLInputElement>): void {
    e.stopPropagation();
    handleAddOption();
  }

  if (!isAllowCustom) {
    return (<div>{menu}</div>);
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
  const [otherCustomValue, setOtherCustomValue] = useCustomOtherValue(fieldProps.value);
  const realValue = usePairValue(fieldProps.value);
  const selectRef = useRef<RefSelectProps>(null);

  const isAllowCustom = !!fieldProps.props['x-component-props']?.allowCustom;
  const allOptions = useMemo(() => {
    if (!isAllowCustom || !otherCustomValue) {
      return options;
    }

    return options.concat({ label: otherCustomValue, value: CUSTOM_OTHER_VALUE });
  }, [isAllowCustom, options, otherCustomValue]);

  if (fieldProps.props.readOnly) {
    return <FormDataValueRenderer schema={fieldProps.schema} value={fieldProps.value} />;
  }

  return (
    <div className="flex flex-col w-full">
      <Select
        ref={selectRef}
        options={allOptions}
        placeholder="请选择选项"
        value={realValue}
        onSelect={(v, option) => {
          // This shouldn't happen
          if (Array.isArray(option)) {
            return;
          }

          fieldProps.mutators.change(`${option.label}:${option.value}`);
        }}
        dropdownRender={(menu) => (
          <DropdownRender
            menu={menu}
            isAllowCustom={isAllowCustom}
            onOtherCustomValueChange={(customValue) => {
              // todo close options after customValue changed
              setOtherCustomValue(customValue);
              fieldProps.mutators.change(`${customValue}:${CUSTOM_OTHER_VALUE}`);
            }}
          />
        )}
      />
    </div>
  );
}

CustomSelect.isFieldComponent = true;

export default CustomSelect;
