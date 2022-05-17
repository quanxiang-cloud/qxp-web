import React from 'react';
import { observer } from 'mobx-react';
import Icon from '@one-for-all/icon';

import { NodeRenderProps } from '@c/headless-tree/types';

export default observer(<T, >({ node }: NodeRenderProps<T>) => {
  return (
    <div
      className="transition-all py-8 w-full flex items-center justify-between"
    >
      <div className="flex items-center w-full">
        <div className="ml-2 truncate w-full font-normal flex justify-between">
          {node.name}
          <Icon name="done" className="picker-selected-icon hidden" color="#375FF3" />
        </div>
      </div>
    </div>
  );
});
