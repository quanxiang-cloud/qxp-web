import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { first, last } from 'lodash';

import APINamespaceHeader from '@orchestrationAPI/components/api-namespace-header';
import APINamespaceTree from '@orchestrationAPI/components/api-namespace-tree';
import Loading from '@c/loading';
import { nanoid } from '@c/form-builder/utils';
import {
  ApiNamespaceStoreProvider, useOrchestrationAPIStore,
} from '@portal/modules/apps-management/pages/app-details/orchestration-api/context';
import {
  useQueryNameSpaceList,
  useQueryNameSpaceRootPath,
} from '@orchestrationAPI/effects/api/api-namespace';

function ApiNamespace(): JSX.Element | null {
  const orchestrationAPIStore = useOrchestrationAPIStore();
  const { appID } = useParams<{ appID: string }>();
  const { data: appRootPathData, isLoading: isNamespaceRootPathLoading } = useQueryNameSpaceRootPath(appID);
  const pathes = appRootPathData?.appPath.split('/') || [];
  const owner = first(pathes) || '';
  const name = last(pathes) || '';
  const parent = pathes.slice(0, -1).join('/');

  const rootData = {
    active: 1, createAt: '', updateAt: '', desc: '', id: nanoid(), owner, ownerName: '', parent, name,
    title: '', subCount: 0,
  };
  const rootPath = appRootPathData?.appPath?.slice(1) || '';
  const { data: initialData, isLoading: isNamespaceRootListLoading } = useQueryNameSpaceList(
    rootPath,
    { enabled: !!(rootData && rootPath) },
  );
  rootData.subCount = initialData?.list.length || 0;

  const isLoading = isNamespaceRootListLoading || isNamespaceRootPathLoading;

  useEffect(() => {
    orchestrationAPIStore?.updateProperty({ isApiNameSpaceDetailsLoading: isLoading });
  }, [isLoading]);

  if (isLoading) {
    return <Loading />;
  }

  if (!rootData) {
    return null;
  }

  return (
    <ApiNamespaceStoreProvider root={rootData} child={initialData?.list || []}>
      <APINamespaceHeader />
      <APINamespaceTree />
    </ApiNamespaceStoreProvider>
  );
}

export default ApiNamespace;
