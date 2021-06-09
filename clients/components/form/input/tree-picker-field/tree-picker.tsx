import React, { useState, useEffect, useRef } from 'react';
import { Label } from '@QCFE/lego-ui';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import { TreeNode } from '@c/headless-tree/types';
import Tree from '@c/headless-tree';
import Store from '@c/headless-tree/store';
import Loading from '@c/loading';

import NodeRender from './tree-node';

interface Props<T> {
  label: string;
  defaultValue: string;
  treeData: TreeNode<T>;
  onChange: (value: string, paths: T[]) => void;
  onToggle: () => void;
  visible?: boolean;
}

export default function TreePicker<T extends { id: string} >({
  label,
  treeData,
  defaultValue,
  onChange,
  visible,
  onToggle,
}: Props<T>) {
  const [store, setStore] = useState<Store<T>>();
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    if (!store || !defaultValue) {
      return;
    }
    const node = store.nodeList.find((node) => node.id === defaultValue);
    if (node) {
      const path = [node.data, ...store.getNodeParents(node.id).map(({ data }) => data)];
      onChange(node.id, path);
      store.onSelectNode(node.id);
    }
  }, [defaultValue, store]);

  useEffect(() => {
    if (treeData) {
      const newStore = new Store({ rootNode: treeData }, false);
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
    <>
      <Label className="flex w-full text-left text-body2">{label}</Label>
      <Tree
        store={store}
        NodeRender={NodeRender}
        RootNodeRender={NodeRender}
        className={twCascade(
          'transition-all border border-blue-1000 border-b-0 overflow-scroll',
          'visible rounded-tl-2 rounded-tr-8',
          {
            'h-0': !visible,
            'h-280': visible,
            invisible: !visible,
            visible: visible,
          },
        )}
        onSelect={(node) => {
          if (isFirstLoadRef.current) {
            isFirstLoadRef.current = false;
            return;
          }
          if (!node) {
            return;
          }
          const paths = [node, ...store.getNodeParents(node.id).map(({ data }) => data)];
          onChange(node.id, paths);
          onToggle();
        }}
      />
    </>
  );
}
