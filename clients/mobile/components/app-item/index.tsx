import React from 'react';
import { parseJSON } from '@lib/utils';
import AppIcon from '@c/app-icon';
import './index.scss';

type Props = {
  appInfo: AppInfo;
  className?: string;
  onClick?: () => void;
}

export default function AppItem({ appInfo, className, onClick }: Props): JSX.Element {
  const appIcon = parseJSON<AppIconInfo>(appInfo.appIcon, { bgColor: 'amber', iconName: '' });

  return (
    <div onClick={onClick}
      className={`${className} flex-col flex overflow-hidden items-center padding-8 pointer-8`}
    >
      <AppIcon
        themeColor={appIcon.bgColor}
        iconName={appIcon.iconName}
        size={44}
      />
      <p className='app-name body2 text-secondary text-center mt-4'>{appInfo.appName}</p>
    </div>
  );
}

