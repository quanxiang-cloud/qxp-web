import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';

function Placeholder({ props }: ISchemaFieldComponentProps): JSX.Element {
  const placeholder = props?.['x-component-props']?.placeholder;
  return (
    <div className='w-full h-32'>
      <div className='ant-input h-full flex justify-between py-2 items-center'>
        <span className='cursor-pointer text-blue-500'>
          {placeholder || '选择关联数据'}
        </span>
      </div>
    </div>
  );
}

export default Placeholder;
