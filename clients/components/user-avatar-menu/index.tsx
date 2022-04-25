import React, { ForwardedRef, useState } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';

import Avatar from '@c/avatar';
import Icon from '@c/icon';
import usePopper from '@c/popper2';
import ResetPasswordModal from '@portal/global-header/reset-password-modal';

import RoleList from './role-list';

import './index.scss';

interface Props extends React.HTMLProps<HTMLDivElement> {
  'data-in-canvas'?: boolean;
  className?: string;
}

function UserAvatarMenu(
  { className, ...rest }: Props,
  ref?: ForwardedRef<HTMLDivElement>,
): JSX.Element {
  const [expand, setExpand] = useState<boolean>(false);
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState<boolean>(false);
  const { close, handleMouseEnter, handleMouseLeave, referenceRef, Popper } = usePopper<HTMLDivElement>();
  const [popperShow, setPopperShow] = useState(false);
  const dataInCanvas = !!rest['data-in-canvas'];

  function handleEditPasswordClick(): void {
    setOpenResetPasswordModal(true);
    close();
  }

  function handleLogOutClick(): void {
    localStorage.removeItem('HOME_APP_PAGE_NAV_STATUS_v1');
    window.location.href = '/logout';
  }

  return (
    <div ref={ref} {...rest}>
      <div
        ref={referenceRef}
        onMouseEnter={handleMouseEnter()}
        onMouseLeave={handleMouseLeave()}
        className={cs('cursor-pointer flex items-center h-36 transition pl-6', className)}
      >
        <Avatar username={window.USER?.name || ''} />
        <Icon name={popperShow ? 'arrow_drop_up' : 'arrow_drop_down'} className='text-current' size={20} />
      </div>
      {!dataInCanvas && (
        <Popper
          className='corner-12-2-12-12'
          placement='bottom-start'
          onVisibleChange={(visible) => setPopperShow(visible)}
        >
          <div className='user-avatar-menu corner-12-2-12-12'>
            <div className='user-avatar-menu-bg flex py-20'>
              <div className='pl-20'>
                <Avatar
                  username={window.USER?.name || ''}
                  size={48}
                />
              </div>
              <div className='flex flex-col ml-8'>
                <span className='text-20 font-medium text-gray-900'>
                  {window.USER.name}
                </span>
                <span className='pr-20 text-12 text-gray-600'>
                  {window.SIDE === 'portal' ? `角色: ${window.USER_ADMIN_ROLES[0]?.name || '-'}` : (
                    window.USER.email || window.USER.phone
                  )}
                </span>
              </div>
            </div>
            <div className='text-gray-600 flex flex-col mx-16 cursor-pointer'>
              <div
                className='user-avatar-menu-password'
                onClick={handleEditPasswordClick}
              >
                <Icon name='password' />
                <span className='ml-4'>修改密码</span>
              </div>
              {!!window.APP_ID && (
                <div className='border-b-1 py-10'>
                  <div
                    className="flex justify-between items-center"
                    onClick={() => setExpand(!expand)}
                  >
                    <span><Icon className='mr-4' name='group' />切换角色</span>
                    <Icon className="expand" name={`expand_${expand ? 'more' : 'less'}`} />
                  </div>
                  <RoleList visible={expand} />
                </div>
              )}
              <div className='user-avatar-menu-logout' onClick={handleLogOutClick}>
                <Icon name='logout' />
                <span className='ml-4'>退出登录</span>
              </div>
            </div>
          </div>
        </Popper>
      )}
      {openResetPasswordModal && (
        <ResetPasswordModal
          visible={openResetPasswordModal}
          onCancel={() => setOpenResetPasswordModal(false)}
        />
      )}
    </div>
  );
}

export default observer(React.forwardRef<HTMLDivElement, Props>(UserAvatarMenu));
