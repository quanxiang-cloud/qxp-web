import React from 'react';

import Icon from '@c/icon';

function Placeholder(): JSX.Element {
  return (
    <div className='placeholder-multiple-select'>
      <span className='ml-10 text-gray-300'>请选择选项</span>
      <Icon name='expand_more' className='arrow' />
    </div>
  );
}

export default Placeholder;
