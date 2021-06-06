import React from 'react';

import AppInfoView from '@c/app-info-view';

import AppActions from './app-actions';
import './app-item.scss';

type Props = {
  appInfo: AppInfo;
  openModal: (modalType: string, appInfo: AppInfo) => void;
  readonly?: boolean;
  onClick?: (appID: string) => void;
}

function AppItem({ appInfo, onClick, readonly, openModal }: Props) {
  return (
    <div className='app-item-box'>
      <AppInfoView onClick={() => onClick?.(appInfo.id)} appInfo={appInfo} />
      {readonly ? null : <AppActions appInfo={appInfo} openModal={openModal} />}
    </div>
  );
}

export default AppItem;
