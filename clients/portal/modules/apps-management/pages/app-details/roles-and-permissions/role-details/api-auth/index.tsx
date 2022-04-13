import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import Tab from '@c/tab';
import Loading from '@c/loading';
import { PathType, useQueryNameSpaceRawRootPath } from '@portal/modules/poly-api/effects/api/namespace';

import Source from './source';
import store from '../store';

function APIAuth(): JSX.Element {
  const { appID, modelType } = store;

  const {
    data: namespace,
    isLoading,
    error: fetchRootPathError,
  } = useQueryNameSpaceRawRootPath(appID, modelType);

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
    return <div>失败</div>;
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
