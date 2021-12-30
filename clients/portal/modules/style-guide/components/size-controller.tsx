import React from 'react';
import { InputNumber } from 'antd';

type Props = {
  onChange: (v: number) => void;
  value?: number;
}

export default function SizeController({
  onChange,
  value,
}: Props): JSX.Element {
  return (
    <div>
      <InputNumber value={value} onChange={onChange} />
      <span className='ml-5'>px</span>
    </div>
  );
}
