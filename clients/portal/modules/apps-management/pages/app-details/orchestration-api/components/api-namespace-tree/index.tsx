import React from 'react';
import { observer } from 'mobx-react';

import Tree from '@c/headless-tree';
import {
  useApiNamespaceStore,
} from '@portal/modules/apps-management/pages/app-details/orchestration-api/context';

import NodeRender from './namespace-node';

function APINamespaceTree(): JSX.Element | null {
  const store = useApiNamespaceStore();

  if (!store) {
    return null;
  }

  return (
    <div className="pt-8 h-full overflow-auto z-0 bg-gray-50 polynamespacetree">
      <Tree
        store={store}
        NodeRender={NodeRender}
        RootNodeRender={() => null}
        switcherIcon={{ open: 'folder_outline_empty', close: 'folder_open' }}
      />
    </div>
  );
}

export default observer(APINamespaceTree);
