import React from 'react';

import SelectValue from '../select-value';

interface Props {
  value: boolean;
  options?: Option[];
  onChange?: (value: boolean) => void;
}

type Option = {
  name: string;
  value: boolean;
}

const options = [
  {
    name: '是',
    value: true,
  },
  {
    name: '否',
    value: false,
  },
];

function BooleanSelector({ value, onChange, options: _options }: Props): JSX.Element {
  const val = (_options || options).find((o) => o.value === value);

  function handleChange(option: Option): void {
    onChange?.(option.value);
  }

  return (
    <SelectValue<Option>
      titleIndex="name"
      valueIndex="value"
      options={options}
      value={val}
      onChange={handleChange}
    />
  );
}

export default BooleanSelector;
