import React, { ChangeEvent } from 'react';
import cs from 'classnames';

import Checkbox from '@c/checkbox';
import { NodeRenderProps, TreeNode } from '@c/headless-tree/types';
import TreeStore from '@c/headless-tree/store';

export function clearChildState(
  node: TreeNode<TreeField>,
  store: TreeStore<TreeField>,
  acceptable: boolean): any {
  node.children?.forEach((child) => {
    const { data } = child;
    data.acceptable = acceptable;
    store.updateNode({ ...child, data });
    clearChildState(child, store, false);
  });
}

type Props = NodeRenderProps<TreeField> & {
  isAll: boolean;
  type?: string;
}

function FieldRender({ node, store, isAll, type = 'output' }: Props): JSX.Element {
  const nodeLabel = node.data.title || node.name;
  const { data } = node;

  function onChange(e: ChangeEvent<HTMLInputElement>): void {
    const { checked } = e.target;
    data.acceptable = checked;
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

  return (
    <div className={cs(
      'w-full grid gap-x-16 grid-flow-row-dense p-16', {
        'grid-cols-3': isAll && type === 'output',
        'grid-cols-4': (!isAll && type === 'output') || (isAll && type === 'input'),
        'grid-cols-5': !isAll && type === 'input',
      },
    )}>
      {!isAll && (<Checkbox
        key={node.id}
        className="inline-flex"
        checked={node.data?.acceptable || false}
        onChange={onChange}
      />)
      }
      <div>{nodeLabel || node.id}</div>
      <div>{node.id || ''}</div>
      <div>{node.data.type}</div>
      {type === 'input' && <div>{node.data?.in || 'body'}</div>}
    </div>
  );
}

export default FieldRender;
