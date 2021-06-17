import React from 'react';

import Icon from '@c/icon';
import { NodeRenderProps } from '@c/headless-tree/types';

function PageItem({ node }: NodeRenderProps<any>): JSX.Element {
  const isPage = node.data.menuType === 0;

  return (
    <div className="flex w-full justify-between items-center">
      {isPage && (<Icon className='mr-8' name={node.data.icon} size={24} />)}
      <span className="truncate flex-1" title={node.name}>
        {node.name}
      </span>
    </div>
  );
}

export default PageItem;
