import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router';

import { NodeItem } from '@c/two-level-menu';
import { createCollection, useCollection, PathType, DirectoryChild } from '@lib/api-collection';

import DocumentNav from './document-nav';
import ApiDocumentDetails from './document-detalis';

import './index.scss';

function ApiDocument(): JSX.Element {
  const { appID } = useParams<AppParams>();
  const [selectedNode, setSelectedNode] = useState<NodeItem<DirectoryChild>>();

  const apiCollection = useMemo(() => {
    return createCollection({ appID, pathTypes: [PathType.RAW_ROOT, PathType.POLY], mode: 'directoryWithApi' });
  }, []);

  const collectionValue = useCollection(apiCollection);

  const getApiList = (directoryPath: string, pathType?: PathType): void => {
    apiCollection.onGetApiList(directoryPath, pathType || PathType.RAW_ROOT);
  };

  return (
    <div className="bg-white flex h-full rounded-t-12">
      <DocumentNav
        collectionValue={collectionValue}
        onSelectNode={setSelectedNode}
        onGetApiList={getApiList}
      />
      <ApiDocumentDetails
        appID={appID}
        node={selectedNode}
        onGetApiList={getApiList}
      />
    </div>
  );
}

export default ApiDocument;
