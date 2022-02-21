import React from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';

import type { NodeRenderProps } from '@c/headless-tree/types';

import type { TreeNodeDataType } from './type';
import { isNodeSelectEnabled } from './util';

type Props = NodeRenderProps<TreeNodeDataType>

function NodeRender({ node }: Props): JSX.Element | null {
  const isSelectable = isNodeSelectEnabled(node);

  return (
    <div className={cs('transition-all w-full flex items-center justify-between', {
      'cursor-not-allowed': !isSelectable,
    })}>
      <div className="ml-10 truncate" title={node.data.name}>
        {node.data.desc}
        <span className="text-gray-400 ml-4">
          {node.level !== 2 ? `${node.data.name},${node.data.type}` : `${node.data.name}`}
        </span>
      </div>
    </div>
  );
}

export default observer(NodeRender);
