import React from 'react';

import Radio from '@c/radio';
import RadioGroup from '@c/radio/group';

type Props = {
  value?: string;
  onChange?: (value: string) => void;
}

const options = [
  { label: '从空白创建', value: 'base' },
  { label: '从模版创建', value: 'template' },
];

function AppCreatedBy({ value, onChange }: Props): JSX.Element {
  return (
    <div className="flex items-center">
      <RadioGroup onChange={(value) => onChange?.(value.toString())}>
        {options.map((option) => {
          return (
            <Radio
              className="mr-8"
              key={option.value}
              value={option.value}
              label={option.label}
              defaultChecked={value === option.value}
            />
          );
        })}
      </RadioGroup>
    </div>
  );
}

export default AppCreatedBy;
