import React from 'react';
import classnames from 'classnames';

import Tree from '@c/headless-tree';

import { DepartmentNode } from './department-node';
import Store from './store';

export interface Props {
  store: Store;
  className?: string;
  itemClassName?: string;
  wrapperClassName?: string;
}

export default function EmployeeSelectTree(
  { store, className, itemClassName, wrapperClassName }: Props
) {
  return (
    <div className={classnames('tree-wrapper', wrapperClassName)}>
      <Tree
        store={store}
        NodeRender={DepartmentNode}
        RootNodeRender={DepartmentNode}
        className={className}
        itemClassName={itemClassName}
      />
    </div>
  );
}
