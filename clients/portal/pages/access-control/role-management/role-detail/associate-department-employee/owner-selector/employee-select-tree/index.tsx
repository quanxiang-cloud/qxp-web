import React from 'react';

import Store from './store';
import Tree from '@portal/components/headless-tree';
import { DepartmentNode } from './department-node';

export interface IEmploye@portal/components/loading2
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
