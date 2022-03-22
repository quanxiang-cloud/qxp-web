import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';

import Icon from '@c/icon';

import './index.scss';

function Placeholder({ props }: ISchemaFieldComponentProps): JSX.Element {
  const placeholder = props?.['x-component-props']?.placeholder;
  return (
    <div className='placeholder-date-picker'>
      <Icon name='calendar_today' className='date-icon' />
      <span className='ml-10 text-gray-300'>{placeholder || '请输入'}</span>
    </div>
  );
}

export default Placeholder;
