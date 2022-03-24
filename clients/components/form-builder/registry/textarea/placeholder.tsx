import React from 'react';
import { Input } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/antd';

const { TextArea } = Input;

function Placeholder({ props }: ISchemaFieldComponentProps): JSX.Element {
  const placeholder = props?.['x-component-props']?.placeholder;
  return <TextArea placeholder={placeholder as string || '请输入'}/>;
}

export default Placeholder;
