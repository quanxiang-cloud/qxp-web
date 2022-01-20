import React from 'react';

import MoreMenu, { MenuItem } from '@c/more-menu';

type Props = {
  appInfo: AppInfo;
  menus: MenuItem[];
  handleActions: (key: string, appInfo: AppInfo) => void;
}

function AppActions({ menus, handleActions, appInfo }: Props): JSX.Element {
  if (!appInfo) {
    return <></>;
  }

  return (
    <MoreMenu
      menus={menus}
      placement="bottom-end"
      onMenuClick={(key) => {
        handleActions(key, appInfo);
      }}
    />
  );
}

export default AppActions;
