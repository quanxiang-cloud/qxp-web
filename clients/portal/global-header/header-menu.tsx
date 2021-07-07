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
