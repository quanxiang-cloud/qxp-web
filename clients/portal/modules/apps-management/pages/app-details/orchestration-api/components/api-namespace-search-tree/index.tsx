import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';

import Tree from '@c/headless-tree';
import Loading from '@c/loading';
import { useApiNamespaceSearchStore } from '@orchestrationAPI/context';
import { useSearchNameSpaceList } from '@orchestrationAPI/effects/api/api-namespace';
import { apiNamespaceToTreeNode, stringToAsciiNumber } from '@orchestrationAPI/utils';

import NodeRender from '../api-namespace-tree/namespace-node';
import { OrchestrationAPIStore } from '@orchestrationAPI/store';

interface Props {
  shouldShow: boolean;
  orchestrationAPIStore: OrchestrationAPIStore | null;
  searchKey?: string;
  rootPath?: string;
}

function APINamespaceSearchTree(
  { shouldShow, orchestrationAPIStore, searchKey, rootPath }: Props,
): JSX.Element | null {
  const store = useApiNamespaceSearchStore();

  useEffect(() => {
    shouldShow && store && orchestrationAPIStore?.setNameSpaceStore(store);
  }, [store, orchestrationAPIStore, shouldShow]);

  const { data, isLoading: loading } = useSearchNameSpaceList(
    { path: rootPath || '', body: { title: searchKey || '' } },
    { enabled: !!rootPath },
  );

  useEffect(() => {
    if (loading || !store?.rootNode) {
      return;
    }
    const { rootNode: node } = store;
    store?.addChildren(
      node.id,
      data?.list.map((namespace) => apiNamespaceToTreeNode(
        namespace, [], node.level + 1, true, false, node.id, stringToAsciiNumber(namespace.name),
      )) || [], true,
    );
  }, [data, loading, store]);

  if (loading) {
    return <Loading desc="加载中..." />;
  }

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

export default observer(APINamespaceSearchTree);
