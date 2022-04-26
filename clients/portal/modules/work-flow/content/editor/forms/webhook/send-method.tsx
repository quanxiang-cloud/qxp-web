import React from 'react';

import { Select } from '@one-for-all/headless-ui';

import { METHODS } from './constants';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function ContentType({ onChange, value }: Props): JSX.Element {
  return (
    <>
      <label>Content type</label>
      <Select
        options={METHODS}
        defaultValue='POST'
        value={value}
        onChange={onChange}
      />
    </>
  );
}
