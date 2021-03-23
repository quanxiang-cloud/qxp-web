import React from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import { NodeRenderProps } from '@c/headless-tree/types';

export const DepartmentNode = ({ node }: NodeRenderProps<IDepartment>) => {
  return (
    <div
      className={twCascade('transition-all py-dot-8 cursor-pointer')}
    >
      <div className="flex flex-row justify-between items-center">
        <div className="ml-2 whitespace-nowrap">
          {node.name}
        </div>
      </div>
    </div>
  );
};
