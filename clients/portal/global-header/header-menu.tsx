import React from 'react';

import NavMsgBar from '@portal/modules/msg-center/nav-msg-bar';
import Icon from '@c/icon';
import UserAvatarMenu from '@c/user-avatar-menu';

export default function HeaderMenu(): JSX.Element {
  return (
    <div className="flex justify-end items-center flex-2">
      <NavMsgBar className="mr-8" />
      <a
        href={`//${window.CONFIG.docs_hostname}`}
        target="_blank"
        rel="noreferrer"
        className="app-nav-button corner-8-8-8-2 mr-8"
      >
        <Icon size={20} className='mr-4 app-icon-color-inherit' name="book" />
        帮助文档
      </a>
      <a
        className="btn mr-8"
        target="_blank"
        rel="noreferrer"
        href={`//${window.CONFIG.home_hostname}`}
      >
        访问用户端
      </a>
      <div className="header-nav-btn group">
        <UserAvatarMenu />
      </div>
    </div>
  );
}
