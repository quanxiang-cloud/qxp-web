import React from 'react';
import type { UseFormSetValue } from 'react-hook-form';

import Checkbox from '@c/checkbox';

interface Props {
  value: 'request' | 'send';
  onChange: (v: 'request' | 'send') => void;
  setFormValue: UseFormSetValue<any>;
}

export default function TriggerWay({ value, onChange, setFormValue }: Props): JSX.Element {
  return (
    <div>
      <p className="mt-16 mb-8">触发方式</p>
      <div className="flex items-center justify-between">
        <Checkbox
          label="获取数据"
          checked={value === 'request'}
          value="request"
          onChange={() => {
            onChange('request');
            setFormValue('inputs', []);
          }}
        />
        <Checkbox
          label="推送数据"
          checked={value === 'send'}
          value="send"
          onChange={() => {
            onChange('send');
            setFormValue('inputs', []);
          }}
        />
      </div>
    </div>
  );
}
