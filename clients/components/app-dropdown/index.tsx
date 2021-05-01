import React from 'react';
import cs from 'classnames';

import More from '@c/more';
import Icon from '@c/icon';
import AppInfoView from '@appC/app-info-view';
import AppIcon from '@c/app-icon';

import './index.scss';

type Props = {
  appList: AppInfo[];
  curApp: string;
  onChange: (appID: string) => void;
  hiddenStatus?: boolean
}

function AppDropdown({ appList, onChange, curApp, hiddenStatus }: Props) {
  const appDetails: any = appList.find(({ id }) => id === curApp);

  const appListItems: JSX.Element[] = React.useMemo(() => {
    return appList.map((appInfo: AppInfo) => (
      <div
        className={cs('app-dropdown-drop-item',
          { 'app-dropdown-drop-item-active': appDetails.id === appInfo.id })}
        key={appInfo.id}
        onClick={() => onChange(appInfo.id)}
      >
        <AppInfoView appInfo={appInfo} />
      </div>
    ));
  }, [appList, appDetails?.id]);

  if (!appDetails) {
    return null;
  }

  const { appIcon = '', useStatus, appName } = appDetails;
  const { bgColor, iconName } = (appIcon ? JSON.parse(appIcon) : {}) as AppIconInfo;

  return (
    <More className='aa' contentClassName='app-dropdown-drop-more' items={appListItems}>
      <div className='flex items-center cursor-pointer app-dropdown-cur-app'>
        <AppIcon className='mr-8' size={32} themeColor={bgColor} iconName={iconName} />
        <span className='text-overflow-1'>{appName}</span>
        {!hiddenStatus && (
          <span className='ml-6 text-gray-500 mr-4'>({useStatus > 0 ? '已发布' : '未发布'})</span>
        )}
        <Icon style={{ minWidth: '20px' }} name='expand_more' size={20} />
      </div>
    </More>
  );
}

export default AppDropdown;
