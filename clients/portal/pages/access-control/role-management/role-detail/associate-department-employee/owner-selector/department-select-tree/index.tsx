import React from 'react';
import { observer } from 'mobx-react';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import Tree from '@portal/components/headless-tree';
import { DepartmentNode } from './department-node';
import DepartmentTreeStore from './store';

export interface IDepartmentSelectTree {
  store: DepartmentTreeStore;
  className?: string;
  itemClassName?: string;
  wrapperClassName?: string;
}

export const DepartmentSelectTree = observer(({
  store, className, itemClassName, wrapperClassName,
}: IDepartmentSelectTree) => {
  return (
    <div className={twCascade('tree-wrapper', wrapperClassName)}>
      <Tree
        store={store}
        NodeRender={DepartmentNode}
        RootNodeRender={DepartmentNode}
        className={className}
        itemClassName={itemClassName}
      />
    </div>
  );
});
