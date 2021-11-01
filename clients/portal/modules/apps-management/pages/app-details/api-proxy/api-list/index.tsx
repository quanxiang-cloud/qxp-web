import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import Tab from '@c/tab';

import Header from '../comps/header';
import ApiList from './list';
import GroupSetting from './group-setting';
import ApiKeys from './api-keys';
import NoData from '../comps/no-data';

import store from '../store';

const defaultKey = 'group-setting';

function ListPage() {
  const [tabKey, setTabKey] = useState(defaultKey);

  useEffect(()=> {
    setTabKey(defaultKey);
    // if (tabKey === defaultKey) {
    //   store.fetchSvc();
    // }
  }, [store.treeStore?.currentFocusedNodeID]);

  if (!store.treeStore?.currentFocusedNodeID) {
    return <NoData />;
  }

  return (
    <>
      <Header name={store.treeStore?.curNodeTitle}/>
      <Tab
        currentKey={tabKey}
        onChange={setTabKey}
        items={[
          {
            id: 'api-list',
            name: 'API 列表',
            content: <ApiList/>,
            disabled: !store.svc,
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
