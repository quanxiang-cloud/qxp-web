import React from 'react';
import cs from 'classnames';

import Checkbox from './index';

export type CheckboxValueType = string | number;

export interface CheckboxOptionType {
  label: React.ReactNode;
  value: CheckboxValueType;
  disabled?: boolean;
}

interface Props {
  defaultValue?: Array<CheckboxValueType>;
  value?: Array<CheckboxValueType>;
  disabled?: boolean;
  onChange?: (checkedValue: Array<CheckboxValueType>) => void;
  options?: Array<CheckboxOptionType> | Array<string>;
  className?: string;
  style?: React.CSSProperties;
}

function CheckboxGroup({
  defaultValue,
  value,
  disabled,
  options = [],
  className,
  style,
  onChange,
}: Props): JSX.Element {
  const _options = options.map((option: CheckboxOptionType | string) => {
    if (typeof option === 'string') {
      return {
        label: option,
        value: option,
      };
    }
    return option;
  });

  const [checkedValue, setCheckedValue] = React.useState<CheckboxValueType[]>(
    value || defaultValue || [],
  );

  React.useEffect(() => {
    if (value) {
      setCheckedValue(value || []);
    }
  }, [value]);

  const toggleOption = (option: CheckboxOptionType): void => {
    const newValue = new Set(checkedValue);
    const isExist = newValue.has(option.value);
    if (!isExist) {
      newValue.add(option.value);
    } else {
      newValue.delete(option.value);
    }
    const arrayValue = Array.from(newValue);
    if (!value) {
      setCheckedValue(arrayValue);
    }
    onChange?.(arrayValue);
  };

  let children;
  if (options && options.length > 0) {
    children = _options.map((option: CheckboxOptionType) => {
      return (
        <Checkbox
          key={option.value}
          disabled={option.disabled || disabled}
          value={option.value}
          checked={checkedValue.indexOf(option.value) !== -1}
          label={option.label as string}
          onChange={() => toggleOption(option)}
          className="mr-20"
        />
      );
    });
  }

  return (
    <div className={cs('flex items-center flex-wrap', className)} style={style}>
      {children}
    </div>
  );
}

export default CheckboxGroup;
