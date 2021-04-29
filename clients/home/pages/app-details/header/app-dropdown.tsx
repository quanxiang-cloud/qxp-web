import React, { useEffect } from 'react';
import cs from 'classnames';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { observer } from 'mobx-react';

import More from '@c/more';
import Icon from '@c/icon';

import AppInfoView from '@appC/app-info-view';
import AppIcon from '@c/app-icon';

import store from '../../store';

function AppDropdown() {
  const history = useHistory();
  const { appID } = useParams<any>();
  const location = useLocation();
  const { appList } = store;

  useEffect(() => {
    store.fetchAppList();
  }, []);

  const appDetails: any = appList.find(({ id }) => id === appID);

  const appListItems: JSX.Element[] = React.useMemo(() => {
    return appList.map((appInfo: AppInfo) => (
      <div
        className={cs('app-global-header-drop-item',
          { 'app-global-header-drop-item-active': (appDetails as any).id === appInfo.id })}
        key={appInfo.id}
        onClick={() => handleChange(appInfo.id)}
      >
        <AppInfoView appInfo={appInfo} />
      </div>
    ));
  }, [appList, appDetails?.id]);

  if (!appDetails) {
    return null;
  }

  const handleChange = (newAppId: string) => {
    history.replace(location.pathname.replace(appID, newAppId));
  };

  const { appIcon = '', appName } = appDetails;
  const { bgColor, iconName } = (appIcon ? JSON.parse(appIcon) : {}) as AppIconInfo;

  return (
    <More contentClassName='app-global-header-drop-more' items={appListItems}>
      <div className='flex items-center cursor-pointer app-global-header-cur-app'>
        <AppIcon className='mr-8' size={32} themeColor={bgColor} iconName={iconName} />
        <span className='text-overflow-1'>{appName}</span>
        <Icon style={{ minWidth: '20px' }} name='expand_more' size={20} />
      </div>
    </More>
  );
}

export default observer(AppDropdown);
