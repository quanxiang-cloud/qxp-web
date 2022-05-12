import React from 'react';

import Radio from '@c/radio';
import RadioGroup from '@c/radio/group';

type Props = {
  value: 'simple'|'multiple';
  onChange: () => void;
}

function EditWay({ value, onChange }: Props): JSX.Element {
  return (
    <div className='flex items-center py-8 text-12'>
      <RadioGroup onChange={onChange}>
        <Radio
          key="simple"
          label="json"
          value="simple"
          defaultChecked={value === 'simple'}
          className="mr-100"
        />
        <Radio
          key="multiple"
          label="key:value"
          value="multiple"
          defaultChecked={value === 'multiple'}
        />
      </RadioGroup>
    </div>
  );
}

export default EditWay;
