import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import PopConfirm from '@c/pop-confirm';
import Button from '@c/button';
import NavButton from '@portal/modules/apps-management/components/nav-button';

import AppDropdown from '@c/app-dropdown';
import appDetailsStore from '../store';
import appListStore from '../../entry/my-app/store';
import './index.scss';

function DetailsHeader() {
  const history = useHistory();
  const { appId } = useParams<{appId: string}>();
  const { updateAppStatus, appDetails } = appDetailsStore;

  useEffect(() => {
    appListStore.fetchAppList();
  }, []);

  const goAppSetting = () => {
    history.push(`/apps/details/${appDetails.id}/setting/info`);
  };

  const handleChange = (newAppId: string) => {
    history.replace(location.pathname.replace(appId, newAppId));
  };

  const goAppVisit = () => {
    window.location.href = `//${window.CONFIG.home_hostname}/apps/` + appId;
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

  const isPublish = appDetails.useStatus > 0;

  return (
    <div className="app-global-header app-details-header">
      <div className='flex items-center'>
        <NavButton
          {...{
            name: '应用管理',
            icon: 'dashboard_customize',
            inside: true,
            url: '/apps',
          }}
        />
        <span className='mr-16 ml-8'>/</span>
        <AppDropdown appList={appListStore.allAppList} curApp={appId} onChange={handleChange} />
      </div>
      <div className='flex'>
        {isPublish ? (
          <PopConfirm content={statusTipsContent(false)} onOk={updateAppStatus}>
            <Button iconName='toggle_on' modifier='primary'>
              下线应用
            </Button>
          </PopConfirm>
        ) : (
          <PopConfirm content={statusTipsContent(true)} onOk={updateAppStatus}>
            <Button iconName='toggle_on' modifier='primary'>
              发布应用
            </Button>
          </PopConfirm>
        )}
        <hr className='app-global-header-hr' />
        <Button forbidden={!isPublish} onClick={goAppVisit} className='mr-16' iconName='login'>
          进入应用访问
        </Button>
        <Button
          onClick={goAppSetting}
          iconName='settings'
        >
          应用管理
        </Button>
        <hr className='app-global-header-hr' />
        <NavButton {...{ name: '帮助文档', icon: 'book', url: '' }} />
      </div>
    </div>
  );
}

export default observer(DetailsHeader);
