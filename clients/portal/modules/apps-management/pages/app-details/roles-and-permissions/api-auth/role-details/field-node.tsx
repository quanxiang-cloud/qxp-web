import React, { ChangeEvent } from 'react';
import { NodeRenderProps, TreeNode } from '@c/headless-tree/types';

import Checkbox from '@c/checkbox';
import Icon from '@c/icon';
import { toJS } from 'mobx';

import { Schema } from '@lib/api-adapter/swagger-schema-official';
import TreeStore from '@c/headless-tree/store';

export function clearChildState(
  node: TreeNode<Schema &{acceptable?: boolean}>,
  store: TreeStore<Schema &{acceptable?: boolean}>,
  acceptable: boolean): any {
  const _children = node.children?.forEach((child) => {
    const { data } = child;
    data.acceptable = acceptable;
    store.updateNode({ ...child, data });
    clearChildState(child, store, false);
  });
}

function FieldRender({ node, store }: NodeRenderProps<Schema &{acceptable?: boolean}>): JSX.Element {
  const nodeLabel = node.data.title || node.name;
  const { data } = node;

  function onChange(e: ChangeEvent<HTMLInputElement>): void {
    const { checked } = e.target;
    data.acceptable = checked;
    store.updateNode({ ...node, data });
    if (checked) {
      const parents = store.getNodeParents(node.id);
      parents.forEach((parentNode) => {
        store.updateNode({ ...parentNode, data });
      });
    } else {
      clearChildState(node, store, false);
    }
    console.log(toJS(store.rootNode));
  }

  return (

    <div className=' w-full grid gap-x-16 grid-flow-row-dense p-16 pr-0 grid-cols-4'>
      <Checkbox
        key={node.id}
        className="inline-flex"
        checked={node.data?.acceptable || false}
        // Checked={node.data?.acceptable || false}
        onChange={onChange}
      />
      <div className='inline-flex items-center'>
        {!node.isLeaf && <Icon name={(node.expanded) ? 'folder_open' : 'folder_empty'} size={16} />}
        <span className='ml-5 text-12 truncate w-142'>{nodeLabel}</span>
      </div>
      <div>{node.id || ''}</div>
      <div>{node.data.type}</div>
    </div>
  );
}

export default FieldRender;
