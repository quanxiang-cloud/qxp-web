import React, { useState } from 'react';

import MoreMenu from '@c/more-menu';
import NavMsgBar from '@portal/modules/msg-center/nav-msg-bar';
import Icon from '@c/icon';

import ResetPasswordModal from './reset-password-modal';

export default function HeaderMenu() {
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState<boolean>(false);

  return (
    <div className="flex justify-end items-center flex-2">
      <ResetPasswordModal
        visible={openResetPasswordModal}
        onCancel={() => setOpenResetPasswordModal(false)}
      />
      <NavMsgBar />
      <div className="mr-56 header-nav-btn group">
        <div className="header-nav-btn-icon-wrapper">
          <Icon
            name="book"
            className="group-hover:text-blue-600 header-nav-btn-icon"
            size={20}
          />
        </div>
        <span className="header-nav-btn-text group-hover:text-blue-600">
              帮助文档
        </span>
      </div>
      <div className="header-nav-btn group">
        <div className="header-nav-btn-icon-wrapper">
          <Icon
            name="settings"
            className="group-hover:text-blue-600 header-nav-btn-icon"
            size={20}
          />
        </div>
        <MoreMenu
          menus={[
            { key: 'resetPassword', label: '重置密码' },
            { key: 'logout', label: '登出' },
          ]}
          onChange={(menuKey) => {
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
            个人中心
            <Icon name="caret-down" style={{ marginLeft: '8px' }} />
          </div>
        </MoreMenu>
      </div>
    </div>
  );
}
