import React, { useEffect, useRef, useState } from 'react';
import cs from 'classnames';

import ResetPasswordModal from '@portal/global-header/reset-password-modal';
import Avatar from '@c/avatar';
import Icon from '@c/icon';
import Popper from '@c/popper';

import './index.scss';

interface Props {
  className?: string;
}

export default function UserProfile({ className }: Props): JSX.Element {
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState<boolean>(false);
  const [side, setSide] = useState('');
  const reference = useRef<HTMLDivElement>(null);
  const popperRef = useRef<Popper>(null);
  const [show, setShow] = useState(popperRef.current?.state.popVisible);

  useEffect(() => {
    setSide(window.SIDE);
  }, []);

  const handleEditPasswordClick = (): void => {
    setOpenResetPasswordModal(true);
    popperRef.current?.close();
  };

  const handleLogOutClick = (): void => {
    window.location.href = '/logout';
  };

  return (
    <div>
      <ResetPasswordModal
        visible={openResetPasswordModal}
        onCancel={() => setOpenResetPasswordModal(false)}
      />
      <div
        className={cs('cursor-pointer flex items-center h-36 transition', className)}
        ref={reference}
      >
        <Avatar
          username={window.USER?.userName || ''}
        />
        <Icon name={show ? 'arrow_drop_up' : 'arrow_drop_down'} className='text-current' size={20} />
      </div>
      <Popper
        reference={reference}
        ref={popperRef}
        className='avatar-popper'
        onVisibilityChange={(visible)=> setShow(visible)}
        trigger='hover'
      >
        <div className='avatar'>
          <div className='avatar-bg flex py-20'>
            <div className='pl-20'>
              <Avatar
                username={window.USER?.userName || ''}
                size={48}
              />
            </div>
            <div className='flex flex-col ml-8'>
              <span className='text-20 font-medium text-gray-900'>
                {window.USER.userName}
              </span>
              <span className='text-12 text-gray-600'>
                {side === 'portal' ?
                  `角色: ${window.USER_ADMIN_ROLES[0].name}` : (window.USER.email || window.USER.phone)}
              </span>
            </div>
          </div>
          <div className='text-gray-600 flex flex-col mx-16 cursor-pointer'>
            <div
              className='avatar-border flex py-15 items-center'
              onClick={handleEditPasswordClick}
            >
              <Icon name='password' />
              <span className='ml-4'>修改密码</span>
            </div>
            <div className='flex py-15 items-center' onClick={handleLogOutClick}>
              <Icon name='logout' />
              <span className='ml-4'>退出登录</span>
            </div>
          </div>
        </div>
      </Popper>
    </div>
  );
}
