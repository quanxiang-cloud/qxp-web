import React from 'react';

import Icon from '@c/icon';

type Props = {
  unreadNum: number;
}

function NotifyIcon({ unreadNum }:Props) {
  return (
    <div className='relative flex items-center'>
      <Icon
        size={20}
        name='notifications_active'
      />
      <span className='app-unread-number icon-border-radius-8'>{unreadNum}</span>
    </div>
  );
}

export default NotifyIcon;
