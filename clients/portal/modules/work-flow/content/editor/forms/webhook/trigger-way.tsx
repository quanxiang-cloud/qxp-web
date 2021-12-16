import React from 'react';

import Checkbox from '@c/checkbox';

interface Props {
  value: 'request' | 'send';
  onChange: (v: 'request' | 'send') => void;
}

export default function TriggerWay({ value, onChange }: Props): JSX.Element {
  return (
    <div>
      <p className="mt-16 mb-8">触发方式</p>
      <div className="flex items-center justify-between">
        <Checkbox
          label="获取数据"
          checked={value === 'request'}
          value="request"
          onChange={() => onChange('request')}
        />
        <Checkbox
          label="推送数据"
          checked={value === 'send'}
          value="send"
          onChange={() => onChange('send')}
        />
      </div>
    </div>
  );
}
