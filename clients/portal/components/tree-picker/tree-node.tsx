import React from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';
import { observer } from 'mobx-react';

import { NodeRenderProps } from '@c/headless-tree/types';

export default observer(<T extends unknown>({ node }: NodeRenderProps<T>) => {
  return (
    <div
      className={twCascade('transition-all py-8 w-full flex items-center justify-between')}
    >
      <div className="flex items-center">
        <div className="ml-2">
          {node.name}
        </div>
      </div>
    </div>
  );
});
