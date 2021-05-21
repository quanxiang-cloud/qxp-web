import React, { useRef, useState } from 'react';
import cs from 'classnames';

import Popper from '@c/popper';
import Icon from '@c/icon';
import AppInfoView from '@portal/modules/apps-management/components/app-info-view';
import AppIcon from '@c/app-icon';

import './index.scss';

type Props = {
  apps: AppInfo[];
  currentAppID: string;
  onChange: (appID: string) => void;
  hiddenStatus?: boolean
}

const modifiers = [
  {
    name: 'offset',
    options: {
      offset: [0, 4],
    },
  },
];

function AppsSwitcher({ apps, onChange, currentAppID, hiddenStatus }: Props) {
  const currentApp = apps.find(({ id }) => id === currentAppID);
  const [isVisible, setIsVisible] = useState(false);
  const popperRef = useRef<any>();
  const reference = useRef<any>();

  const optionsVisibilityChange = (visible: boolean) => {
    setIsVisible(visible);
  };

  const handleClick = (appID:string) =>{
    onChange(appID);
    popperRef.current?.close();
  };

  const appListItems: JSX.Element[] = React.useMemo(() => {
    return apps.map((appInfo: AppInfo) => (
      <div
        key={appInfo.id}
        onClick={() => handleClick(appInfo.id)}
        className={cs('app-dropdown-drop-item',
          { 'app-dropdown-drop-item-active': currentApp?.id === appInfo.id })}
      >
        <AppInfoView appInfo={appInfo} />
      </div>
    ));
  }, [apps, currentApp?.id]);

  if (!currentApp) {
    return null;
  }

  const { appIcon = '', useStatus, appName } = currentApp;
  const { bgColor, iconName } = (appIcon ? JSON.parse(appIcon) : {}) as AppIconInfo;

  return (
    <>
      <div ref={reference} className='flex items-center cursor-pointer app-dropdown-cur-app'>
        <AppIcon className='mr-8' size={32} themeColor={bgColor} iconName={iconName} />
        <span className="truncate">{appName}</span>
        {!hiddenStatus && (
          <span className='ml-6 text-gray-500 mr-4'>({useStatus > 0 ? '已发布' : '未发布'})</span>
        )}
        <Icon style={{ minWidth: '20px' }} size={20} name={isVisible ? 'expand_less' : 'expand_more'} />
      </div>
      <Popper
        ref={popperRef}
        reference={reference}
        placement="bottom-start"
        modifiers={modifiers}
        onVisibilityChange={optionsVisibilityChange}
      >
        <div className='app-dropdown-drop-more beauty-scroll'>
          {appListItems}
        </div>
      </Popper>
    </>
  );
}

export default AppsSwitcher;
