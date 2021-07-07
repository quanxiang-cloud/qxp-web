import React, { useState } from 'react';

import MoreMenu from '@c/more-menu';
import NavMsgBar from '@portal/modules/msg-center/nav-msg-bar';
// import Button from '@c/button';
import Icon from '@c/icon';

import ResetPasswordModal from './reset-password-modal';
import Avatar from '@c/avatar';

export default function HeaderMenu() {
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState<boolean>(false);

  return (
    <div className="flex-2 flex justify-end items-center">
      <ResetPasswordModal
        visible={openResetPasswordModal}
        onCancel={() => setOpenResetPasswordModal(false)}
      />
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
