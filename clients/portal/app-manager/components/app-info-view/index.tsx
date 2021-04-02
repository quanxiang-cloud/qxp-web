import React from 'react';

import BgIcon from '../bg-icon';

import './index.scss';

type Props = {
  appInfo: AppInfo
  className?: string
}

function AppInfoView({ appInfo, className = '' }: Props) {
  const appIcon: AppIcon = JSON.parse(appInfo.appIcon);

  return (
    <div className={`${className} flex-1 flex overflow-hidden`}>
      <BgIcon className='mr-8' bgColor={appIcon.bgColor} iconName={appIcon.iconName} />
      <div className='flex-1 app-info-view-text overflow-hidden'>
        <p className='text-overflow-1'>{appInfo.appName}</p>
        <p>{appInfo.useStatus > 0 ? '已发布' : '未发布'}</p>
      </div>
    </div>
  );
}

export default AppInfoView;
