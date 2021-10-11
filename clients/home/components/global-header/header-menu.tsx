import React from 'react';

import NavMsgBar from '@portal/modules/msg-center/nav-msg-bar';
import UserProfile from '@c/user-profile';

export default function HeaderMenu(): JSX.Element {
  return (
    <div className="flex-2 flex justify-end items-center">
      <NavMsgBar className="mr-8" />
      {/* <Button className="mr-32">
          进入应用管理
      </Button>
      <div className="nav-icon">
        <Icon
          className='icon-hover'
          name="notifications"
          size={20}
        />
      </div>
      <div className="nav-icon">
        <Icon
          className='icon-hover'
          name="assignment"
          size={20}
        />
      </div>
      <div className="nav-icon">
        <Icon
          className='icon-hover'
          name="help_outline"
          size={20}
        />
      </div> */}
      <div className="header-nav-btn group">
        <UserProfile />
      </div>
    </div>
  );
}
