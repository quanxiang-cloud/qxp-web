import React, { useRef } from 'react';

import AppIcon from '@c/app-icon';
import { parseJSON } from '@lib/utils';

import './index.scss';

type Props = {
  apps: AppInfo[];
  currentAppID: string;
  onChange: (appID: string) => void;
  hiddenStatus?: boolean
}

function AppsSwitcher({ apps, currentAppID, hiddenStatus }: Props): JSX.Element | null {
  const currentApp = apps.find(({ id }) => id === currentAppID);
  const reference = useRef<any>();

  if (!currentApp) {
    return null;
  }

  const { appIcon = '{}', useStatus, appName } = currentApp;
  const { bgColor, iconName } = parseJSON<AppIconInfo>(appIcon, { bgColor: 'amber', iconName: '' });

  return (
    <>
      <div ref={reference} className='flex items-center cursor-pointer app-dropdown-cur-app'>
        <AppIcon className='mr-8' size={20} themeColor={bgColor} iconName={iconName} />
        <span className="truncate">{appName}</span>
        {!hiddenStatus && (
          <span className='ml-6 text-gray-400 mr-4'>({useStatus > 0 ? '已发布' : '未发布'})</span>
        )}
      </div>
    </>
  );
}

export default AppsSwitcher;
