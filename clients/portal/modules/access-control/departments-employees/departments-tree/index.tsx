import React, { useMemo } from 'react';
import { observer } from 'mobx-react';

import Tree from '@c/headless-tree';
import TreeStore from '@c/headless-tree/store';
import Loading from '@c/loading';

import DepartmentNode from './department-node';
import store from '../store';

interface Props {
  onSelect?: (department: Department) => void;
}

function DepartmentsTree({ onSelect }: Props): JSX.Element {
  const departmentTree = useMemo(() => {
    if (!store.depTreeNode) return;
    return new TreeStore({ rootNode: store.depTreeNode, treeNodeHeight: 36 });
  }, [store.depTreeNode]);

  if (!departmentTree) {
    return (<Loading className="h-full" desc="加载中..." />);
  }

  return (
    <div className="tree-wrapper">
      <Tree
        store={departmentTree}
        NodeRender={DepartmentNode}
        RootNodeRender={DepartmentNode}
        onSelect={onSelect}
      />
    </div>
  );
}

export default observer(DepartmentsTree);
