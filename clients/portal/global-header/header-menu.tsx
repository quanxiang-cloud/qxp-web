import React, { useState } from 'react';

import MoreMenu from '@c/more-menu';
import NavMsgBar from '@portal/modules/msg-center/nav-msg-bar';
import Icon from '@c/icon';

import ResetPasswordModal from './reset-password-modal';
import Avatar from '@c/avatar';

export default function HeaderMenu() {
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState<boolean>(false);

  return (
    <div className="flex justify-end items-center flex-2">
      <ResetPasswordModal
        visible={openResetPasswordModal}
        onCancel={() => setOpenResetPasswordModal(false)}
      />
      <a
        className="btn mr-16"
        target="_blank"
        rel="noreferrer"
        href={`//${window.CONFIG.home_hostname}`}
      >
        进入应用访问
      </a>
      <hr className='w-1 h-20 bg-gray-200'/>
      <NavMsgBar type='portal' className="mx-16"/>
      <a
        href={`//${window.CONFIG.docs_hostname}`}
        target="_blank"
        rel="noreferrer"
        className="cursor-pointer corner-4-0-4-4 text-white hover:bg-gray-100 hover:text-gray-600"
      >
        <Icon name="help_doc" size={21} className='app-icon-color-inherit m-6'/>
      </a>
      <div className="header-nav-btn group ml-16">
        <MoreMenu
          menus={[
            { key: 'resetPassword', label: '重置密码' },
            { key: 'logout', label: '登出' },
          ]}
          onMenuClick={(menuKey) => {
            if (menuKey === 'logout') {
              window.location.href = '/logout';
              return;
            }

            setOpenResetPasswordModal(true);
          }}
        >
          <div
            className="cursor-pointer flex items-center h-36
            hover:blue-100 transition group-hover:text-blue-600"
          >
            <Avatar
              username={window.USER.userName}
            />
            <Icon name="arrow_drop_down" size={20} />
          </div>
        </MoreMenu>
      </div>
    </div>
  );
}
