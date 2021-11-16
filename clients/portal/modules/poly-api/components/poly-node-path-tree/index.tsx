import React, { useMemo, Ref, forwardRef, ForwardedRef, useImperativeHandle } from 'react';
import { get } from 'lodash';

import Tree from '@c/headless-tree';
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
  onSelect: (node: any) => void;
  className?: string;
  ref?: Ref<RefType>;
}

function FormulaConfigTree(
  { onSelect, className }: Props, ref: ForwardedRef<RefType>,
): JSX.Element {
  const polyNodeStore = useObservable(store$);
  const apiRequestNodeId = polyNodeStore.currentNodeConfigParams?.currentNode?.get('name') as string;

  let sourceNodes: POLY_API.PolyNodeInput[] = [];
  if (polyNodeStore && apiRequestNodeId) {
    sourceNodes = getPathTreeSource(apiRequestNodeId);
  }

  const store = useMemo(() => new Store(root, sourceNodes), [root, sourceNodes]);

  useImperativeHandle(ref, () => ({
    getCustomRules: () => {
      return store.nodeList
        .filter(({ name, visible }) => !!name && visible)
        .map((node) => ({
          name: get(node, 'data.descPath', ''),
          key: node.path,
        }));
    },
  }), [store]);

  return (
    <Tree
      className={className}
      store={store}
      NodeRender={NodeRender}
      RootNodeRender={() => null}
      onSelect={() => onSelect(store.currentFocusedNode)}
    />
  );
}

export default forwardRef<RefType, Props>(FormulaConfigTree);
