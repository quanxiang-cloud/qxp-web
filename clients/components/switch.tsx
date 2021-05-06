import React from 'react';
import useCss from 'react-use/lib/useCss';
import cs from 'classnames';
import { RadioGroup as LegoRadioGroup, RadioButton as LegoRadioButton } from '@QCFE/lego-ui';

interface ISwitchOption<Value> {
  label: string;
  value: Value;
}

interface ISwitch<Value extends React.Key> {
  className?: string;
  options: ISwitchOption<Value>[];
  onChange?: (value: Value) => void;
}

export default function Switch<Value extends React.Key>({ ...props }: ISwitch<Value>) {
  return (
    <div className={cs(useCss({
      display: 'inline-block',
      'margin-right': '16px',
      'label:hover': {
        background: '#000',
      },
      'label.radio-button': {
        width: '60px',
        height: '32px',
        color: '#475569',
        'font-size': '14px',
        background: '#fff',
        'line-height': '22px',
        padding: '5px 16px',
        'border-radius': '8px',
        border: '1px solid #CBD5E1',
      },
      'label.radio-button.checked': {
        color: '#375FF3',
        background: '#F1F5F9',
        'border-color': '#375FF3',
      },
      'label.radio-button.is-default.button.radio-button-wrapper.is-default.button:hover': {
        background: '#F1F5F9',
      },
    }), props.className)}>
      <LegoRadioGroup
        defaultValue={props.options[0]['value']}
        onChange={props.onChange}
      >
        {
          props.options.map((option) => {
            return (<LegoRadioButton
              key={option['value']}
              value={option['value']}>
              {option['label']}
            </LegoRadioButton>);
          })
        }
      </LegoRadioGroup>
    </div>

  );
}
