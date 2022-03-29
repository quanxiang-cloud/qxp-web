import React from 'react';

import { NodeRenderProps } from '@c/headless-tree/types';
import Icon from '@c/icon';

function NodeRender({ node }: NodeRenderProps<PolyAPI.Namespace>): JSX.Element {
  const nodeLabel = node.data.title || node.name;

  return (
    <div className="flex items-center flex-grow max-w-full">
      <span
        className='truncate mr-auto inline-flex flex-1'
        title={nodeLabel}
      >
        <span className='inline-flex items-center'>
          {!node.isLeaf &&
          <Icon name={(node.expanded) ? 'folder_open' : 'folder_empty'} size={16} />
          }
          <span className='ml-5 text-12 truncate w-142'>{nodeLabel}</span>
        </span>
      </span>
    </div>
  );
}

export default NodeRender;
