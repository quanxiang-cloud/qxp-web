import React, { useState, useEffect } from 'react';

import { TreeNode } from '@c/headless-tree/types';
import Tree from '@c/headless-tree';
import Store from '@c/headless-tree/store';
import Loading from '@c/loading';

import NodeRender from './tree-node';

interface Props<T> {
  defaultValue: string;
  treeData?: TreeNode<T>;
  onChange: (value: string) => void;
}

export default function TreePicker<T extends { id: string} >({
  treeData,
  defaultValue,
  onChange,
}: Props<T>): JSX.Element {
  const [store, setStore] = useState<Store<T>>();

  useEffect(() => {
    if (!store || !defaultValue) {
      return;
    }
    const node = store.nodeList.find((node) => node.id === defaultValue);
    if (node) {
      onChange(node.id);
      store.onSelectNode(node.id);
    }
  }, [defaultValue, store]);

  useEffect(() => {
    if (treeData) {
      const newStore = new Store({ rootNode: treeData, treeNodeHeight: 36 }, false);
      setStore(newStore);
      if (store) {
        newStore.onSelectNode(store.currentFocusedNodeID);
      }
    }
  }, [treeData]);

  if (!store) {
    return <Loading desc="加载中..." />;
  }

  return (
    <Tree
      store={store}
      NodeRender={NodeRender}
      RootNodeRender={NodeRender}
      className="transition-all overflow-y-scroll visible h-230"
      onSelect={(node) => {
        if (!node) {
          return;
        }
        onChange(node.id);
      }}
    />
  );
}
