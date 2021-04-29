import React from 'react';

import AppIcon from '@c/app-icon';

import './index.scss';

type Props = {
  appInfo: AppInfo;
  className?: string;
  onClick?: () => void;
}

function AppInfoView({ appInfo, onClick, className = '' }: Props) {
  const appIcon: AppIconInfo = JSON.parse(appInfo.appIcon);

  return (
    <div onClick={onClick} className={`${className} flex-1 flex overflow-hidden items-center`}>
      <AppIcon
        className='mr-8'
        themeColor={appIcon.bgColor}
        iconName={appIcon.iconName}
        size={44}
      />
      <div className='flex-1 app-info-view-text overflow-hidden'>
        <p className='text-overflow-1 app-info-view-name'>{appInfo.appName}</p>
        {'useStatus' in appInfo && (
          <p className='app-info-view-status'>{appInfo.useStatus > 0 ? '已发布' : '未发布'}</p>
        )}
      </div>
    </div>
  );
}

export default AppInfoView;
