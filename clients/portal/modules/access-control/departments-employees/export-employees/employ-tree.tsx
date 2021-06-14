import React from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';

import Tree from '@c/headless-tree';
import { NodeRenderProps } from '@c/headless-tree/types';

import DepartmentNode from './department-node';
import DepartmentTreeStore from './store';

export interface Props {
  store: DepartmentTreeStore;
  className?: string;
  itemClassName?: string;
  wrapperClassName?: string;
  onChange: (prevNodes: Department[], currentNodes: Department[]) => void;
}

export default observer(function DepartmentSelectTree({
  store, className, itemClassName, wrapperClassName, onChange,
}: Props) {
  function NodeRender({ node, store }: NodeRenderProps<Department>) {
    return (
      <>
        <DepartmentNode onChange={onChange} node={node} store={store} />
      </>
    );
  }

  return (
    <div className={cs('tree-wrapper', wrapperClassName)}>
      <Tree
        store={store}
        NodeRender={NodeRender}
        RootNodeRender={NodeRender}
        className={className}
        itemClassName={itemClassName}
      />
    </div>
  );
});
