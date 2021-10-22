import React from 'react';

import Tab from '@c/tab';

import BasicInfo from './basic-info';

function AppInfo(): JSX.Element {
  return (
    <div className="flex-1 h-full opacity-95">
      <Tab
        strechNavs={false}
        separator={false}
        navsClassName="overflow-auto nav-background-image"
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
        ]}
      />
    </div>
  );
}

export default AppInfo;
