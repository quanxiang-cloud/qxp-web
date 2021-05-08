import React, { useState } from 'react';

import MoreMenu from '@c/more-menu';
// import NavMsgBar from '@portal/modules/msg-center/nav-msg-bar';
import Button from '@c/button';
import Icon from '@c/icon';

import ResetPasswordModal from './reset-password-modal';

const imgBgColors: string[] = ['#6366F1', '#F59E0B', '#10B981', '#F97316',
  '#A855F7', '#14B8A6', '#EF4444', '#06B6D4'];
const getImgColor = (text: string, colors = imgBgColors) => {
  const reg = /^[a-zA-Z]*$/;
  let _text = text;
  if (reg.test(text)) {
    _text = text.toUpperCase();
  }
  const num: number = _text.charCodeAt(0) % 8;
  return {
    name: _text,
    color: colors[num],
  };
};

export default function HeaderMenu() {
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState<boolean>(false);
  const username = window.USER.userName;
  let head = '';
  let imgInfo: { name: string, color: string } = { name: '', color: '' };
  if (username) {
    head = username.substring(0, 1);
    imgInfo = getImgColor(head);
  }

  return (
    <div className="flex justify-end items-center flex-2">
      <ResetPasswordModal
        visible={openResetPasswordModal}
        onCancel={() => setOpenResetPasswordModal(false)}
      />
      {/* <NavMsgBar /> */}
      <div className="flex justify-end items-center flex-2">
        <Button>
          进入应用管理
        </Button>
      </div>
      <div className="flex justify-end items-center flex-1">
        <div className="px-8 py-5">
          <Icon
            name="notifications"
            className="group-hover:text-blue-600 header-nav-btn-icon"
            size={20}
          />
        </div>
        <div className="px-8 py-5">
          <Icon
            name="assignment"
            className="group-hover:text-blue-600 header-nav-btn-icon"
            size={20}
          />
        </div>
        <div className="px-8 py-5">
          <Icon
            name="help_outline"
            className="group-hover:text-blue-600 header-nav-btn-icon"
            size={20}
          />
        </div>
        <div className="header-nav-btn group">
          <div className="w-24 h-24 corner-4-0-4-4 text-center text-white text-14 leading-24"
            style={{
              backgroundColor: imgInfo.color,
            }}
          >
            {imgInfo.name}
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
              <Icon name="arrow_drop_down" size={20} />
            </div>
          </MoreMenu>
        </div>
      </div>
    </div>
  );
}
