import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';

import Tab from '@c/tab';
import Tooltip from '@c/tooltip';

import Header from '../comps/header';
import ApiList from './list';
import GroupSetting from './group-setting';
import ApiKeys from './api-keys';
import NoData from '../comps/no-data';

import store from '../store';

import './index.scss';

const defaultKey = 'group-setting';

function ListPage() {
  const [tabKey, setTabKey] = useState(defaultKey);
  const tabs = useMemo(()=> {
    return [
      {
        id: 'api-list',
        name: store.svc?.fullPath ? 'API 列表' : (
          <Tooltip
            position='bottom'
            label='请先配置分组'
            relative={false}
          >
            <span>API 列表</span>
          </Tooltip>
        ),
        content: <ApiList/>,
        disabled: !store.svc,
      },
      {
        id: 'group-setting',
        name: '配置分组',
        content: <GroupSetting/>,
      },
      (!store.svc || store.svc.authType === 'none') ? null : {
        id: 'api-keys',
        name: 'API 密钥',
        content: <ApiKeys/>,
      },
    ].filter(Boolean);
  }, [store.currentNs?.id, store.svc]);

  useEffect(()=> {
    if (!store.svc) {
      setTabKey(defaultKey);
    }
  }, [store.svc]);

  return (
    <>
      <Header name={store.treeStore?.curNodeTitle}/>
      {!store.currentNs ? <NoData /> : (
        <Tab
          currentKey={tabKey}
          onChange={setTabKey}
          navsClassName='api-list-tabs'
          // @ts-ignore
          items={tabs}
        />
      )}

    </>
  );
}

export default observer(ListPage);
