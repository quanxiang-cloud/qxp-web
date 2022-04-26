import React from 'react';

import { Select } from '@one-for-all/headless-ui';

interface Props {
  value: 'application/json' | '';
  onChange: (value: 'application/json' | '') => void;
}

export default function ContentType({ onChange, value }: Props): JSX.Element {
  return (
    <>
      <label>Content type</label>
      <Select
        options={[{ label: 'application/json', value: 'application/json' }]}
        defaultValue='application/json'
        value={value}
        onChange={onChange}
      />
    </>
  );
}
