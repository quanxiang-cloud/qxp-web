import React from 'react';

import RadioGroup from '@c/radio/group';
import Radio from '@c/radio';

const RADIO_OPTIONS = [
  { value: 2, label: '通知公告' },
  { value: 1, label: '系统消息' },
];

interface Props {
  value?: number;
  onChange?: (value: string | number | boolean) => void;
}

function RadioField({ value, onChange }: Props): JSX.Element {
  function handleRadioChange(value: string | number | boolean): void {
    onChange && onChange(value);
  }

  return (
    <div className="flex items-center">
      <RadioGroup onChange={handleRadioChange}>
        {
          RADIO_OPTIONS.map((option) => {
            return (
              <Radio
                key={option.value}
                value={option.value}
                label={option.label}
                className="mr-8"
                defaultChecked={value === option.value ? true : false}
              />
            );
          })
        }
      </RadioGroup>
    </div>
  );
}

export default RadioField;

