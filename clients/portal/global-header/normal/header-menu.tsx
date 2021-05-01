import React, { useState } from 'react';

import MoreMenu from '@c/more-menu';
import Icon from '@c/icon';

import ResetPasswordModal from './reset-password-modal';
import NavButton from '../nav-button';

export default function HeaderMenu() {
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState<boolean>(false);

  return (
    <div className="flex justify-end items-center flex-2">
      <ResetPasswordModal
        visible={openResetPasswordModal}
        onCancel={() => setOpenResetPasswordModal(false)}
      />
      <NavButton
        className="mr-56"
        iconName="book"
        text="帮助文档"
      />
      <NavButton
        cache
        render={() => (
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
        )}
      />
    </div>
  );
}
