import React from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import { NodeRenderProps } from '@c/headless-tree/types';

export default function DepartmentNode({ node }: NodeRenderProps<Department>) {
  return (
    <div
      className={twCascade('transition-all py-8 cursor-pointer')}
    >
      <div className="flex flex-row justify-between items-center">
        <div className="ml-2 whitespace-nowrap">
          {node.name}
        </div>
      </div>
    </div>
  );
}
