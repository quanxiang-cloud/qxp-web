import React from 'react';
import cs from 'classnames';

import { NodeRenderProps } from '@c/headless-tree/types';

export default function DepartmentNode({ node }: NodeRenderProps<Department>) {
  return (
    <div
      className={cs('transition-all py-8 cursor-pointer')}
    >
      <div className="flex flex-row justify-between items-center">
        <div className="ml-2 whitespace-nowrap">
          {node.name}
        </div>
      </div>
    </div>
  );
}
