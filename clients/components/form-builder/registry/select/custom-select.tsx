import React, { useState, ChangeEvent, useMemo, useRef } from 'react';
import { Select, Input } from 'antd';
import { RefSelectProps } from 'antd/lib/select';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { uniq } from 'lodash';

import toast from '@lib/toast';
import useEnumOptions from '@lib/hooks/use-enum-options';
import FormDataValueRenderer from '@c/form-data-value-renderer';

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
    if (!inputValue.trim()) {
      toast.error('内容不能为空');
      return;
    }

    onOtherCustomValueChange(inputValue.slice(0, 15));
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
      <div className="px-8  mt-4 pt-4 flex items-center flex-nowrap border-t-1 border-gray-200">
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
  const [otherCustomValue, setOtherCustomValue] = useState('');
  const selectRef = useRef<RefSelectProps>(null);

  const isAllowCustom = !!fieldProps.props['x-component-props']?.allowCustom;
  const allOptions = useMemo(() => {
    if (!isAllowCustom || !otherCustomValue) {
      return options;
    }

    return uniq([...options, otherCustomValue]);
  }, [isAllowCustom, options, otherCustomValue]);

  if (fieldProps.props.readOnly) {
    return <FormDataValueRenderer schema={fieldProps.schema} value={fieldProps.value} />;
  }

  return (
    <div className="flex flex-col w-full">
      <Select
        ref={selectRef}
        options={allOptions.map((option) => ({ label: option, value: option }))}
        placeholder="请选择选项"
        value={fieldProps.value}
        getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
        onSelect={(v: unknown, option: LabelValue[] | LabelValue) => {
          // This shouldn't happen
          if (Array.isArray(option)) {
            return;
          }

          // fieldProps.mutators.change(option.value);
          if (fieldProps?.isSubTableComponent) {
            fieldProps?.onChange(option.value);
          } else {
            fieldProps.mutators.change(option.value);
          }
        }}
        dropdownRender={(menu) => (
          <DropdownRender
            menu={menu}
            isAllowCustom={isAllowCustom}
            onOtherCustomValueChange={(customValue) => {
              // todo close options after customValue changed
              setOtherCustomValue(customValue);
              // fieldProps.mutators.change(customValue);
              if (fieldProps?.isSubTableComponent) {
                fieldProps?.onChange(customValue);
              } else {
                fieldProps.mutators.change(customValue);
              }
            }}
          />
        )}
      />
    </div>
  );
}

CustomSelect.isFieldComponent = true;

export default CustomSelect;
