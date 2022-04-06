import React from 'react';

import { Select } from '@one-for-all/headless-ui';

interface Props {
  options: LabelValue[];
  value?: string;
  onChange?: (val: string) => void;
}

function SelectField({ value, onChange, options }: Props): JSX.Element {
  return (
    <Select
      placeholder="请填写"
      options={options}
      onChange={onChange}
      defaultValue={value}
    />
  );
}

export default SelectField;
