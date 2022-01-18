import React from 'react';
import { useHistory } from 'react-router-dom';

import toast from '@lib/toast';
import MoreMenu, { MenuItem } from '@c/more-menu';
import { subscribeStatusChange } from '@c/task-lists/utils';

import { exportAppAndCreateTask } from './api';

type Props = {
  appInfo: AppInfo;
  openModal: (modalType: string, appInfo: AppInfo) => void;
  menus: MenuItem[];
}

function AppActions({ openModal, appInfo, menus }: Props): JSX.Element {
  const history = useHistory();

  function exportApp(): void {
    exportAppAndCreateTask({
      value: { appID: appInfo?.id || '' },
      title: `【${appInfo.appName}】 应用导出`,
    }).then((res) => {
      subscribeStatusChange(res.taskID, '导出');
    }).catch((err) => {
      toast.error(err.message);
    });
  }

  function handleClick(key: string): void {
    switch (key) {
    case 'publish':
      openModal('publish', appInfo);
      break;
    case 'setting':
      history.push(`/apps/details/${appInfo.id}/setting/info`);
      break;
    case 'visit':
      window.open(`//${window.CONFIG.home_hostname}/apps/` + appInfo.id);
      break;
    case 'delete':
      openModal('delete', appInfo);
      break;
    case 'exportApp':
      exportApp();
      break;
    case 'saveAsTemplate':
      openModal('saveAsTemplate', appInfo);
      break;
    case 'editTemplate':
      openModal('editTemplate', appInfo);
      break;
    case 'delTemplate':
      openModal('delTemplate', appInfo);
      break;
    }
  }

  return (
    <MoreMenu
      menus={menus}
      placement="bottom-end"
      onMenuClick={handleClick}
    />
  );
}

export default AppActions;
