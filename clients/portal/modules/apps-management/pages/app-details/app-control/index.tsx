import React from 'react';

import Tab from '@c/tab';

import ManagePermission from './manage-permission';
import AppRoles from '../roles-and-permissions';
import AppVisitPermission from './app-visit-permission';

function AppControl(): JSX.Element {
  return (
    <div className="flex-1 h-full opacity-95 access-control">
      <Tab
        stretchNav={false}
        separator={false}
        navsClassName="overflow-auto nav-background-image"
        navTitleClassName="text-12"
        className="corner-8-8-0-0"
        contentClassName="control-content"
        items={[
          {
            id: 'homePermission',
            name: 'API 访问权限',
            content: (<AppRoles />),
          },
          {
            id: 'appVisitPermission',
            name: '应用访问权限',
            content: (<AppVisitPermission />),
          },
          {
            id: 'managePermission',
            name: '管理端权限',
            content: (<ManagePermission />),
          }]}
      />
    </div>
  );
}

export default AppControl;
