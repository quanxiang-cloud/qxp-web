import React, {
  useMemo,
  useState,
  useEffect,
} from 'react';
import { pipe, mergeRight, filter, map, cond, propEq, always, T, and, or, when } from 'ramda';
import { get } from 'lodash';

import Tree from '@c/headless-tree';
import type { TreeNode } from '@c/headless-tree/types';
import Loading from '@c/loading';

import Store from './store';
import NodeRender from './tree-node';
import type { TreeNodeDataType, Props, State, CurrentNode } from './type';
import { getRootNode } from './util';

export * from './type';

export default function PathTree(props: Props): JSX.Element {
  const { value, onChange, className, onRulesChange } = props;
  const [state, setState] = useState<State>({ root: null, treeStore: null });

  useEffect(() => {
    setState((s) => mergeRight(s, { root: getRootNode() }));
  }, []);

  useEffect(() => {
    setState((s) => mergeRight(s, { treeStore: state.root ? new Store(state.root, value) : null }));
  }, [state.root, value]);

  useEffect(() => {
    const getCustomRules = pipe(
      () => state.treeStore?.nodeList ?? [],
      filter(({ name }: TreeNode<TreeNodeDataType>) => !!name),
      map((node) => ({ name: get(node, 'data.descPath', ''), key: node.path })),
    );
    const customRules = getCustomRules();
    onRulesChange?.(customRules.length ? customRules : undefined);
  }, [state.treeStore]);

  const isLevelTwo = propEq('level', 2);
  const isStartNode = propEq('name', 'start');
  const disabledNodePathes = useMemo(() => ['$formData', '$webhook-', '$variable'], []);
  const isDisabledNode = (node: CurrentNode): boolean => and(
    isLevelTwo(node),
    or(
      isStartNode(node),
      disabledNodePathes.some((nodePath) => node.path.startsWith(nodePath)),
    ),
  );

  function handleSelect(): void {
    const currentNode = state.treeStore?.currentFocusedNode;
    const predicateSelect = cond([
      [(node) => !node.visible, always(null)],
      [(node) => isDisabledNode(node), always(null)],
      [T, () => onChange(currentNode)],
    ]);
    const whenCurrentNodeExist = when(Boolean, () => predicateSelect(currentNode));
    whenCurrentNodeExist(currentNode);
  }

  if (!state.treeStore) {
    return <Loading desc="加载中..." />;
  }

  return (
    <Tree
      className={className}
      store={state.treeStore}
      NodeRender={NodeRender}
      RootNodeRender={always(null)}
      onSelect={handleSelect}
    />
  );
}
