import React from 'react';

import Store from './store';
import Tree from '@portal/components/headless-tree';
import { DepartmentNode } from './department-node';

export interface IEmployeeSelectTree {
  store: Store;
  className?: string;
  itemClassName?: string;
}
export const EmployeeSelectTree = ({ store, className, itemClassName }: IEmployeeSelectTree) => {
  return (
    <div className="tree-wrapper">
      <Tree
        store={store}
        NodeRender={DepartmentNode}
        RootNodeRender={DepartmentNode}
        className={className}
        itemClassName={itemClassName}
      />
    </div>
  );
};
