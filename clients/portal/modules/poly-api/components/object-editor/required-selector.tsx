import React from 'react';

import SelectValue from '../select-value';

interface Props {
  value: boolean;
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

function RequiredSelector({ value, onChange }: Props): JSX.Element {
  const val = options.find((o) => o.value === value);

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

export default RequiredSelector;
