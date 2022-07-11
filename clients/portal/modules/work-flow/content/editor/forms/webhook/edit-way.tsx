import React from 'react';

import Checkbox from '@c/checkbox';

type Props = {
  value: 'simple' | 'multiple';
  onChange: (val: string) => void;
  values: Record<string, any>;
}

function EditWay({ value = 'multiple', onChange, values: { url, type } }: Props): JSX.Element {
  if (type === 'request' && !url) {
    return <></>;
  }

  return (
    <div className='py-8 text-12 flex items-center justify-start gap-100'>
      <Checkbox
        rounded
        label="key:value"
        checked={value === 'multiple'}
        value="request"
        onChange={() => onChange('multiple')}
      />
      <Checkbox
        rounded
        label="json"
        checked={value === 'simple'}
        value="send"
        onChange={() => onChange('simple')}
      />
    </div>
  );
}

export default EditWay;
