import React from 'react';

import Icon from '@c/icon';

import './index.scss';

function Placeholder(): JSX.Element {
  return (
    <div className='placeholder-date-picker'>
      <Icon name='calendar_today' className='date-icon' />
      <span className='ml-10 text-gray-300'>请选择日期</span>
    </div>
  );
}

export default Placeholder;
