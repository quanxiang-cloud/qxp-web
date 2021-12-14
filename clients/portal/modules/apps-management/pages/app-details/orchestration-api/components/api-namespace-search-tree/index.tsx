import React, { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';

import Tree from '@c/headless-tree';
import type { NodeRenderProps } from '@c/headless-tree/types';
import Loading from '@c/loading';
import { useApiNamespaceSearchStore } from '@orchestrationAPI/context';
import { NameSpace, useSearchNameSpaceList } from '@orchestrationAPI/effects/api/api-namespace';
import { OrchestrationAPIStore } from '@orchestrationAPI/store';
import { apiNamespaceToTreeNode, stringToAsciiNumber } from '@orchestrationAPI/utils';
import withProps from '@orchestrationAPI/effects/hoc/with-props';

import NodeRender from '../api-namespace-tree/namespace-node';

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

  const localNodeRender = useMemo(() => {
    return withProps<{ keyword: string }, NodeRenderProps<NameSpace>>(
      { keyword: searchKey || '' }, NodeRender,
    );
  }, [searchKey]);

  const { data, isLoading: loading } = useSearchNameSpaceList(
    { path: rootPath || '', body: { title: searchKey || '' } },
    { enabled: !!rootPath && shouldShow },
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
        NodeRender={localNodeRender}
        RootNodeRender={() => null}
        switcherIcon={{ open: 'folder_outline_empty', close: 'folder_open' }}
      />
    </div>
  );
}

export default observer(APINamespaceSearchTree);
