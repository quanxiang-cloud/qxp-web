import React, { useState } from 'react';
import useCss from 'react-use/lib/useCss';
import { RadioGroup as LegoRadioGroup, RadioButton as LegoRadioButton } from '@QCFE/lego-ui';

interface ISwitchOption {
  label: string
  value: string
}

interface ISwitch {
  className?: string
  options: ISwitchOption[]
  onChange?: (value: string | number) => void
}

export const Switch = ({ ...props }: ISwitch) => {
  const [selectedValue, setSelectedValue] = useState(props.options[0]['value']);

  return (
    <div className={useCss({
      display: 'inline-block',
      'margin-right': '16px',
      'label.radio-button': {
        width: '60px',
        height: '32px',
        padding: '5px 16px',
        background: '#fff',
        color: '#475569',
        'font-size': '14px',
        'line-height': '22px',
        'border-color': '#CBD5E1',
        'border-radius':'8px'
      },
      'label.radio-button.checked': {
        'border-color': '#375FF3',
        color: '#375FF3',
      },
    })}>
      <LegoRadioGroup
        defaultValue={selectedValue}
        onChange={props.onChange}
      >
        {
          props.options.map(option => {
            return <LegoRadioButton
              key={option['value']}
              value={option['value']}>
              {option['label']}
            </LegoRadioButton>
          })
        }
      </LegoRadioGroup>
    </div>

  );
};
