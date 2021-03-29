import React from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';
import { observer } from 'mobx-react';

import { NodeRenderProps } from '@c/headless-tree/types';
import { Checkbox } from '@QCFE/lego-ui';
import DepartmentTreeStore from './store';
import { last } from '@lib/utils';

export const DepartmentNode = observer(({ node, store }: NodeRenderProps<IDepartment>) => {
  const st = store as DepartmentTreeStore;
  const status = st.nodeMap[node.id]?.checkStatus;
  const isChecked = status === 'checked';
  const isIndeterminate = status === 'indeterminate';

  const getSelectedData = (departments: IDepartment[][]) => {
    const arr: IDepartment[] = [];
    departments.forEach((dps) => {
      arr.push(last<IDepartment>(dps));
    });
    return arr;
  };

  const onChange = () => {
    const prevData = getSelectedData(st.selectedDataPaths);
    st.toggleCheck(node.id);
    const currentData = getSelectedData(st.selectedDataPaths);
    st.onChange(prevData, currentData);
  };

  return (
    <div
      onClick={onChange}
      className={twCascade('transition-all py-8 w-full flex items-center justify-between')}
    >
      <div className="ml-2 flex flex-row items-center">
        <Checkbox
          checked={isChecked}
          indeterminate={isIndeterminate}
          onChange={onChange}
        />
        <div className="ml-10">
          {node.name}
        </div>
      </div>
    </div>
  );
});
