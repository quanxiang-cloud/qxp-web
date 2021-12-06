import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';

import Tab, { TabItem } from '@c/tab';
import Tooltip from '@c/tooltip';

import Header from '../comps/header';
import ApiList from './list';
import GroupSetting from './group-setting';
import ApiKeys from './api-keys';
import NoData from '../comps/no-data';

import store from '../store';

import './index.scss';

const defaultKey = 'api-list';

function renderApiListTips(): JSX.Element | string {
  if (!store.svc?.fullPath) {
    return (
      <Tooltip
        position='bottom'
        label='请先配置分组'
      >
        <span>API 列表</span>
      </Tooltip>
    );
  }
  if (store.svc.authType === 'signature' && !store.apiKeyTotal) {
    return (
      <Tooltip
        position='bottom'
        label='您至少需要创建一个 API 密钥'
      >
        <span>API 列表</span>
      </Tooltip>
    );
  }
  return 'API 列表';
}

function ListPage(): JSX.Element {
  const [tabKey, setTabKey] = useState(defaultKey);
  const tabs = useMemo(()=> {
    return [
      {
        id: 'api-list',
        name: renderApiListTips(),
        content: store.svc?.fullPath && <ApiList />,
        disabled: !store.svc || (store.svc.authType === 'signature' && !store.apiKeyTotal),
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
  }, [store.currentNs?.id, store.svc?.fullPath, store.svc?.authType, store.apiKeyTotal]);

  useEffect(()=> {
    store.fetchSvc().then(() => {
      if (!store.svc) {
        setTabKey('group-setting');
      } else if (store.svc.authType === 'signature' && !store.apiKeyTotal) {
        setTabKey('api-keys');
      } else {
        setTabKey(defaultKey);
      }
    });
  }, [store.currentSvcPath]);

  return (
    <>
      <Header name={store.treeStore?.curNodeTitle}/>
      {!store.currentNs ? <NoData /> : (
        <Tab
          currentKey={tabKey}
          onChange={setTabKey}
          navsClassName='api-list-tabs'
          contentClassName='api-proxy-tab-content'
          items={tabs as TabItem<string>[]}
        />
      )}
    </>
  );
}

export default observer(ListPage);
