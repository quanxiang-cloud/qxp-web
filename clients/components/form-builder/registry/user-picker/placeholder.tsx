import React from 'react';

import Icon from '@c/icon';

import './index.scss';

function Placeholder(): JSX.Element {
  return (
    <div className='placeholder-user-picker'>
      <Icon name='expand_more' className='arrow' />
    </div>
  );
}

export default Placeholder;
