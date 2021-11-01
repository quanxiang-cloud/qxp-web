import React from 'react';
import { observer } from 'mobx-react';

import Tab from '@c/tab';

import Header from '../comps/header';
import ApiList from './list';
import GroupSetting from './group-setting';
import ApiKeys from './api-keys';

import store from '../store';

function ListPage() {
  return (
    <>
      <Header name={store.treeStore?.curNodeTitle}/>
      <Tab
        currentKey='group-setting'
        items={[
          {
            id: 'api-list',
            name: 'API 列表',
            content: <ApiList/>,
          },
          {
            id: 'group-setting',
            name: '配置分组',
            content: <GroupSetting/>,
          },
          {
            id: 'api-keys',
            name: 'API 密钥',
            content: <ApiKeys/>,
          },
        ]}
      />
    </>
  );
}

export default observer(ListPage);
