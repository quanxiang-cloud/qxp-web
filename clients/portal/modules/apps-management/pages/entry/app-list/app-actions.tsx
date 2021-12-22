import React from 'react';
import { useHistory } from 'react-router-dom';

import Icon from '@c/icon';
import toast from '@lib/toast';
import MoreMenu, { MenuItem } from '@c/more-menu';

import { exportAppAndCreateTask } from './api';

type Props = {
  appInfo: AppInfo;
  openModal: (modalType: string, appInfo: AppInfo) => void;
}

function AppActions({ openModal, appInfo }: Props): JSX.Element {
  const history = useHistory();

  const menus: MenuItem[] = [
    {
      key: 'publish',
      disabled: appInfo.useStatus < -1,
      label: (
        <div className="flex items-center">
          <Icon name="toggle_on" className="mr-4" />
          {appInfo.useStatus > 0 ? '下架应用' : '发布应用'}
        </div>
      ),
    },
    {
      key: 'visit',
      disabled: appInfo.useStatus < 0,
      label: (
        <div className='flex items-center'>
          <Icon name="login" className="mr-4" />
          访问应用
        </div>
      ),
    },
    {
      key: 'saveAsTemplate',
      disabled: appInfo.useStatus < -1,
      label: (
        <div className="flex items-center">
          <Icon name="save" className="mr-4" />
          导出应用
        </div>
      ),
    },
    {
      key: 'delete',
      label: (
        <div className="flex items-center text-red-600">
          <Icon name="restore_from_trash" className="mr-4" />
          删除
        </div>
      ),
    },
  ];

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
    case 'saveAsTemplate':
      // openModal('saveAsTemplate', appInfo);
      exportAppAndCreateTask({ value: { appID: appInfo?.id || '' }, title: appInfo.appName }).then(() => {
        toast.success('APP 正在导出，请在右上方”同步列表“中查看导出结果');
      }).catch((err) => {
        toast.error(err.message);
      });
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
