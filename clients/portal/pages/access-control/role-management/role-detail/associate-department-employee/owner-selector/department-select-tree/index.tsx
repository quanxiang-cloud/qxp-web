import React from 'react';
import { observer } from 'mobx-react';

import Store from './store';
import Tree from '@portal/components/headless-tree';
import { DepartmentNode } from './department-node';

export interface IDepartmentSelectTree {
  store: Store;
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
