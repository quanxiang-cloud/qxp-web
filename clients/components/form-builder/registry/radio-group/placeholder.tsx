import React from 'react';
import { Radio } from 'antd';

function Placeholder(): JSX.Element {
  return (
    <Radio.Group>
      <Radio value={1}>选项一</Radio>
      <Radio value={2}>选项二</Radio>
      <Radio value={3}>选项三</Radio>
    </Radio.Group>
  );
}

export default Placeholder;
