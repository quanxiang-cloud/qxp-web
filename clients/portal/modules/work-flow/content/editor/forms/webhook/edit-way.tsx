import React from 'react';

import Radio from '@c/radio';
import RadioGroup from '@c/radio/group';

type Props = {
  value: 'simple'|'multiple';
  onChange: () => void;
  values: Record<string, any>;
}

function EditWay({ value, onChange, values: { url, type } }: Props): JSX.Element {
  if (type === 'request' && !url) {
    return <></>;
  }
  return (
    <div className='flex items-center py-8 text-12'>
      <RadioGroup onChange={onChange}>
        <Radio
          key="multiple"
          label="key:value"
          value="multiple"
          defaultChecked={value === 'multiple'}
          className="mr-80"
        />
        <Radio
          key="simple"
          label="json"
          value="simple"
          defaultChecked={value === 'simple'}
        />
      </RadioGroup>
    </div>
  );
}

export default EditWay;
