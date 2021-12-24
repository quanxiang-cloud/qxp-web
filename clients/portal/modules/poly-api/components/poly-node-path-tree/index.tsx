import { get } from 'lodash';
import React, {
  useMemo, Ref, forwardRef, ForwardedRef, useImperativeHandle, useCallback,
} from 'react';

import Tree from '@c/headless-tree';
import type { TreeNode } from '@c/headless-tree/types';
import store$ from '@polyApi/store';
import useObservable from '@lib/hooks/use-observable';
import getPathTreeSource from '@polyApi/utils/get-path-tree-source';
import type { CustomRule } from '@c/formula-editor';

import Store from './store';
import NodeRender from './poly-tree-node';

const root: POLY_API.PolyNodeInput = {
  type: 'object',
  name: '',
  desc: '',
  data: [],
  in: 'body',
  required: false,
};

export type RefType = {
  getCustomRules(): CustomRule[];
}
type Props = {
  onSelect: (node: TreeNode<POLY_API.PolyNodeInput & { descPath: string }>) => void;
  className?: string;
  ref?: Ref<RefType>;
  sourceGetter?: () => POLY_API.PolyNodeInput[];
}

function FormulaConfigTree(
  { onSelect, className, sourceGetter }: Props, ref: ForwardedRef<RefType>,
): JSX.Element {
  const polyNodeStore = useObservable(store$);
  const apiRequestNodeId = polyNodeStore.currentNodeConfigParams?.currentNode?.get('name') as string;

  const sourceNodes = useMemo(() => {
    if (polyNodeStore && apiRequestNodeId) {
      return getPathTreeSource(apiRequestNodeId);
    }
    return [];
  }, [apiRequestNodeId, polyNodeStore]);

  const sourceNodesAlternatives = useMemo(() => {
    return sourceGetter?.();
  }, [sourceGetter]);

  const storeSource = sourceNodesAlternatives ?? sourceNodes;

  const store = useMemo(() => new Store(root, storeSource), [root, storeSource]);

  useImperativeHandle(ref, () => ({
    getCustomRules: () => {
      return store.nodeList
        .filter(({ name }) => !!name)
        .map((node) => ({
          name: get(node, 'data.descPath', ''),
          key: node.path,
        }));
    },
  }));

  const handleSelect = useCallback(() => {
    const currentNode = store.currentFocusedNode as TreeNode<POLY_API.PolyNodeInput & { descPath: string }>;
    if (!currentNode.visible ||
      (currentNode.level === 2 && currentNode.name === 'start') ||
      (currentNode.level === 2 && currentNode.path.startsWith('$.formData')) ||
      (currentNode.level === 2 && currentNode.path.startsWith('$.webhook-')) ||
      (currentNode.level === 2 && currentNode.path.startsWith('$.variable'))
    ) {
      return;
    }
    onSelect(currentNode);
  }, [onSelect, store]);

  return (
    <Tree
      className={className}
      store={store}
      NodeRender={NodeRender}
      RootNodeRender={() => null}
      onSelect={handleSelect}
    />
  );
}

export default forwardRef<RefType, Props>(FormulaConfigTree);
