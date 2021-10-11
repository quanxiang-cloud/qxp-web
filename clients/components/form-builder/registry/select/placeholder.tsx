import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

function Placeholder(): JSX.Element {
  return (
    <Select placeholder='请选择选项' style={{ width: '100%' }}>
      {['选项一', '选项二', '选项三'].map((item) =>
        <Option key={item} value={item}>{item}</Option>)}
    </Select>
  );
}

export default Placeholder;
