import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import APINamespaceHeader from '@orchestrationAPI/components/api-namespace-header';
import APINamespaceTree from '@orchestrationAPI/components/api-namespace-tree';
import Loading from '@c/loading';
import {
  ApiNamespaceStoreProvider, useOrchestrationAPIStore,
} from '@portal/modules/apps-management/pages/app-details/orchestration-api/context';
import {
  useQueryNameSpaceList,
  useQueryNameSpaceRootPath,
} from '@orchestrationAPI/effects/api/api-namespace';

function ApiNamespace(): JSX.Element {
  const orchestrationAPIStore = useOrchestrationAPIStore();
  const { appID } = useParams<{ appID: string }>();
  const { data: appNamespaces, isLoading: isNamespaceLoading } = useQueryNameSpaceList(`system/app/${appID}`);
  const { data: appRootPathData, isLoading: isNamespaceRootPathLoading } = useQueryNameSpaceRootPath(appID);
  const rootData = appNamespaces?.list?.find(
    ({ name, parent }) => `${parent}/${name}` === appRootPathData?.appPath,
  );
  const { data: initialData, isLoading: isNamespaceRootListLoading } = useQueryNameSpaceList(
    appRootPathData?.appPath?.slice(1) || '',
    { enabled: !!rootData },
  );
  const isLoading = isNamespaceRootListLoading || isNamespaceRootPathLoading || isNamespaceLoading;

  useEffect(() => {
    orchestrationAPIStore?.updateProperty({ isApiNameSpaceDetailsLoading: isLoading });
  }, [isLoading]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ApiNamespaceStoreProvider root={rootData} child={initialData?.list || []}>
      <APINamespaceHeader />
      <APINamespaceTree />
    </ApiNamespaceStoreProvider>
  );
}

export default ApiNamespace;
