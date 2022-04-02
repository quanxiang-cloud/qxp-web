import React from 'react';

import Tab from '@c/tab';

import BasicInfo from './basic-info';
import AppLayout from './app-layout';
import PageLayout from './page-layout';

function AppInfo(): JSX.Element {
  return (
    <div className="flex-1 h-full opacity-95">
      <Tab
        stretchNav={false}
        separator={false}
        navsClassName="overflow-auto nav-background-image"
        navTitleClassName="text-12"
        className="corner-8-8-0-0"
        contentClassName="nav-content"
        items={[
          {
            id: 'fieldAttr',
            name: '应用基本信息',
            content: (<BasicInfo />),
          },
          // {
          //   id: 'formAttr',
          //   name: '访问端个性化设置',
          //   content: (<div></div>),
          // },
          {
            id: 'appLayout',
            name: '应用布局设置',
            content: (<AppLayout />),
          },
          {
            id: 'pageLayout',
            name: '页面布局设置',
            content: (<PageLayout />),
          },
        ]}
      />
    </div>
  );
}

export default AppInfo;
