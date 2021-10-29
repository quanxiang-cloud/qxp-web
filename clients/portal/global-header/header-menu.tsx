import React from 'react';

import FeedbackBtn from '@c/feedback';
import NavMsgBar from '@portal/modules/msg-center/nav-msg-bar';
import Icon from '@c/icon';
import UserAvatarMenu from '@c/user-avatar-menu';

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
      <NavMsgBar type='portal' className="mx-16"/>
      <a
        href={`//${window.CONFIG.docs_hostname}`}
        target="_blank"
        rel="noreferrer"
        className="cursor-pointer corner-4-0-4-4 text-white hover:bg-gray-100 hover:text-gray-600 mr-16"
      >
        <Icon name="help_doc" size={21} style={{ fill: 'var(--gray-400)' }} className='text-current m-6'/>
      </a>
      <FeedbackBtn />
      <div className="header-nav-btn group ml-16">
        <UserAvatarMenu />
      </div>
    </div>
  );
}
