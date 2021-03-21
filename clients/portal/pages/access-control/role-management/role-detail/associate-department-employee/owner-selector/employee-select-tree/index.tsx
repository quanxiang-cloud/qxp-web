import React from 'react';

import Store from './store';
import Tree from '@portal/components/headless-tree';
import { DepartmentNode } from './department-node';

export interface IEmployeeSelectTree {
  store: Store;
}
export const EmployeeSelectTree = ({ store }: IEmployeeSelectTree) => {
  return (
    <div className="departments-tree">
      <Tree
        store={store}
        NodeRender={DepartmentNode}
        RootNodeRender={DepartmentNode}
      />
    </div>
  );
};
