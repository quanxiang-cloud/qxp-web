import React from 'react';
import { observer } from 'mobx-react';

import Tree from '@portal/components/headless-tree';
import { DepartmentNode } from './department-node';
import DepartmentTreeStore from './store';

export interface IDepartmentSelectTree {
  store: DepartmentTreeStore;
}

export const DepartmentSelectTree = observer(({ store }: IDepartmentSelectTree) => {
  return (
    <div className="departments-tree">
      <Tree
        store={store}
        NodeRender={DepartmentNode}
        RootNodeRender={DepartmentNode}
      />
    </div>
  );
});
