import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';

import Tab from '@c/tab';
import ErrorTips from '@c/error-tips';
import Loading from '@c/loading';
import { PathType, useQueryNameSpaceRawRootPath } from '@portal/modules/poly-api/effects/api/namespace';

import Source from './source';
import store from './store';

type Props = {
  curRole: RoleRight,
}

function APIAuth({ curRole }: Props): JSX.Element {
  const { appID } = useParams<AppParams>();
  const { modelType } = store;

  useEffect(() => {
    store.setAppID(appID);
    return () => {
      store.clear();
    };
  }, []);

  useEffect(() => {
    store.setRole(curRole);
  }, [curRole]);

  const {
    data: namespace,
    isLoading,
    error: fetchRootPathError,
  } = useQueryNameSpaceRawRootPath(appID, modelType, { enabled: !!appID });

  useEffect(() => {
    if (namespace) {
      store.setRootPath(namespace?.appPath.slice(1) || '');
    }
  }, [namespace]);

  const tabItems = [
    {
      id: 'inner.form',
      name: '数据模型',
      content: isLoading ? <Loading /> : <Source/>,
    },
    {
      id: 'raw.3party',
      name: '第三方API代理',
      content: isLoading ? <Loading /> : <Source/>,
    },
    {
      id: 'poly',
      name: 'API编排',
      content: isLoading ? <Loading /> : <Source/>,
    },
    {
      id: 'faas',
      name: 'FaaS函数',
      content: isLoading ? <Loading /> : <Source/>,
    },
  ];

  if (fetchRootPathError) {
    return <ErrorTips desc='获取数据失败' />;
  }

  return (
    <Tab
      currentKey={modelType}
      stretchNav={false}
      items={tabItems}
      className='w-full flex border border-b-0 rounded-t-8 h-full api-group'
      onChange={(nstype) => store.setModelType(nstype as PathType)}
    />
  );
}

export default observer(APIAuth);
