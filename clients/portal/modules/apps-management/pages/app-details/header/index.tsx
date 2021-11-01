import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import PopConfirm from '@c/pop-confirm';
import Button from '@c/button';

import AppsSwitcher from '@c/apps-switcher';
import MoreMenu from '@c/more-menu';
import Avatar from '@c/avatar';
import ResetPasswordModal from '@portal/global-header/reset-password-modal';
import NavMsgBar from '@portal/modules/msg-center/nav-msg-bar';

import appDetailsStore from '../store';
import './index.scss';

function DetailsHeader(): JSX.Element {
  const history = useHistory();
  const { appID } = useParams<{appID: string}>();
  const { updateAppStatus, appDetails, apps } = appDetailsStore;
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState<boolean>(false);

  useEffect(() => {
    appDetailsStore.fetchAppList();
  }, []);

  const handleChange = (newAppId: string): void => {
    history.replace(location.pathname.replace(appID, newAppId));
  };

  const statusTipsContent = (isPublish: boolean): JSX.Element => {
    if (isPublish) {
      return (
        <div>
          <p className='app-global-header-status-tips-title'>确定要发布该应用吗？</p>
          <p>应用发布后，即可在访问端使用，请确保应用下的功能均经过测试且切实有效，避免因功能设置问题给他人造成不必要的影响。</p>
        </div>
      );
    }

    return (
      <div>
        <p className='app-global-header-status-tips-title'>
          <Icon className='mr-8 app-icon-color-inherit' name='error_outline' size={20} />
          确定要下线该应用吗？
        </p>
        <p>下线后此应用访问端不可使用，如需再次使用请发布应用！</p>
      </div>
    );
  };

  const isPublish = appDetails.useStatus > 0;

  return (
    <div className="app-global-header app-details-header">
      <div className='flex items-center'>
        <div
          onClick={() => history.push('/apps')}
          className='app-header-icon text-gray-400 corner-8-8-8-2 flex items-center justify-center'
        >
          <Icon size={20} className='mr-4' name='home_qxp'/>
        </div>
        <span className='ml-8 mr-16'>/</span>
        <AppsSwitcher apps={apps} currentAppID={appID} onChange={handleChange} />
      </div>
      <div className='flex items-center'>
        <PopConfirm content={statusTipsContent(!isPublish)} onOk={updateAppStatus}>
          <Button modifier='primary'>
            {isPublish ? '下线应用' : '发布应用'}
          </Button>
        </PopConfirm>
        <hr className='app-global-header-hr mx-16' />
        <a
          className="btn mr-16"
          target="_blank"
          rel="noreferrer"
          href={`/_jump_to_home?to=/apps/${appID}`}
        >
          访问应用端
        </a>
        <hr className='app-global-header-hr' />
        <NavMsgBar type='portal' className='mx-16'/>
        <a
          href={`//${window.CONFIG.docs_hostname}`}
          target="_blank"
          rel="noreferrer"
          className="app-header-icon corner-4-0-4-4 text-white"
        >
          <Icon name="help_doc" size={21} style={{ fill: 'var(--gray-400)' }} className='m-6'/>
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
              <Avatar username={window.USER.userName}/>
              <Icon name="arrow_drop_down" size={20} />
            </div>
          </MoreMenu>
        </div>
      </div>
      <ResetPasswordModal
        visible={openResetPasswordModal}
        onCancel={() => setOpenResetPasswordModal(false)}
      />
    </div>

  );
}

export default observer(DetailsHeader);
