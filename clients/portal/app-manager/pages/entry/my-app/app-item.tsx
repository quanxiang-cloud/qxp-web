import React from 'react';

import AppInfoView from '@appC/app-info-view';

import AppActions from './app-actions';
import './app-item.scss';

type Props = {
  appInfo: AppInfo;
  openModal: (modalType: string, appInfo: AppInfo) => void;
  readonly?: boolean;
  onClick?: (appId: string) => void;
}

function AppItem({ appInfo, onClick, readonly, openModal }: Props) {
  return (
    <div onClick={() => onClick?.(appInfo.id)} className='app-item-box'>
      <AppInfoView appInfo={appInfo} />
      {readonly ? null : <AppActions appInfo={appInfo} openModal={openModal} />}
    </div>
  );
}

export default AppItem;
