import React from 'react';

import Checkbox from './index';

type CheckboxValueType = string | number;

interface CheckboxOptionType {
  label: React.ReactNode;
  value: CheckboxValueType;
  disabled?: boolean;
}

interface Props {
  defaultValue?: Array<CheckboxValueType>;
  value?: Array<CheckboxValueType>;
  disabled?: boolean;
  onChange?: (checkedValue: Array<CheckboxValueType>) => void;
  options?: Array<CheckboxOptionType | string>;
}

function CheckboxGroup({
  defaultValue,
  options = [],
  onChange,
  ...restProps
}: Props) {
  const [value, setValue] = React.useState<CheckboxValueType[]>(
    restProps.value || defaultValue || [],
  );

  React.useEffect(() => {
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
    onChange?.(newValue);
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

  let children;
  if (options && options.length > 0) {
    children = getOptions().map((option: any) => {
      return (
        <Checkbox
          key={option.value}
          disabled={'disabled' in option ? option.disabled : restProps.disabled}
          value={option.value}
          checked={value.indexOf(option.value) !== -1}
          label={option.label}
          onChange={() => toggleOption(option)}
          className="mr-20"
        />);
    });
  }

  return (
    <div className="flex items-center flex-wrap">
      {children}
    </div>
  );
}

export default CheckboxGroup;
