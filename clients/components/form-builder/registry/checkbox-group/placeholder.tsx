import React from 'react';
import { Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;

function Placeholder(): JSX.Element {
  return (
    <CheckboxGroup options={['选项一', '选项二', '选项三']} />
  );
}

export default Placeholder;
