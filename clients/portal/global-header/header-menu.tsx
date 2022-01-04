import React from 'react';

import NavMsgBar from '@portal/modules/msg-center/nav-msg-bar';
import NavTaskBar from '@c/task-lists';
import UserAvatarMenu from '@c/user-avatar-menu';

import ToDocsLink from './to-docs';

export default function HeaderMenu(): JSX.Element {
  return (
    <div className="flex justify-end items-center flex-2">
      <a
        className="btn mr-16"
        target="_blank"
        rel="noreferrer"
        href="/_jump_to_home"
      >
        访问用户端
      </a>
      <hr className='w-1 h-20 bg-gray-200'/>
      <NavTaskBar type='manager' className="mx-16"/>
      <NavMsgBar type='portal' className="mr-16"/>
      <ToDocsLink />
      <div className="header-nav-btn group ml-16">
        <UserAvatarMenu />
      </div>
    </div>
  );
}
