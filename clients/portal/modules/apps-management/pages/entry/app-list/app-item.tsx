import React from 'react';
import cs from 'classnames';

import AppInfoView from '@c/app-info-view';

import AppActions from './app-actions';

import './app-item.scss';

type Props = {
  appInfo: AppInfo;
  openModal: (modalType: string, appInfo: AppInfo) => void;
  readonly?: boolean;
  onClick?: (appID: string) => void;
}

function getItemClassName(status: number): string {
  if (status === -2) {
    return 'app-importing';
  }

  if (status === -3) {
    return 'app-import-failed';
  }

  return '';
}

function AppItem({ appInfo, onClick, readonly, openModal }: Props): JSX.Element {
  function handleAppItemClick(): void {
    if (appInfo.useStatus < -1) {
      return;
    }

    onClick?.(appInfo.id);
  }

  return (
    <div className={cs('app-item-box', getItemClassName(appInfo.useStatus))}>
      <AppInfoView appInfo={appInfo} onClick={handleAppItemClick} />
      {readonly ? null : <AppActions appInfo={appInfo} openModal={openModal} />}
    </div>
  );
}

export default AppItem;
