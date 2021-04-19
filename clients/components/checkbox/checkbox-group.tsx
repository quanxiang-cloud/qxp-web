import React, { useState, useEffect, MouseEvent } from 'react';

import Checkbox from './index';

export type CheckboxValueType = string | number | boolean;

export interface CheckboxOptionType {
  label: React.ReactNode;
  value: CheckboxValueType;
  style?: React.CSSProperties;
  disabled?: boolean;
  onChange?: (e: MouseEvent) => void;
}

export interface CheckboxGroupContext {
  toggleOption?: (option: CheckboxOptionType) => void;
  value?: Array<CheckboxValueType>;
  disabled?: boolean;
}

export const GroupContext = React.createContext<CheckboxGroupContext | null>(null);

interface Props {
  defaultValue?: Array<CheckboxValueType>;
  value?: Array<CheckboxValueType>;
  disabled?: boolean;
  onChange?: (checkedValue: Array<CheckboxValueType>) => void;
  options?: Array<CheckboxOptionType | string>;
  children?: React.ReactNode;
}

function CheckboxGroup({
  defaultValue,
  options = [],
  children,
  onChange,
  ...restProps
}: Props) {
  const [value, setValue] = useState<CheckboxValueType[]>(
    restProps.value || defaultValue || [],
  );

  useEffect(() => {
    if ('value' in restProps) {
      setValue(restProps.value || []);
    }
  }, [restProps.value]);

  const toggleOption = (option: CheckboxOptionType) => {
    const optionIndex = value.indexOf(option.value);
    const newValue = [...value];
    if (optionIndex === -1) {
      newValue.push(option.value);
    } else {
      newValue.splice(optionIndex, 1);
    }
    if (!('value' in restProps)) {
      setValue(newValue);
    }
    const opts = getOptions();
    onChange?.(
      newValue
        .sort((a, b) => {
          const indexA = opts.findIndex((opt) => opt.value === a);
          const indexB = opts.findIndex((opt) => opt.value === b);
          return indexA - indexB;
        })
    );
  };

  const getOptions = (): Array<CheckboxOptionType> =>
    options.map((option) => {
      if (typeof option === 'string') {
        return {
          label: option,
          value: option,
        };
      }
      return option;
    });

  let newChildren = children;
  if (options && options.length > 0) {
    newChildren = getOptions().map((option: any) => {
      return (
        <div key={option.value.toString()} className="flex mr-20">
          <Checkbox
            disabled={'disabled' in option ? option.disabled : restProps.disabled}
            value={option.value}
            checked={value.indexOf(option.value) !== -1}
            onChange={option.onChange}
            label={option.label}
          />
        </div>);
    });
  }

  const context = {
    toggleOption,
    value,
    disabled: restProps.disabled,
  };

  return (
    <div className="flex items-center flex-wrap">
      <GroupContext.Provider value={context}>
        {newChildren}
      </GroupContext.Provider>
    </div>
  );
}

export default CheckboxGroup;
