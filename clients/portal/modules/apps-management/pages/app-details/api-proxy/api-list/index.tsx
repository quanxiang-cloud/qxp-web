import React from 'react';
import { observer } from 'mobx-react';

import Tab from '@c/tab';

import SideNav from '../side-nav';
import Content from '../comps/content';
import ApiList from './list';
import GroupSetting from './group-setting';
import Header from '../comps/header';

import store from '../stores';

interface Props {
  className?: string;
}

function ListPage(props: Props) {
  return (
    <>
      <SideNav />
      <Content>
        <Header name={store.activeGroup?.name} />
        <Tab
          items={[
            {
              id: 'api-list',
              name: 'API 列表',
              content: <ApiList/>,
            },
            {
              id: 'group-setting',
              name: '分组配置',
              content: <GroupSetting/>,
            },
          ]}
        />
      </Content>
    </>
  );
}

export default observer(ListPage);
