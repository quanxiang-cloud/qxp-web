import React from 'react';
import { useHistory } from 'react-router-dom';

import Icon from '@c/icon';
import MoreMenu, { MenuItem } from '@c/more-menu';

type Props = {
  appInfo: AppInfo;
  openModal: (modalType: string, appInfo: AppInfo) => void;
}

function AppActions({ openModal, appInfo }: Props) {
  const history = useHistory();

  const menus: MenuItem[] = [
    {
      key: 'publish',
      label: (
        <div className="flex items-center">
          <Icon name="toggle_on" className="mr-4" />
          {appInfo.useStatus > 0 ? '下架应用' : '发布应用'}
        </div>
      ),
    },
    {
      key: 'setting',
      label: (
        <div className="flex items-center"><Icon name="settings" className="mr-4" />应用设置</div>
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
      key: 'delete',
      label: (
        <div className="flex items-center">
          <Icon name="restore_from_trash" className="mr-4" />
          删除
        </div>
      ),
    },
  ];

  const handleClick = (key: string) => {
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
    }
  };
  return (
    <MoreMenu
      menus={menus}
      placement="bottom-end"
      onMenuClick={handleClick}
    />
  );
}

export default AppActions;
