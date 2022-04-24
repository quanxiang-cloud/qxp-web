import React, { ChangeEvent } from 'react';
import cs from 'classnames';

import Checkbox from '@c/checkbox';
import { NodeRenderProps, TreeNode } from '@c/headless-tree/types';
import TreeStore from '@c/headless-tree/store';

export function clearChildState(
  node: TreeNode<SwagField>,
  store: TreeStore<SwagField>,
  acceptable: boolean): any {
  node.children?.forEach((child) => {
    const { data } = child;
    data.acceptable = acceptable;
    store.updateNode({ ...child, data });
    clearChildState(child, store, false);
  });
}

type Props = NodeRenderProps<SwagField> & {
  isAll: boolean;
  type?: string;
}

function FieldRender({ node, store, isAll, type = 'output' }: Props): JSX.Element {
  const nodeLabel = node.data.title || node.name;
  const { data } = node;

  function onChange(e: ChangeEvent<HTMLInputElement>): void {
    const { checked } = e.target;
    data.acceptable = checked;
    // store fun
    store.updateNode({ ...node, data });
    if (checked) {
      const parents = store.getNodeParents(node.id);
      parents.forEach((parentNode) => {
        const { data } = parentNode;
        data.acceptable = checked;
        store.updateNode({ ...parentNode, data });
      });
    } else {
      clearChildState(node, store, false);
    }
  }

  const INIT_WIDTH = 142;
  const PLACEHODER_WIDTH = 16;
  const level = node.isLeaf ? node.level - 1 : node.level;
  const checkboxWidth = INIT_WIDTH - (level * PLACEHODER_WIDTH);

  return (
    <div className={cs('flex justify-end w-full',
    )}>
      <div className='pl-4' style={{ width: `${checkboxWidth}px` }}>
        <Checkbox
          key={node.id}
          disabled={isAll}
          checked={node.data?.acceptable || isAll || false}
          onChange={onChange}
        />
      </div>
      <div className={cs(
        'flex-1 overflow-auto grid gap-x-16 grid-flow-row-dense',
        type === 'output' ? 'grid-cols-3' : 'grid-cols-4',
      )}>
        <div className='truncate pl-4'>{nodeLabel || node.id}</div>
        <div className='truncate'>{node.id || ''}</div>
        <div className='truncate'>{node.data.type}</div>
        {type === 'input' && <div>{node.data?.in || 'body'}</div>}
      </div>

    </div>
  );
}

export default FieldRender;
