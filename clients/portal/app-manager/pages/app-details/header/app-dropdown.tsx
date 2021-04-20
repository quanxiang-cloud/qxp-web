import React, { useEffect } from 'react';
import cs from 'classnames';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import More from '@c/more';
import Icon from '@c/icon';
import BgIcon from '@appC/bg-icon';
import AppInfoView from '@appC/app-info-view';

type Props = {
  appListStore?: any
  appDetails: AppInfo;
}

function AppDropdown({ appListStore, appDetails }: Props) {
  const history = useHistory();
  const { appId } = useParams<any>();
  const location = useLocation();

  useEffect(() => {
    appListStore.fetchAppList();
  }, []);

  const handleChange = (newAppId: string) => {
    history.replace(location.pathname.replace(appId, newAppId));
  };

  const appListItems: JSX.Element[] = React.useMemo(() => {
    return appListStore.appList.map((appInfo: AppInfo) => (
      <div
        className={cs('app-global-header-drop-item',
          { 'app-global-header-drop-item-active': appDetails.id === appInfo.id })}
        key={appInfo.id}
        onClick={() => handleChange(appInfo.id)}
      >
        <AppInfoView appInfo={appInfo} />
      </div>
    ));
  }, [appListStore.appList]);

  const { appIcon = '', useStatus, appName } = appDetails;
  const { bgColor, iconName } = (appIcon ? JSON.parse(appIcon) : {}) as AppIcon;

  return (
    <More contentClassName='app-global-header-drop-more' items={appListItems}>
      <div className='flex items-center cursor-pointer app-global-header-cur-app'>
        <BgIcon className='mr-8' size={32} themeColor={bgColor} iconName={iconName} />
        <span>{appName}</span>
        <span className='ml-6 text-gray-500 mr-4'>({useStatus > 0 ? '已发布' : '未发布'})</span>
        <Icon name='expand_more' size={20} />
      </div>
    </More>
  );
}

export default inject('appListStore')(observer(AppDropdown));
