import React from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';
import { observer } from 'mobx-react';

import { NodeRenderProps } from '@c/headless-tree/types';
import { Checkbox } from '@QCFE/lego-ui';
import DepartmentTreeStore from './store';

export const DepartmentNode = observer(({ node, store }: NodeRenderProps<IDepartment>) => {
  const st = store as DepartmentTreeStore;
  const status = st.nodeMap[node.id]?.checkStatus;
  const isChecked = status === 'checked';
  const isIndeterminate = status === 'indeterminate';

  const onChange = () => {
    const prevNodes = st.selectedNodes;
    st.toggleCheck(node.id);
    const currentNodes = st.selectedNodes;
    st.onChange(prevNodes, currentNodes);
  };

  return (
    <div
      onClick={onChange}
      className={twCascade('transition-all py-dot-8 w-full flex items-center justify-between')}
    >
      <div className="flex items-center">
        <div className="ml-2">
          {node.name}
        </div>
      </div>
      <Checkbox
        checked={isChecked}
        indeterminate={isIndeterminate}
        onChange={onChange}
      />
    </div>
  );
});
