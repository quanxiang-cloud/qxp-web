import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';

import Tree from '@c/headless-tree';
import { useApiNamespaceStore } from '@orchestrationAPI/context';
import { OrchestrationAPIStore } from '@orchestrationAPI/store';

import NodeRender from './namespace-node';

interface Props {
  shouldShow: boolean;
  orchestrationAPIStore: OrchestrationAPIStore | null;
}

function APINamespaceTree({ shouldShow, orchestrationAPIStore }: Props): JSX.Element | null {
  const store = useApiNamespaceStore();

  useEffect(() => {
    shouldShow && store && orchestrationAPIStore?.setNameSpaceStore(store);
  }, [store, orchestrationAPIStore, shouldShow]);

  if (!store) {
    return null;
  }

  return (
    <div
      className={cs('pt-8 h-full overflow-auto z-0 bg-gray-50 polynamespacetree', { hidden: !shouldShow })}
    >
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
