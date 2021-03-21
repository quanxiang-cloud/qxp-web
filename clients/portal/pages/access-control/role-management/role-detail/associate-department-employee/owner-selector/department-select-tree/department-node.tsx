import React from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import { NodeRenderProps } from '@c/headless-tree/types';
import SelectableTreeStore from '@portal/components/headless-tree/multiple-select-tree';
import { Checkbox } from '@QCFE/lego-ui';

export const DepartmentNode = ({ node, store }: NodeRenderProps<IDepartment>) => {
  const st = store as SelectableTreeStore<IDepartment>;
  const status = st.nodeMap[node.id]?.checkStatus;
  const isChecked = status === 'checked';
  const isIndeterminate = status === 'indeterminate';

  return (
    <div
      onClick={() => st.toggleCheck(node.id)}
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
      />
    </div>
  );
};
