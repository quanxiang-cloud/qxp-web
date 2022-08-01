import React from 'react';

import Tree, { Props } from '@c/headless-tree';
import Store from '@c/headless-tree/store';
import MultipleSelectStrore from '@c/headless-tree/multiple-select-tree';
import { TreeNode, NodeRenderProps } from '@c/headless-tree/types';
import SelectableNode from '@c/employee-or-department-picker/department-select-tree/department-node';

import './tree.scss';

interface TreeData {
  name: string;
  id: string;
  children?: TreeData[];
}

interface TreeStylizerProps<T> extends Props<T> {
  treeData: TreeData;
  treeCheckable?: boolean;
  treeCheckStrictly?: boolean;
  onChange: (prevNodes: T[], currentNodes: T[]) => void;
}

function treeDataToTreeNode(treeData: TreeData, level = 0, pid?: string): TreeNode<TreeData> {
  const children = (treeData.children || []).map(
    (treeData) => treeDataToTreeNode(treeData, level + 1),
    treeData.id,
  );
  return {
    data: treeData,
    name: treeData.name,
    id: treeData.id,
    parentId: pid || null,
    path: '',
    isLeaf: !treeData.children?.length,
    visible: true,
    childrenStatus: 'resolved',
    expanded: level === 0,
    order: 0,
    level: level,
    children: children,
  };
}

function TreeStylizer({
  treeCheckStrictly,
  treeCheckable,
  treeData,
  onChange,
  ...props
}: TreeStylizerProps<TreeData>): JSX.Element {
  function SelectNodeRender({ node, store }: NodeRenderProps<any>): JSX.Element {
    return (
      <>
        <SelectableNode onChange={onChange} node={node} store={store} />
      </>
    );
  }

  function NormalNodeRender({ node }: NodeRenderProps<any>): JSX.Element {
    return <>{node.name}</>;
  }

  const rootNode = treeDataToTreeNode(treeData);
  const store = treeCheckable ?
    new MultipleSelectStrore({ rootNode, singleMode: !treeCheckStrictly }) :
    new Store({ rootNode });
  const Render = treeCheckable ? SelectNodeRender : NormalNodeRender;

  return <Tree {...props} store={store} RootNodeRender={Render} NodeRender={Render} />;
}

export default TreeStylizer;
