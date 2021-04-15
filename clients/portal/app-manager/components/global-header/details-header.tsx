import React from 'react';
import { useHistory } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import Icon from '@c/icon';
import PopConfirm from '@c/pop-confirm';
import Button from '@appC/button';

import NavButton from '../nav-button';
import AppDropdown from './app-dropdown';

interface DetailsHeaderProps {
  appDetailsStore?: any
}

function DetailsHeader({ appDetailsStore }: DetailsHeaderProps) {
  const history = useHistory();

  const { updateAppStatus } = appDetailsStore;

  const goAppSetting = () => {
    history.push(`/apps/${appDetailsStore.appDetails.id}/setting/info`);
  };

  const statusTipsContent = (isPublish: boolean) => {
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

  return (
    <div className="app-global-header app-details-header">
      <div className='flex items-center'>
        <NavButton {...{ name: '应用管理', icon: 'apps', inside: true, url: '/apps/list' }} />
        <span className='mr-16 ml-8'>/</span>
        <AppDropdown appDetails={appDetailsStore.appDetails} />
      </div>
      <div className='flex'>
        {appDetailsStore.appDetails.useStatus > 0 ? (
          <PopConfirm content={statusTipsContent(false)} onOk={updateAppStatus}>
            <Button icon='toggle_on' isPrimary>
              下线应用
            </Button>
          </PopConfirm>
        ) : (
          <PopConfirm content={statusTipsContent(true)} onOk={updateAppStatus}>
            <Button icon='toggle_on' isPrimary>
              发布应用
            </Button>
          </PopConfirm>
        )}
        <hr className='app-global-header-hr' />
        <Button className='mr-16' icon='login'>
          进入应用访问
        </Button>
        <Button
          onClick={goAppSetting}
          icon='settings'
        >
          应用管理
        </Button>
        <hr className='app-global-header-hr' />
        <NavButton {...{ name: '帮助文档', icon: 'book', url: '' }} />
      </div>
    </div>
  );
}

export default inject('appDetailsStore')(observer(DetailsHeader));
