import React, { useEffect } from 'react';
import { inject } from 'mobx-react';

import { More } from '@c/more';

import BgIcon from '../bg-icon';
import AppInfoView from '../app-info-view';

type Props = {
  appDetailsStore: any
  appListStore: any
}

function AppDropdown({ appDetailsStore, appListStore }: Props) {
  useEffect(() => {
    appListStore.fetchAppList();
  }, []);

  const handleChange = (appId: string) => {
    console.log('appId: ', appId);
  };

  const appListItems: JSX.Element[] = React.useMemo(() => {
    return appListStore.appList.map((appInfo: AppInfo) => (
      <div
        className='app-global-header-drop-item'
        key={appInfo.id}
        onClick={() => handleChange(appInfo.id)}
      >
        <AppInfoView appInfo={appInfo} />
      </div>
    ));
  }, [appListStore.appList]);

  const { appIcon = '', useStatus, appName } = appDetailsStore.appDetails;
  const { bgColor, iconName } = appIcon ? JSON.parse(appIcon) : {};

  return (
    <More contentClassName='app-global-header-drop-more' items={appListItems}>
      <div className='flex items-center cursor-pointer app-global-header-cur-app'>
        <BgIcon className='mr-8' size={32} bgColor={bgColor} iconName={iconName} iconSize={20} />
        <span>{appName}</span>
        <span className='ml-6 text-gray-500'>({useStatus > 0 ? '已发布' : '未发布'})</span>
      </div>
    </More>
  );
}

export default inject('appDetailsStore')(inject('appListStore')(AppDropdown));
