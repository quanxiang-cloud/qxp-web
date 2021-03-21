import React from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import { NodeRenderProps } from '@c/headless-tree/types';

export const DepartmentNode = ({ node, store }: NodeRenderProps<IDepartment>) => {
  const curNode = store.currentFocusedNode;

  return (
    <div
      className={twCascade('transition-all py-dot-8')}
    >
      <div className="flex flex-row justify-between">
        <div className="flex items-center">
          <div className="ml-2">
            {node.name}
          </div>
        </div>
      </div>
    </div>
  );
};
