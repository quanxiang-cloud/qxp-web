import React from 'react';
import { Radio } from 'antd';
import { ISchemaFieldContextProps } from '@formily/antd';

function Placeholder({ props }: ISchemaFieldContextProps): JSX.Element {
  return (
    <Radio.Group>
      {props.enum?.map((label: string, index: number) => {
        return <Radio key={index} value={index}>{label}</Radio>;
      })}
    </Radio.Group>
  );
}

export default Placeholder;
