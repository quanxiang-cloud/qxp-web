import React from 'react';
import { Checkbox } from 'antd';
import { ISchemaFieldContextProps } from '@formily/antd';

const CheckboxGroup = Checkbox.Group;

function Placeholder({ props }: ISchemaFieldContextProps): JSX.Element {
  return (
    <CheckboxGroup options={props.enum} />
  );
}

export default Placeholder;
