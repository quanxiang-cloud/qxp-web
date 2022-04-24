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

  const checkboxWidth = 142 - ((node.level - 1) * 16);

  return (
    <div className={cs('flex justify-end w-full',
      // 'w-full grid gap-x-16 grid-flow-row-dense p-16', {
      // 'grid-cols-3': isAll && type === 'output',
      // 'grid-cols-4': (!isAll && type === 'output') || (isAll && type === 'input'),
      // 'grid-cols-5': !isAll && type === 'input',
      // },
    )}>
      {!isAll && (
        <div style={{ width: `${checkboxWidth}px` }}>
          <Checkbox
            key={node.id}
            checked={node.data?.acceptable || false}
            onChange={onChange}
          />
        </div>
      )}
      <div className='flex-1 overflow-auto truncate'>{node.level}{nodeLabel || node.id}</div>
      <div className='w-208 truncate'>{node.id || ''}</div>
      <div className='w-208 truncate'>{node.data.type}</div>
      {type === 'input' && <div className='w-208 truncate'>{node.data?.in || 'body'}</div>}
    </div>
  );
}

export default FieldRender;
