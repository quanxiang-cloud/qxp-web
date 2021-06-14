import React from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';

import { NodeRenderProps } from '@c/headless-tree/types';
import Checkbox from '@c/checkbox';
import { last } from '@lib/utils';

import DepartmentTreeStore from './store';

interface Props extends NodeRenderProps<Department>{
  onChange: (prevNodes: Department[], currentNodes: Department[]) => void;
}

export default observer(function DepartmentNode({ node, store, onChange }: Props) {
  if (!store) {
    return null;
  }
  const st = store as DepartmentTreeStore;
  const status = st.nodeMap[node.id]?.checkStatus;
  const isChecked = status === 'checked';
  const isIndeterminate = status === 'indeterminate';

  const getSelectedData = (departments: Department[][]) => {
    const arr: Department[] = [];
    departments.forEach((dps) => {
      arr.push(last<Department>(dps));
    });
    return arr;
  };

  const handleClick = () => {
    const prevData = getSelectedData(st.selectedDataPaths);
    st.toggleCheck(node.id);
    const currentData = getSelectedData(st.selectedDataPaths);
    onChange(prevData, currentData);
  };

  return (
    <div
      onClick={handleClick}
      className={cs('transition-all py-8 w-full flex items-center justify-between')}
    >
      <div className="ml-2 flex flex-row items-center w-full">
        <Checkbox
          checked={isChecked}
          indeterminate={isIndeterminate}
          onChange={handleClick}
          onClick={(e) => e.stopPropagation()}
        />
        <div className="ml-10 truncate" title={node.name}>
          {node.name}
        </div>
      </div>
    </div>
  );
});
