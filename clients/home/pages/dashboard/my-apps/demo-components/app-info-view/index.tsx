import React from 'react';
import cs from 'classnames';

import AppIcon from '@c/app-icon';
import { parseJSON } from '@lib/utils';

import './index.scss';

type Props = {
  appInfo: AppInfo;
  className?: string;
}

function AppInfoView({ appInfo, className = '' }: Props): JSX.Element {
  const appIcon = parseJSON<AppIconInfo>(appInfo.appIcon, { bgColor: 'amber', iconName: '' });

  return (
    <a
      href={appInfo.accessURL}
      onClick={(e) => {
        if (!appInfo.accessURL) e.preventDefault();
      }}
      className={cs('rounded-12 bg-white flex-1 flex overflow-hidden items-center', {
        'opacity-70': !appInfo.accessURL,
      }, className)}
    >
      <AppIcon
        className='mr-8'
        themeColor={appIcon.bgColor}
        iconName={appIcon.iconName}
        size={44}
      />
      <div className='flex-1 app-info-view-text overflow-hidden'>
        <p className='truncate app-info-view-name text-gray-900'>{appInfo.appName}</p>
        {
          !appInfo.accessURL && (<p className='app-info-view-status'>该应用未配置主页，无法访问</p>)
        }
      </div>
    </a>
  );
}

export default AppInfoView;
