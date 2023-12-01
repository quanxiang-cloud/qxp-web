import React from 'react';
import { Input } from 'antd';

function CustomInput(props: any): JSX.Element {
  console.log('CustomInput', props);
  function handleChange(e: any): void {
    props?.onChange?.(e?.target?.value);
  }

  function handleBlur(e: any): void {
    props?.onChange?.(e?.target?.value.trim());
  }

  return <Input {...props} onChange={handleChange} onBlur={handleBlur}/>;
}

export default CustomInput;
